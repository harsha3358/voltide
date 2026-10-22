import { useEffect, useState } from 'react';

// The game layer: XP, ranks, badges, combo streaks and a player handle.
// Everything is per-viewer (localStorage) and every award is idempotent by id,
// so replaying a demo never farms XP twice.
const KEY = 'voltide:game';
const EVENT = 'voltide:game';

export const RANKS = [
  [0, 'Recruit', 'Just plugged in.'],
  [250, 'Spark', 'You can feel the current.'],
  [600, 'Packet Rider', 'Data flows where you point it.'],
  [1100, 'VM Wrangler', 'Virtual machines obey you.'],
  [1800, 'Container Captain', 'You ship apps in seconds.'],
  [2700, 'Auto-Scaler', 'Traffic floods? You surf them.'],
  [3800, 'Cloud Architect', 'LAGZILLA fears your name.']
];

export const BADGES = {
  'myth-buster': ['Myth Buster', 'Flipped every myth card', 'sparkle'],
  'bit-flipper': ['Bit Flipper', 'Spelled a letter in binary', 'bolt'],
  'packet-pusher': ['Packet Pusher', 'Sent HELLO across the internet', 'globe'],
  'cloud-walker': ['Cloud Walker', 'Explored every cloud model', 'cloud'],
  'model-matcher': ['Model Matcher', 'Matched all 6 IaaS / PaaS / SaaS cases', 'layers'],
  'scale-master': ['Scale Master', 'Scaled up for results day, then back down', 'chart'],
  'shield-max': ['Account Guardian', 'Ticked every cloud-account safety habit', 'shield'],
  'terminal-tamer': ['Terminal Tamer', 'Completed all 8 terminal missions', 'terminal'],
  'combo-5': ['Combo x5', 'Five right answers in a row', 'fire'],
  'boss-1': ['LAGZILLA · Episode 1', 'Won the Episode 01 boss fight', 'target'],
  'decoder-1': ['Decoder', 'Decrypted the Episode 01 transmission', 'lock']
};

const ADJ = ['Neon', 'Static', 'Monsoon', 'Quantum', 'Velvet', 'Ghost', 'Turbo', 'Pixel', 'Lunar', 'Cobalt', 'Storm', 'Glitch'];
const NOUN = ['Otter', 'Circuit', 'Tide', 'Falcon', 'Byte', 'Comet', 'Cipher', 'Koi', 'Volt', 'Lynx', 'Ripple', 'Nova'];
export const randomHandle = () =>
  `${ADJ[Math.floor(Math.random() * ADJ.length)]}${NOUN[Math.floor(Math.random() * NOUN.length)]}_${Math.floor(Math.random() * 90 + 10)}`;

const blank = () => ({ xp: 0, awards: {}, badges: {}, combo: 0, best: 0, handle: randomHandle(), sound: false });

function read() {
  try {
    return { ...blank(), ...JSON.parse(localStorage.getItem(KEY) || '{}') };
  } catch {
    return blank();
  }
}

let state = read();
const toasts = new Set();

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

export const rankFor = xp => {
  let i = 0;
  while (i + 1 < RANKS.length && xp >= RANKS[i + 1][0]) i++;
  const next = RANKS[i + 1];
  return { index: i, name: RANKS[i][1], line: RANKS[i][2], floor: RANKS[i][0], next: next?.[0] ?? null, nextName: next?.[1] ?? null };
};

function toast(t) {
  toasts.forEach(fn => fn(t));
}

export function onToast(fn) {
  toasts.add(fn);
  return () => toasts.delete(fn);
}

// award('quiz:1:cia-triad', 100, 'First-try genius') → adds XP once per id.
export function award(id, xp, label) {
  if (state.awards[id]) return false;
  const before = rankFor(state.xp);
  state = { ...state, xp: state.xp + xp, awards: { ...state.awards, [id]: xp } };
  const after = rankFor(state.xp);
  save();
  toast({ kind: 'xp', xp, label });
  if (after.index > before.index) toast({ kind: 'rank', rank: after });
  sfx('up');
  return true;
}

export function badge(id) {
  if (state.badges[id] || !BADGES[id]) return;
  state = { ...state, badges: { ...state.badges, [id]: Date.now() } };
  save();
  toast({ kind: 'badge', id, badge: BADGES[id] });
  sfx('badge');
}

// Right/wrong answers drive the combo meter. Combo ≥ 3 doubles quiz XP.
export function answer(correct) {
  const combo = correct ? state.combo + 1 : 0;
  state = { ...state, combo, best: Math.max(state.best, combo) };
  save();
  if (combo >= 5) badge('combo-5');
  sfx(correct ? 'zap' : 'buzz');
  return combo;
}

export function setHandle(handle) {
  state = { ...state, handle: handle.slice(0, 24) || randomHandle() };
  save();
}

export function setSound(on) {
  state = { ...state, sound: on };
  save();
  if (on) sfx('up');
}

export function resetGame() {
  state = blank();
  save();
}

export function useGame() {
  const [s, setS] = useState(state);
  useEffect(() => {
    const sync = () => setS(state);
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);
  return s;
}

// Tiny synthesised sound effects (no audio files). Off by default.
let ctx = null;
export function sfx(kind) {
  if (!state.sound) return;
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    const notes = { zap: [880, 1320], up: [660, 990], badge: [523, 784, 1047], buzz: [140, 110], hit: [220, 60] }[kind] || [660];
    notes.forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = kind === 'buzz' ? 'sawtooth' : kind === 'hit' ? 'square' : 'triangle';
      o.frequency.setValueAtTime(f, now + i * 0.07);
      g.gain.setValueAtTime(0.0001, now + i * 0.07);
      g.gain.exponentialRampToValueAtTime(0.12, now + i * 0.07 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.07 + 0.16);
      o.connect(g).connect(ctx.destination);
      o.start(now + i * 0.07);
      o.stop(now + i * 0.07 + 0.2);
    });
  } catch {}
}
