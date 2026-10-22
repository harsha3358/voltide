import { api, backendEnabled, beacon } from './backend.js';
import { dropLocal, getAuth, progressSnapshot } from './auth.js';

// Learning activity for the Google Sheet. Events queue up here and go out in
// batches (every 30 s, or at once when the tab is hidden or closed), each
// with a snapshot of the student's progress so the sheet is always current.
const queue = [];
let timer = 0;
let summary = () => ({});

// game.js registers how to read XP, rank and badge count (avoids an import cycle).
export function setSummary(fn) {
  summary = fn;
}

const episodeOf = hash => (hash.match(/#\/session\/(\d)/) || [])[1] || '';

export function track(type, item = '', detail = '', extra = {}) {
  if (!backendEnabled || !getAuth()) return;
  const page = window.location.hash || '#/';
  queue.push({ t: new Date().toISOString(), type, item: String(item), detail: String(detail), episode: episodeOf(page) ? `Episode 0${episodeOf(page)}` : '', page, ...extra });
  if (queue.length >= 25) flush();
  else if (!timer) timer = setTimeout(flush, 30000);
}

function snapshot() {
  let missions = 0;
  let unlocked = '1';
  try {
    missions = Object.keys(JSON.parse(localStorage.getItem('voltide:progress') || '{}')).length;
    unlocked = ['1', ...JSON.parse(localStorage.getItem('voltide:unlocked') || '[]')].join(',');
  } catch {}
  return { ...summary(), missions, unlocked, page: window.location.hash || '#/', progress: progressSnapshot() };
}

let sending = false;
let lastSent = 0;
export async function flush(closing = false) {
  clearTimeout(timer);
  timer = 0;
  const auth = getAuth();
  if (!backendEnabled || !auth || (sending && !closing)) return;
  if (closing && !queue.length && Date.now() - lastSent < 20000) return;
  lastSent = Date.now();
  const events = queue.splice(0, queue.length);
  const body = { token: auth.token, events, snapshot: snapshot() };
  if (closing) {
    beacon('track', body);
    return;
  }
  sending = true;
  try {
    await api('track', body);
  } catch (e) {
    if (e.code === 401) {
      // Login expired: back to the login screen (progress is already saved).
      dropLocal();
      window.location.reload();
      return;
    }
    queue.unshift(...events); // offline or busy: try again with the next batch
    if (!timer) timer = setTimeout(flush, 60000);
  } finally {
    sending = false;
  }
}

if (backendEnabled && typeof window !== 'undefined') {
  document.addEventListener('visibilitychange', () => document.visibilityState === 'hidden' && flush(true));
  window.addEventListener('pagehide', () => flush(true));
  // A heartbeat so "last active" stays fresh while someone is reading.
  setInterval(() => getAuth() && document.visibilityState === 'visible' && flush(), 120000);
}
