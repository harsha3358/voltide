// Talks to the Google Apps Script web app in google-sheets/Code.gs.
// The deployed web app URL is built in below. To point at a different
// deployment, set VITE_SHEETS_API (Vercel → Settings → Environment Variables,
// or a local .env file). Set VITE_SHEETS_API=off to run with no login.
const DEPLOYED_API = 'https://script.google.com/macros/s/AKfycbx18JqnShcj5Uxtyv5fNXEIEqGodS3t06-aObOID50a32GiVQx23evUs8uut-tgynFlUA/exec';
const configured = String(import.meta.env.VITE_SHEETS_API ?? '').trim();
const API = configured.toLowerCase() === 'off' ? '' : configured || DEPLOYED_API;
export const backendEnabled = Boolean(API);

export class ApiError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

// A short, readable device name for the Logins sheet.
export function deviceName() {
  const ua = navigator.userAgent;
  const os = /Android/.test(ua) ? 'Android' : /iPhone|iPad/.test(ua) ? 'iOS' : /Windows/.test(ua) ? 'Windows' : /Mac OS/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : 'Other';
  const br = /Edg\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /Chrome\//.test(ua) ? 'Chrome' : /Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Browser';
  return `${br} on ${os} · ${window.innerWidth}×${window.innerHeight}`;
}

// POST as text/plain so the browser skips the CORS preflight that Apps Script
// can't answer. The script replies with JSON: { ok, data } or { ok, code, error }.
export async function api(action, payload = {}, { timeout = 25000 } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action, device: deviceName(), ...payload }),
      signal: ctrl.signal,
      redirect: 'follow'
    });
    if (!res.ok) throw new ApiError(res.status, `The server answered ${res.status}.`);
    let data;
    try {
      data = await res.json();
    } catch {
      throw new ApiError(500, 'The server sent back something odd.');
    }
    if (!data.ok) throw new ApiError(data.code || 500, data.error || 'Something went wrong.');
    return data.data;
  } catch (e) {
    if (e instanceof ApiError) throw e;
    if (e.name === 'AbortError') throw new ApiError(408, 'The server took too long to answer.');
    throw new ApiError(0, 'Couldn’t reach the server. Check your internet.');
  } finally {
    clearTimeout(timer);
  }
}

// Fire-and-forget, safe to call while the page is closing.
export function beacon(action, payload = {}) {
  if (!backendEnabled) return false;
  const body = JSON.stringify({ action, device: deviceName(), ...payload });
  try {
    if (navigator.sendBeacon?.(API, new Blob([body], { type: 'text/plain;charset=utf-8' }))) return true;
  } catch {}
  fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body, keepalive: true }).catch(() => {});
  return true;
}
