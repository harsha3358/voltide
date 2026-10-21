import { useEffect, useState } from 'react';
import { sha256 } from './sha256.js';

const KEY = 'voltide:unlocked';
const EVENT = 'voltide:unlock';

// Sessions listed in VITE_UNLOCKED_SESSIONS (e.g. "1,2") ship unlocked in a build.
const releasedAtBuild = new Set(
  String(import.meta.env.VITE_UNLOCKED_SESSIONS || '')
    .split(',')
    .map(s => Number(s.trim()))
    .filter(Boolean)
);

function readStored() {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY) || '[]'));
  } catch {
    return new Set();
  }
}

export function isUnlocked(session) {
  return !session.locked || releasedAtBuild.has(session.number) || readStored().has(session.number);
}

export function tryUnlock(session, code) {
  if (sha256(String(code).trim().toUpperCase()) !== session.unlockHash) return false;
  const stored = readStored();
  stored.add(session.number);
  try {
    localStorage.setItem(KEY, JSON.stringify([...stored]));
  } catch {
    // Private windows can refuse storage; the unlock still holds for this page view.
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: session.number }));
  return true;
}

export function relockAll() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
  window.dispatchEvent(new CustomEvent(EVENT));
}

// Re-renders the caller whenever any session is unlocked or relocked.
export function useLockVersion() {
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const bump = () => setVersion(v => v + 1);
    window.addEventListener(EVENT, bump);
    window.addEventListener('storage', bump);
    return () => {
      window.removeEventListener(EVENT, bump);
      window.removeEventListener('storage', bump);
    };
  }, []);
  return version;
}
