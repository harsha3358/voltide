/**
 * VOLTIDE · Google Sheets backend (Google Apps Script web app)
 *
 * Accounts (sign up, log in, OTP password reset / change), login history,
 * learning activity and saved progress, all stored in one Google Sheet.
 *
 * Setup (full steps in google-sheets/README.md):
 *   1. Open the sheet → Extensions → Apps Script, paste this whole file.
 *   2. Run `setup` once (approve the permissions).
 *   3. Deploy → New deployment → Web app · Execute as: Me · Who has access: Anyone.
 *   4. Put the web app URL in Vercel as VITE_SHEETS_API and redeploy the site.
 *
 * The site talks to this script with POST requests whose body is JSON
 * ({ action, ...fields }). Every reply is JSON: { ok: true, data } or
 * { ok: false, code, error }. Apps Script can't set HTTP status codes, so
 * `code` carries the meaning (400, 401, 403, 404, 409, 410, 429, 500).
 */

const SHEET_ID = '15bMM6BLLT0-MfPz6LCke1SzORNdXietU_ySdHOvtL_g';
const APP_NAME = 'VOLTIDE';
const SITE_URL = 'https://voltide.vercel.app/';
const SESSION_DAYS = 14; // how long a login lasts on one device
const OTP_MINUTES = 10; // how long an emailed code is valid
const OTP_RESEND_SECONDS = 60; // minimum gap between two codes
const OTP_MAX_TRIES = 5; // wrong codes allowed before asking for a new one
const LOGIN_MAX_FAILS = 5; // wrong passwords before a short lock
const LOGIN_LOCK_MINUTES = 15;
const HASH_ROUNDS = 1000; // password hashing work factor
const MAX_EVENTS_PER_CALL = 200;

const COLUMNS = {
  Students: ['Registration No', 'Name', 'Email', 'Signed up', 'Last login', 'Logins', 'Last active', 'XP', 'Rank', 'Badges', 'Missions done', 'Episodes unlocked', 'Current page', 'Password hash', 'Salt', 'Progress (JSON)'],
  Logins: ['Time', 'Registration No', 'Name', 'Email', 'Event', 'Device'],
  Activity: ['Time', 'Registration No', 'Name', 'Episode', 'Type', 'Item', 'Detail', 'XP gained', 'Total XP', 'Page'],
  Sessions: ['Token', 'Registration No', 'Created', 'Expires', 'Device'],
  OTP: ['Registration No', 'Email', 'Code hash', 'Expires', 'Attempts', 'Purpose', 'Created']
};
// Columns that hold registration numbers. They're kept as plain text so
// Sheets never turns "24101234" into a number or drops a leading zero.
const TEXT_COLS = { Students: [1], Sessions: [2], OTP: [1], Logins: [2], Activity: [2] };
// Student columns (1-based) used below.
const S = { reg: 1, name: 2, email: 3, created: 4, lastLogin: 5, logins: 6, lastActive: 7, xp: 8, rank: 9, badges: 10, missions: 11, unlocked: 12, page: 13, hash: 14, salt: 15, progress: 16 };

/* ------------------------------------------------------------------ */
/* Entry points                                                        */
/* ------------------------------------------------------------------ */

function doGet() {
  return json({ ok: true, data: { app: APP_NAME, time: new Date().toISOString() } });
}

function doPost(e) {
  let body;
  try {
    body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return json(fail(400, 'That request was not valid JSON.'));
  }
  const routes = { signup, login, logout, me, requestOtp, resetPassword, track };
  const handler = routes[body.action];
  if (!handler) return json(fail(400, 'Unknown action.'));
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(25000);
  } catch (err) {
    return json(fail(503, 'The server is busy. Try again in a few seconds.'));
  }
  try {
    return json({ ok: true, data: handler(body) });
  } catch (err) {
    if (err && err.code) return json(fail(err.code, err.message));
    console.error(err);
    return json(fail(500, 'Something broke on the server.'));
  } finally {
    lock.releaseLock();
  }
}

/* ------------------------------------------------------------------ */
/* Actions                                                             */
/* ------------------------------------------------------------------ */

