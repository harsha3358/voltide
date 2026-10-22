import { useEffect, useRef, useState } from 'react';
import { award, badge } from '../../../src/lib/game.js';

// A 3-minute demo, split into four beats. The timer runs; the presenter
// presses Next when a beat is done. Finishing all four earns the badge.
const BEATS = [
  ['The problem', 30, 'Who is the site for? One sentence.'],
  ['Live site', 60, 'Open the public IP on a phone. Show it working, live.'],
  ['How we deployed', 60, 'EC2 → security group → nginx → file. Show one command.'],
  ['What we learned', 30, 'One thing that broke and how you fixed it.']
];
const TOTAL = BEATS.reduce((n, b) => n + b[1], 0);
const fmt = s => `${Math.floor(s / 60)}:${String(Math.max(0, s) % 60).padStart(2, '0')}`;

export default function DemoTimer() {
  const [beat, setBeat] = useState(-1);
  const [left, setLeft] = useState(TOTAL);
  const [beatStart, setBeatStart] = useState(TOTAL);
  const tick = useRef(null);
  const running = beat >= 0 && beat < BEATS.length;
  useEffect(() => {
    if (!running) return;
    tick.current = setInterval(() => setLeft(l => l - 1), 1000);
    return () => clearInterval(tick.current);
  }, [running]);
  useEffect(() => {
    if (beat === BEATS.length && award('demo:timer', 80, 'Ran the full demo')) badge('demo-day');
  }, [beat]);
  const next = () => {
    setBeat(b => b + 1);
    setBeatStart(left);
  };
  const reset = () => {
    setBeat(-1);
    setLeft(TOTAL);
    setBeatStart(TOTAL);
  };
  const beatUsed = beatStart - left;
  const over = running && beatUsed > BEATS[beat][1];
  return (
    <div className="split-2-1">
      <div className="d-panel" style={{ textAlign: 'center', borderColor: left < 0 ? 'var(--danger)' : running ? 'var(--accent)' : 'var(--line)' }}>
        <span className="d-label">{beat < 0 ? 'Ready' : beat >= BEATS.length ? 'Done' : `Beat ${beat + 1} of 4 · ${BEATS[beat][0]}`}</span>
        <div className="d-big" style={{ fontSize: 'clamp(3rem, 12vw, 5rem)', color: left < 0 ? 'var(--danger)' : 'var(--text)' }} aria-live="polite">{left < 0 ? `-${fmt(-left)}` : fmt(left)}</div>
        <div className="meter" style={{ margin: '14px 0' }}><i style={{ width: `${Math.max(0, Math.min(100, (left / TOTAL) * 100))}%` }} /></div>
        {running && <p style={{ margin: '0 0 12px' }}>{BEATS[beat][2]} {over && <span className="d-warn">(over time, wrap up!)</span>}</p>}
        {beat >= BEATS.length && <p style={{ margin: '0 0 12px' }} className="d-good">Demo complete{left < 0 ? `, ${fmt(-left)} over. Trim next time.` : `, with ${fmt(left)} to spare. Clean.`}</p>}
        <div className="d-row" style={{ justifyContent: 'center' }}>
          {beat < BEATS.length && <button type="button" className="btn btn--sm btn--primary" onClick={next}>{beat < 0 ? '▶ Start demo' : beat === BEATS.length - 1 ? '✓ Finish' : 'Next beat →'}</button>}
          <button type="button" className="btn btn--sm btn--ghost" onClick={reset}>↺ Reset</button>
        </div>
      </div>
      <div className="d-panel">
        <span className="d-label">Run of show · 3 minutes</span>
        <ul className="missions">
          {BEATS.map(([t, s, tip], i) => (
            <li key={t} className={beat > i ? 'done' : ''} style={{ fontWeight: beat === i ? 700 : 400, color: beat === i ? 'var(--text)' : undefined }}>
              <span>{beat > i ? '✔' : beat === i ? '▶' : '•'}</span><span>{t} · {s}s<br /><span className="d-note" style={{ margin: 0, fontSize: 12.5 }}>{tip}</span></span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
