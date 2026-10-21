import { useEffect, useMemo, useRef, useState } from 'react';
import { award, badge } from '../../../src/lib/game.js';
import { sha256 } from '../../../src/lib/sha256.js';

const COMMON = ['123456', 'password', '123456789', '12345678', 'qwerty', 'abc123', 'password1', '111111', 'iloveyou', 'admin', 'welcome', 'india123', 'qwerty123', '000000', '1234567890', 'sachin', 'krishna', 'dhoni07', 'letmein', 'monkey'];

function strength(pw) {
  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/\d/.test(pw)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) pool += 33;
  const common = COMMON.includes(pw.toLowerCase());
  const bits = common ? 4 : pw.length * Math.log2(pool || 1);
  const seconds = 2 ** bits / 1e10 / 2;
  return { pool, bits, seconds, common };
}

function human(s) {
  if (s < 1) return 'instantly';
  const units = [
    ['years', 31557600],
    ['days', 86400],
    ['hours', 3600],
    ['minutes', 60],
    ['seconds', 1]
  ];
  if (s > 31557600 * 1e9) return 'longer than the age of the universe';
  for (const [u, v] of units) if (s >= v) {
    const n = s / v;
    return `${n >= 1e6 ? n.toExponential(1) : Math.round(n).toLocaleString('en-IN')} ${u}`;
  }
  return 'instantly';
}

function bitDiff(a, b) {
  let d = 0;
  for (let i = 0; i < a.length; i++) {
    let x = parseInt(a[i], 16) ^ parseInt(b[i], 16);
    while (x) {
      d += x & 1;
      x >>= 1;
    }
  }
  return d;
}

export default function HashLab() {
  const [pw, setPw] = useState('sunflower');
  const [a, setA] = useState('Hello VOLTIDE');
  const [b, setB] = useState('Hello VOLTIDe');
  const s = useMemo(() => strength(pw), [pw]);
  const ha = useMemo(() => sha256(a), [a]);
  const hb = useMemo(() => sha256(b), [b]);
  const pct = Math.min(100, (s.bits / 80) * 100);
  const diff = bitDiff(ha, hb);
  const edited = useRef(false);
  useEffect(() => {
    if (edited.current && a !== b && award('demo:hash', 70, `Avalanche: ${diff} bits flipped`)) badge('hash-hero');
    edited.current = true;
  }, [a, b]);
  const tips = [];
  if (pw.length < 12) tips.push('Make it longer: 12+ characters. Length beats complexity.');
  if (!/[A-Z]/.test(pw) || !/\d/.test(pw)) tips.push('Mix in capitals and numbers.');
  if (s.common) tips.push('This is on every attacker’s top-20 list. Never use it.');
  if (!tips.length) tips.push('Strong! A passphrase like “Chai-Rain-Bicycle-42” is easy to remember and hard to guess.');
  return (
    <div className="d-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))' }}>
      <div className="d-panel">
        <span className="d-label">1 · Password strength tester</span>
        <input className="input" style={{ width: '100%' }} value={pw} onChange={e => setPw(e.target.value)} aria-label="Practice password" spellCheck="false" />
        <p className="d-note d-warn">⚠ Never type your real password into any website or demo, including this one.</p>
        <div className="meter" style={{ margin: '14px 0 8px' }}>
          <i style={{ width: `${pct}%`, '--meter-full': `${(100 / Math.max(pct, 1)) * 100}%` }} />
        </div>
        <div className="d-row" style={{ justifyContent: 'space-between', fontSize: 14 }}>
          <span>Strength: <strong>{Math.round(s.bits)} bits</strong></span>
          <span>Characters to pick from: <strong>{s.pool}</strong></span>
        </div>
        <div className="info-pop">
          A computer making <strong>10 billion guesses a second</strong> would crack this in about{' '}
          <strong className={s.seconds < 86400 * 365 ? 'd-bad' : 'd-good'}>{human(s.seconds)}</strong>.
          <ul style={{ margin: '8px 0 0', paddingLeft: 18 }}>
            {tips.map(t => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="d-panel">
        <span className="d-label">2 · Hash machine (SHA-256): the avalanche effect</span>
        <label className="d-note" htmlFor="hl-a">Input A</label>
        <input id="hl-a" className="input" style={{ width: '100%' }} value={a} onChange={e => setA(e.target.value)} spellCheck="false" />
        <div className="d-mono hex-diff" style={{ margin: '8px 0 14px' }}>
          {[...ha].map((c, i) => <span key={i} className={c === hb[i] ? 'same' : 'diff'}>{c}</span>)}
        </div>
        <label className="d-note" htmlFor="hl-b">Input B (change one letter)</label>
        <input id="hl-b" className="input" style={{ width: '100%' }} value={b} onChange={e => setB(e.target.value)} spellCheck="false" />
        <div className="d-mono hex-diff" style={{ margin: '8px 0 10px' }}>
          {[...hb].map((c, i) => <span key={i} className={c === ha[i] ? 'same' : 'diff'}>{c}</span>)}
        </div>
        <div className="info-pop">
          {a === b ? (
            <>Same input → <strong className="d-good">exactly the same hash</strong>, every time, on every computer.</>
          ) : (
            <>
              A tiny change flipped <strong className="d-warn">{diff} of 256 bits ({Math.round((diff / 256) * 100)}%)</strong>. The
              fingerprint looks completely different. You cannot work backwards from a hash to the input.
            </>
          )}
        </div>
      </div>
    </div>
  );
}