function signup(b) {
  const reg = cleanReg(b.regNo);
  const name = cleanText(b.name, 60);
  const email = cleanEmail(b.email);
  if (!reg) throw httpError(400, 'Enter your registration number (letters and numbers only).');
  if (name.length < 2) throw httpError(400, 'Enter your full name.');
  if (!email) throw httpError(400, 'Enter a valid email address.');
  checkPassword(b.password);
  if (findStudent(reg)) throw httpError(409, 'This registration number already has an account. Log in instead.');
  if (findStudentByEmail(email)) throw httpError(409, 'This email already has an account. Log in instead.');
  const salt = Utilities.getUuid();
  const now = new Date();
  const row = new Array(COLUMNS.Students.length).fill('');
  row[S.reg - 1] = reg;
  row[S.name - 1] = name;
  row[S.email - 1] = email;
  row[S.created - 1] = now;
  row[S.lastLogin - 1] = now;
  row[S.logins - 1] = 1;
  row[S.lastActive - 1] = now;
  row[S.xp - 1] = 0;
  row[S.rank - 1] = 'Recruit';
  row[S.badges - 1] = 0;
  row[S.missions - 1] = 0;
  row[S.unlocked - 1] = '1';
  row[S.hash - 1] = hashPassword(b.password, salt);
  row[S.salt - 1] = salt;
  addRow('Students', row.map(safe));
  logLogin(reg, name, email, 'Signed up', b.device);
  return { token: newSession(reg, b.device), user: { regNo: reg, name: name, email: email }, progress: null };
}

function login(b) {
  const found = findStudent(b.id) || findStudentByEmail(b.id);
  if (!found) throw httpError(404, 'No account with that registration number or email. Sign up first.');
  const reg = String(found.values[S.reg - 1]);
  const cache = CacheService.getScriptCache();
  const failKey = 'fail:' + reg;
  const fails = Number(cache.get(failKey) || 0);
  if (fails >= LOGIN_MAX_FAILS) throw httpError(429, 'Too many wrong passwords. Wait ' + LOGIN_LOCK_MINUTES + ' minutes, or reset your password with an OTP.');
  if (hashPassword(String(b.password || ''), found.values[S.salt - 1]) !== found.values[S.hash - 1]) {
    cache.put(failKey, String(fails + 1), LOGIN_LOCK_MINUTES * 60);
    logLogin(reg, found.values[S.name - 1], found.values[S.email - 1], 'Wrong password', b.device);
    throw httpError(401, 'Wrong password. ' + (LOGIN_MAX_FAILS - fails - 1) + ' tries left before a short lock.');
  }
  cache.remove(failKey);
  const sh = sheet('Students');
  const now = new Date();
  sh.getRange(found.row, S.lastLogin).setValue(now);
  sh.getRange(found.row, S.logins).setValue(Number(found.values[S.logins - 1] || 0) + 1);
  sh.getRange(found.row, S.lastActive).setValue(now);
  logLogin(reg, found.values[S.name - 1], found.values[S.email - 1], 'Logged in', b.device);
  return { token: newSession(reg, b.device), user: userOf(found.values), progress: readProgress(found.row) };
}

function logout(b) {
  const s = readSession(b.token);
  if (s) {
    dropSessions(function (t) {
      return t === b.token;
    });
    const st = findStudent(s.reg);
    if (st) logLogin(s.reg, st.values[S.name - 1], st.values[S.email - 1], 'Logged out', b.device);
  }
  return {};
}

function me(b) {
  const st = requireUser(b.token);
  return { user: userOf(st.values), progress: readProgress(st.row) };
}

// Sends a 6-digit code to the student's email (for "forgot password" and
// "change password").
function requestOtp(b) {
  const st = findStudent(b.id) || findStudentByEmail(b.id);
  if (!st) throw httpError(404, 'No account with that registration number or email.');
  const reg = String(st.values[S.reg - 1]);
  const email = st.values[S.email - 1];
  const cache = CacheService.getScriptCache();
  if (cache.get('otp-wait:' + reg)) throw httpError(429, 'A code was just sent. Wait a minute before asking for another.');
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const now = new Date();
  const otp = sheet('OTP');
  deleteRows(otp, function (r) {
    return String(r[0]) === reg;
  });
  addRow('OTP', [reg, email, sha(code + reg), new Date(now.getTime() + OTP_MINUTES * 60000), 0, b.purpose === 'change' ? 'Change password' : 'Forgot password', now]);
  cache.put('otp-wait:' + reg, '1', OTP_RESEND_SECONDS);
  MailApp.sendEmail({
    to: email,
    subject: APP_NAME + ' code: ' + code,
    htmlBody:
      '<div style="font-family:Arial,sans-serif;font-size:15px;color:#111">' +
      '<p>Hi ' + escapeHtml(st.values[S.name - 1]) + ',</p>' +
      '<p>Your ' + APP_NAME + ' code to ' + (b.purpose === 'change' ? 'change' : 'reset') + ' your password is:</p>' +
      '<p style="font-size:32px;font-weight:bold;letter-spacing:6px">' + code + '</p>' +
      '<p>It works for ' + OTP_MINUTES + ' minutes. If you didn’t ask for this, ignore this email; your password stays the same.</p>' +
      '<p>— ' + APP_NAME + ' · <a href="' + SITE_URL + '">' + SITE_URL + '</a></p></div>',
    name: APP_NAME
  });
  logLogin(reg, st.values[S.name - 1], email, 'OTP sent (' + (b.purpose === 'change' ? 'change' : 'forgot') + ')', b.device);
  return { sentTo: maskEmail(email), minutes: OTP_MINUTES };
}

