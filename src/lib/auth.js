import { useEffect, useState } from 'react';
import { api, backendEnabled } from './backend.js';

// Who is logged in on this browser, and the switch between students on a
// shared lab PC. Progress is saved to the Google Sheet with every activity
// batch, and restored here when a student logs in on any device.
const KEY = 'voltide:auth';
const OWNER = 'voltide:owner';
const EVENT = 'voltide:auth';
// localStorage keys that are this device's settings or login, not progress.
const NOT_PROGRESS = new Set(['voltide:lite', KEY, OWNER]);

// Google Sheets turns all-digit registration numbers into numbers, so the
// user fields are always normalised to text.
const norm = u => ({ regNo: String(u?.regNo ?? ''), name: String(u?.name ?? ''), email: String(u?.email ?? '') });

function read() {
  try {
    const a = JSON.parse(localStorage.getItem(KEY) || 'null');
    return a?.token && a?.user ? { token: a.token, user: norm(a.user) } : null;
  } catch {
    return null;
  }
}

let auth = read();

export const getAuth = () => auth;

export function useAuth() {
  const [a, setA] = useState(auth);
  useEffect(() => {
    const sync = () => setA(auth);
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);
  return a;
}

const progressKeys = () => Object.keys(localStorage).filter(k => k.startsWith('voltide:') && !NOT_PROGRESS.has(k));

// Everything that makes up a student's progress, as raw localStorage strings.
export function progressSnapshot() {
  const out = {};
  try {
    progressKeys().forEach(k => (out[k] = localStorage.getItem(k)));
  } catch {}
  return out;
}

const xpOf = raw => {
  try {
    return JSON.parse(raw || '{}').xp || 0;
  } catch {
    return 0;
  }
};

function applySession({ token, user: raw, progress }) {
  const user = norm(raw);
  try {
    const owner = localStorage.getItem(OWNER);
    // Someone else's progress on this PC: clear it before loading ours.
    if (owner && owner !== user.regNo) progressKeys().forEach(k => localStorage.removeItem(k));
    // Use the saved progress unless this browser is ahead (offline work not yet synced).
    if (progress && typeof progress === 'object' && xpOf(progress['voltide:game']) >= xpOf(localStorage.getItem('voltide:game'))) {
      progressKeys().forEach(k => localStorage.removeItem(k));
      Object.entries(progress).forEach(([k, v]) => k.startsWith('voltide:') && !NOT_PROGRESS.has(k) && typeof v === 'string' && localStorage.setItem(k, v));
    }
    localStorage.setItem(OWNER, user.regNo);
    localStorage.setItem(KEY, JSON.stringify({ token, user }));
  } catch {}
  // Reload so every part of the app starts from this student's progress.
  window.location.reload();
}

export const signup = async f => applySession(await api('signup', f));
export const login = async (id, password) => applySession(await api('login', { id, password }));
export const requestOtp = (id, purpose) => api('requestOtp', { id, purpose });
export const resetPassword = async (id, otp, newPassword) => applySession(await api('resetPassword', { id, otp, newPassword }));

// Log out: progress stays saved in the sheet; this browser is wiped clean
// for the next student.
export async function logout(flush) {
  const token = auth?.token;
  try {
    await flush?.();
  } catch {}
  if (token) api('logout', { token }).catch(() => {});
  dropLocal();
  window.location.hash = '#/';
  window.location.reload();
}

export function dropLocal() {
  try {
    progressKeys().forEach(k => localStorage.removeItem(k));
    localStorage.removeItem(KEY);
    localStorage.removeItem(OWNER);
  } catch {}
  auth = null;
  window.dispatchEvent(new Event(EVENT));
}

// On start-up, check the saved login is still valid. Offline is fine: keep going.
export async function verify() {
  if (!backendEnabled || !auth) return;
  try {
    const d = await api('me', { token: auth.token });
    auth = { ...auth, user: norm(d.user) };
    localStorage.setItem(KEY, JSON.stringify(auth));
    window.dispatchEvent(new Event(EVENT));
  } catch (e) {
    if (e.code === 401) {
      dropLocal();
    }
  }
}
