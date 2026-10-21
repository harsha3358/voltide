import { useEffect, useRef, useState } from 'react';
import { award, badge } from '../../../src/lib/game.js';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../../src/lib/motion.js';

// Eight light switches = one byte. Flip them and watch the number and the
// letter change: the whole digital world is built from this.
const WEIGHTS = [128, 64, 32, 16, 8, 4, 2, 1];

export default function BitSwitches() {
  const [bits, setBits] = useState([0, 1, 0, 0, 0, 0, 0, 1]);
  const ref = useRef(null);
  const value = bits.reduce((n, b, i) => n + b * WEIGHTS[i], 0);
  const printable = value >= 32 && value <= 126;
  useEffect(() => {
    const letter = (value >= 65 && value <= 90) || (value >= 97 && value <= 122);
    if (byHand.current && letter && award('demo:bits', 60, `You spelled “${String.fromCharCode(value)}” in binary`)) badge('bit-flipper');
  }, [value]);
  const set = v => setBits(WEIGHTS.map(w => (v & w ? 1 : 0)));
  const byHand = useRef(false);
  const flip = i => {
    byHand.current = true;
    setBits(b => b.map((x, j) => (j === i ? 1 - x : x)));
  };

  useGSAP(
    () => {
      gsap.fromTo('.bs-bulb.on', { scale: 0.85 }, { scale: 1, duration: 0.4, ease: 'back.out(3)', transformOrigin: 'center' });
      gsap.to('.bs-current', { strokeDashoffset: -40, duration: 0.8, repeat: -1, ease: 'none' });
    },
    { scope: ref, dependencies: [bits.join('')] }
  );

  return (
    <div ref={ref}>
      <svg viewBox="0 0 800 210" style={{ width: '100%', height: 'auto' }}>
        <line x1="30" y1="40" x2="770" y2="40" stroke="var(--line-strong)" strokeWidth="3" />
        <line className="bs-current" x1="30" y1="40" x2="770" y2="40" stroke="var(--spark)" strokeWidth="3" strokeDasharray="8 12" opacity=".7" />
        <text x="30" y="26" fill="var(--muted)" fontFamily="JetBrains Mono" fontSize="12">⚡ POWER LINE</text>
        {bits.map((b, i) => {
          const x = 70 + i * 94;
          return (
            <g key={i} onClick={() => flip(i)} style={{ cursor: 'pointer' }} role="button" tabIndex={0} aria-label={`Bit worth ${WEIGHTS[i]}, currently ${b ? 'on' : 'off'}`} onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), flip(i))}>
              <line x1={x} y1="40" x2={x} y2="70" stroke={b ? 'var(--spark)' : 'var(--line-strong)'} strokeWidth="3" />
              <circle className={`bs-bulb ${b ? 'on' : ''}`} cx={x} cy="94" r="24" fill={b ? 'var(--spark)' : '#0a1426'} stroke={b ? '#fff6c8' : 'var(--line-strong)'} strokeWidth="2" style={{ filter: b ? 'drop-shadow(0 0 16px var(--spark))' : 'none' }} />
              <text x={x} y="101" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="20" fontWeight="700" fill={b ? '#2a1d00' : 'var(--muted)'}>
                {b}
              </text>
              <rect x={x - 22} y="130" width="44" height="26" rx="13" fill={b ? 'rgba(255,210,63,.25)' : 'rgba(255,255,255,.05)'} stroke="var(--line-strong)" />
              <circle cx={b ? x + 9 : x - 9} cy="143" r="9" fill={b ? 'var(--spark)' : '#5a6b85'} style={{ transition: 'cx .25s' }} />
              <text x={x} y="186" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="14" fill="var(--text-soft)">
                {WEIGHTS[i]}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="d-grid" style={{ marginTop: 10 }}>
        <div className="d-panel">
          <span className="d-label">Binary (8 bits = 1 byte)</span>
          <div className="d-big" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '.12em' }}>{bits.join('')}</div>
        </div>
        <div className="d-panel">
          <span className="d-label">Number (add the lit weights)</span>
          <div className="d-big" style={{ color: 'var(--spark)' }}>{value}</div>
        </div>
        <div className="d-panel">
          <span className="d-label">As a letter (ASCII code)</span>
          <div className="d-big" style={{ color: 'var(--volt)' }}>{printable ? `"${String.fromCharCode(value)}"` : '·'}</div>
          {!printable && <p className="d-note">Codes 32–126 are printable letters, digits and symbols.</p>}
        </div>
      </div>
      <div className="d-row" style={{ marginTop: 14 }}>
        <button className="btn btn--sm" type="button" onClick={() => set(65)}>Make “A” (65)</button>
        <button className="btn btn--sm" type="button" onClick={() => set(97)}>Make “a” (97)</button>
        <button className="btn btn--sm" type="button" onClick={() => set(255)}>All on (255)</button>
        <button className="btn btn--sm btn--ghost" type="button" onClick={() => set(0)}>All off</button>
        <button className="btn btn--sm btn--ghost" type="button" onClick={() => set(32 + Math.floor(Math.random() * 95))}>Random</button>
      </div>
      <p className="d-note">
        Challenge: spell the first letter of your name. Uppercase letters run from 65 (A) to 90 (Z).
      </p>
    </div>
  );
}