// Checks the emailed code, sets the new password and logs the student in.
function resetPassword(b) {
  const st = findStudent(b.id) || findStudentByEmail(b.id);
  if (!st) throw httpError(404, 'No account with that registration number or email.');
  const reg = String(st.values[S.reg - 1]);
  const otp = sheet('OTP');
  const rows = otp.getDataRange().getValues();
  let at = -1;
  for (let i = 1; i < rows.length; i++) if (String(rows[i][0]) === reg) at = i;
  if (at < 0) throw httpError(410, 'No active code. Ask for a new one.');
  const r = rows[at];
  if (new Date(r[3]).getTime() < Date.now()) throw httpError(410, 'That code has expired. Ask for a new one.');
  if (Number(r[4]) >= OTP_MAX_TRIES) throw httpError(429, 'Too many wrong codes. Ask for a new one.');
  if (sha(String(b.otp || '').trim() + reg) !== r[2]) {
    otp.getRange(at + 1, 5).setValue(Number(r[4]) + 1);
    throw httpError(401, 'That code is not right. Check the email and try again.');
  }
  checkPassword(b.newPassword);
  const salt = Utilities.getUuid();
  const sh = sheet('Students');
  sh.getRange(st.row, S.hash).setValue(hashPassword(b.newPassword, salt));
  sh.getRange(st.row, S.salt).setValue(salt);
  sh.getRange(st.row, S.lastLogin).setValue(new Date());
  sh.getRange(st.row, S.logins).setValue(Number(st.values[S.logins - 1] || 0) + 1);
  otp.deleteRow(at + 1);
  CacheService.getScriptCache().remove('fail:' + reg);
  // Changing the password logs the account out everywhere else.
  dropSessions(function (t, r2) {
    return String(r2) === reg;
  });
  logLogin(reg, st.values[S.name - 1], st.values[S.email - 1], 'Password changed', b.device);
  return { token: newSession(reg, b.device), user: userOf(st.values), progress: readProgress(st.row) };
}

// A batch of learning events plus a snapshot of the student's progress.
function track(b) {
  const st = requireUser(b.token);
  const reg = String(st.values[S.reg - 1]);
  const name = st.values[S.name - 1];
  const events = (Array.isArray(b.events) ? b.events : []).slice(0, MAX_EVENTS_PER_CALL);
  if (events.length) {
    const rows = events.map(function (ev) {
      return [toDate(ev.t), reg, name, cleanText(ev.episode, 20), cleanText(ev.type, 40), cleanText(ev.item, 120), cleanText(ev.detail, 300), Number(ev.xp) || '', Number(ev.total) || '', cleanText(ev.page, 120)].map(safe);
    });
    const act = sheet('Activity');
    const start = act.getLastRow() + 1;
    act.getRange(start, 2, rows.length, 1).setNumberFormat('@');
    act.getRange(start, 1, rows.length, rows[0].length).setValues(rows);
  }
  const s = b.snapshot;
  if (s && typeof s === 'object') {
    const sh = sheet('Students');
    sh.getRange(st.row, S.lastActive, 1, 7).setValues([
      [new Date(), Number(s.xp) || 0, safe(cleanText(s.rank, 40)), Number(s.badges) || 0, Number(s.missions) || 0, safe(cleanText(s.unlocked, 20)), safe(cleanText(s.page, 120))]
    ]);
    if (s.progress) {
      const p = JSON.stringify(s.progress);
      if (p.length < 45000) sh.getRange(st.row, S.progress).setValue(p);
    }
  }
  return { saved: events.length };
}

/* ------------------------------------------------------------------ */
/* One-time setup: run this from the editor                            */
/* ------------------------------------------------------------------ */

