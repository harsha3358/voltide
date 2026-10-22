import { useCallback, useEffect, useState } from 'react';
import { track } from './track.js';

const KEY = 'voltide:progress';
const EVENT = 'voltide:progress';

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

// Per-viewer record of finished topics, keyed "sessionNumber:topicId".
export function useProgress() {
  const [done, setDone] = useState(read);
  useEffect(() => {
    const sync = () => setDone(read());
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);
  const toggle = useCallback((session, topic) => {
    const next = { ...read() };
    const key = `${session}:${topic}`;
    if (next[key]) delete next[key];
    else next[key] = Date.now();
    track(next[key] ? 'Mission done' : 'Mission undone', `Episode 0${session} · ${topic}`);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
    setDone(next);
    window.dispatchEvent(new Event(EVENT));
  }, []);
  const isDone = useCallback((session, topic) => Boolean(done[`${session}:${topic}`]), [done]);
  const countFor = useCallback(
    session => Object.keys(done).filter(k => k.startsWith(`${session}:`)).length,
    [done]
  );
  return { isDone, toggle, countFor };
}