function setup() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  Object.keys(COLUMNS).forEach(function (name) {
    let sh = ss.getSheetByName(name);
    if (!sh) sh = ss.insertSheet(name);
    const head = sh.getRange(1, 1, 1, COLUMNS[name].length);
    head.setValues([COLUMNS[name]]).setFontWeight('bold').setBackground('#0b3a66').setFontColor('#ffffff');
    sh.setFrozenRows(1);
  });
  const students = ss.getSheetByName('Students');
  students.hideColumns(S.hash, 3); // password hash, salt, progress JSON
  ss.getSheetByName('Sessions').hideSheet();
  ss.getSheetByName('OTP').hideSheet();
  Object.keys(TEXT_COLS).forEach(function (n) {
    TEXT_COLS[n].forEach(function (c) {
      ss.getSheetByName(n).getRange(1, c, ss.getSheetByName(n).getMaxRows(), 1).setNumberFormat('@');
    });
  });
  ss.getSheetByName('Logins').getRange('A:A').setNumberFormat('dd mmm yyyy, hh:mm');
  ss.getSheetByName('Activity').getRange('A:A').setNumberFormat('dd mmm yyyy, hh:mm:ss');
  ['D:E', 'G:G'].forEach(function (r) {
    students.getRange(r).setNumberFormat('dd mmm yyyy, hh:mm');
  });

  let ov = ss.getSheetByName('Overview');
  if (!ov) ov = ss.insertSheet('Overview', 0);
  ov.clear();
  ov.getRange('A1').setValue(APP_NAME + ' · live overview').setFontSize(16).setFontWeight('bold');
  ov.getRange('A3:B9').setValues([
    ['Students signed up', '=COUNTA(Students!A2:A)'],
    ['Logged in today', '=COUNTIFS(Logins!E2:E,"Logged in",Logins!A2:A,">="&TODAY())'],
    ['Active in the last hour', '=COUNTIF(Students!G2:G,">="&(NOW()-1/24))'],
    ['Missions completed (all students)', '=SUM(Students!K2:K)'],
    ['Average XP', '=IFERROR(ROUND(AVERAGE(Students!H2:H)),0)'],
    ['Activity events logged', '=COUNTA(Activity!A2:A)'],
    ['Failed logins today', '=COUNTIFS(Logins!E2:E,"Wrong password",Logins!A2:A,">="&TODAY())']
  ]);
  ov.getRange('A3:A9').setFontWeight('bold');
  ov.getRange('D2').setValue('Leaderboard (top 15 by XP)').setFontWeight('bold');
  ov.getRange('D3').setFormula('=IFERROR(QUERY(Students!A2:K,"select B, A, H, I, K where A is not null order by H desc limit 15 label B \'Name\', A \'Reg No\', H \'XP\', I \'Rank\', K \'Missions\'",0),"No students yet")');
  ov.getRange('J2').setValue('Last 15 logins').setFontWeight('bold');
  ov.getRange('J3').setFormula('=IFERROR(QUERY(Logins!A2:E,"select A, C, B, E where A is not null order by A desc limit 15 label A \'Time\', C \'Name\', B \'Reg No\', E \'Event\'",0),"")');
  ov.setColumnWidths(1, 1, 260);
  return 'Setup done';
}

// Optional: run on a daily time trigger to clear expired sessions and codes.
function cleanup() {
  const now = Date.now();
  dropSessions(function (t, reg, expires) {
    return new Date(expires).getTime() < now;
  });
  deleteRows(sheet('OTP'), function (r) {
    return new Date(r[3]).getTime() < now;
  });
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

// Appends one row, with the registration-number column formatted as text first.
function addRow(name, row) {
  const sh = sheet(name);
  const r = sh.getLastRow() + 1;
  (TEXT_COLS[name] || []).forEach(function (c) {
    sh.getRange(r, c).setNumberFormat('@');
  });
  sh.getRange(r, 1, 1, row.length).setValues([row]);
}

function sheet(name) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.getRange(1, 1, 1, COLUMNS[name].length).setValues([COLUMNS[name]]).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

// Student lookups read only the first 15 columns; the (large) progress JSON
// in column 16 is read on its own with readProgress().
function findStudent(regNo) {
  const reg = cleanReg(regNo);
  if (!reg) return null;
  return findRow(sheet('Students'), function (r) {
    const v = r[S.reg - 1];
    // Rows saved before the text fix may hold a number with its leading zeros lost.
    return String(v) === reg || (typeof v === 'number' && String(v) === reg.replace(/^0+(?=\d)/, ''));
  }, S.salt);
}

function findStudentByEmail(email) {
  const e = cleanEmail(email);
  if (!e) return null;
  return findRow(sheet('Students'), function (r) {
    return String(r[S.email - 1]).toLowerCase() === e;
  }, S.salt);
}

function findRow(sh, test, width) {
  const last = sh.getLastRow();
  if (last < 2) return null;
  const rows = sh.getRange(2, 1, last - 1, width || sh.getLastColumn()).getValues();
  for (let i = 0; i < rows.length; i++) if (test(rows[i])) return { row: i + 2, values: rows[i] };
  return null;
}

function readProgress(row) {
  return parseProgress(sheet('Students').getRange(row, S.progress).getValue());
}

function deleteRows(sh, test) {
  const rows = sh.getDataRange().getValues();
  for (let i = rows.length - 1; i >= 1; i--) if (test(rows[i])) sh.deleteRow(i + 1);
}

function newSession(reg, device) {
  const token = Utilities.getUuid() + Utilities.getUuid().replace(/-/g, '');
  const now = new Date();
  const expires = new Date(now.getTime() + SESSION_DAYS * 86400000);
  addRow('Sessions', [token, reg, now, expires, safe(cleanText(device, 120))]);
  CacheService.getScriptCache().put('s:' + token, reg + '|' + expires.getTime(), 21600);
  return token;
}

function readSession(token) {
  if (!token || typeof token !== 'string') return null;
  const cache = CacheService.getScriptCache();
  const hit = cache.get('s:' + token);
  if (hit) {
    const parts = hit.split('|');
    if (Number(parts[1]) > Date.now()) return { reg: String(parts[0]) };
  }
  const found = findRow(sheet('Sessions'), function (r) {
    return r[0] === token;
  });
  if (!found || new Date(found.values[3]).getTime() < Date.now()) return null;
  cache.put('s:' + token, found.values[1] + '|' + new Date(found.values[3]).getTime(), 21600);
  return { reg: String(found.values[1]) };
}

function dropSessions(test) {
  const sh = sheet('Sessions');
  const rows = sh.getDataRange().getValues();
  const cache = CacheService.getScriptCache();
  for (let i = rows.length - 1; i >= 1; i--) {
    if (test(rows[i][0], rows[i][1], rows[i][3])) {
      cache.remove('s:' + rows[i][0]);
      sh.deleteRow(i + 1);
    }
  }
}

function requireUser(token) {
  const s = readSession(token);
  if (!s) throw httpError(401, 'Your login expired. Please log in again.');
  const st = findStudent(s.reg);
  if (!st) throw httpError(401, 'Account not found. Please log in again.');
  return st;
}

function logLogin(reg, name, email, event, device) {
  addRow('Logins', [new Date(), String(reg), name, email, event, cleanText(device, 160)].map(safe));
}

function userOf(v) {
  return { regNo: String(v[S.reg - 1]), name: String(v[S.name - 1]), email: String(v[S.email - 1]) };
}

function parseProgress(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (err) {
    return null;
  }
}

function hashPassword(password, salt) {
  let h = salt + '|' + password;
  for (let i = 0; i < HASH_ROUNDS; i++) h = sha(h + salt);
  return h;
}

function sha(text) {
  return Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, text, Utilities.Charset.UTF_8));
}

function checkPassword(p) {
  if (typeof p !== 'string' || p.length < 8) throw httpError(400, 'Password must be at least 8 characters.');
  if (p.length > 100) throw httpError(400, 'That password is too long.');
}

function cleanReg(v) {
  const r = String(v || '').trim().toUpperCase();
  return /^[A-Z0-9][A-Z0-9\-\/]{2,24}$/.test(r) ? r : '';
}

function cleanEmail(v) {
  const e = String(v || '').trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) && e.length <= 120 ? e : '';
}

function cleanText(v, max) {
  return String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max);
}

// Stops text like "=IMPORTXML(...)" being run as a formula in the sheet.
function safe(v) {
  return typeof v === 'string' && /^[=+\-@]/.test(v) ? "'" + v : v;
}

function toDate(t) {
  const d = new Date(t);
  return isNaN(d.getTime()) || Math.abs(d.getTime() - Date.now()) > 7 * 86400000 ? new Date() : d;
}

function maskEmail(e) {
  const at = e.indexOf('@');
  return e.slice(0, Math.min(2, at)) + '•••' + e.slice(at);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
  });
}

function httpError(code, message) {
  const e = new Error(message);
  e.code = code;
  return e;
}

function fail(code, error) {
  return { ok: false, code: code, error: error };
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
