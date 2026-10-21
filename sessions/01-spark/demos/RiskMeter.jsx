import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../../src/lib/motion.js';

const SCENARIOS = [
  { name: 'Laptop left unlocked in the library', l: 4, i: 4, fix: 'Lock the screen (Win + L) every time you stand up and set a short auto-lock.' },
  { name: 'Hostel Wi-Fi router still uses the default password "admin"', l: 5, i: 3, fix: 'Change the admin password and turn on WPA2/WPA3 with a strong Wi-Fi key.' },
  { name: 'Same password on Instagram, email and the college portal', l: 4, i: 5, fix: 'Use a different password everywhere. A password manager makes this easy.' },
  { name: 'Phone with automatic updates switched on', l: 1, i: 3, fix: 'Already good! Keep it that way.' },
  { name: 'Project files with no backup, on one pen drive', l: 3, i: 4, fix: 'Keep 3 copies on 2 kinds of storage, with 1 away from your room (cloud).' }
];
const LEVELS = [
  [6, 'LOW', 'var(--ok)'],
  [12, 'MEDIUM', 'var(--warn)'],
  [19, 'HIGH', '#ff8a4d'],
  [25, 'CRITICAL', 'var(--danger)']
];

// Risk = Likelihood × Impact. The needle swings like a voltmeter.
export default function RiskMeter() {
  const [s, setS] = useState(0);
  const [l, setL] = useState(SCENARIOS[0].l);
  const [i, setI] = useState(SCENARIOS[0].i);
  const ref = useRef(null);
  const risk = l * i;
  const [, label, color] = LEVELS.find(([max]) => risk <= max);
  const angle = -90 + ((risk - 1) / 24) * 180;
  useGSAP(() => {
    gsap.to('.rm-needle', { rotation: angle, svgOrigin: '200 200', duration: 1.2, ease: 'elastic.out(1, 0.35)' });
  }, { scope: ref, dependencies: [angle] });
  const choose = k => {
    setS(k);
    setL(SCENARIOS[k].l);
    setI(SCENARIOS[k].i);
  };
  const arc = (from, to, c) => {
    const p = a => [200 + 160 * Math.cos(((a - 90) * Math.PI) / 180), 200 + 160 * Math.sin(((a - 90) * Math.PI) / 180)];
    const [x1, y1] = p(from);
    const [x2, y2] = p(to);
    return <path d={`M${x1} ${y1} A160 160 0 0 1 ${x2} ${y2}`} stroke={c} strokeWidth="22" fill="none" opacity=".85" />;
  };
  return (
    <div ref={ref}>
      <div className="d-row" style={{ marginBottom: 16 }}>
        {SCENARIOS.map((sc, k) => (
          <button key={k} type="button" className={`btn btn--sm ${s === k ? 'btn--primary' : ''}`} onClick={() => choose(k)}>
            {sc.name}
          </button>
        ))}
      </div>
      <div className="d-grid" style={{ alignItems: 'center' }}>
        <svg viewBox="0 0 400 240" style={{ maxWidth: 420, margin: '0 auto' }}>
          {arc(-90, -45, 'var(--ok)')}
          {arc(-45, 0, 'var(--warn)')}
          {arc(0, 45, '#ff8a4d')}
          {arc(45, 90, 'var(--danger)')}
          {Array.from({ length: 25 }, (_, k) => {
            const a = ((-90 + k * 7.5 - 90) * Math.PI) / 180;
            return <line key={k} x1={200 + 128 * Math.cos(a)} y1={200 + 128 * Math.sin(a)} x2={200 + 138 * Math.cos(a)} y2={200 + 138 * Math.sin(a)} stroke="var(--muted)" strokeWidth="1.5" />;
          })}
          <g className="rm-needle">
            <path d="M196 200 L200 60 L204 200 Z" fill="#fff" style={{ filter: `drop-shadow(0 0 8px ${color})` }} />
          </g>
          <circle cx="200" cy="200" r="14" fill="#06172a" stroke={color} strokeWidth="4" />
          <text x="200" y="236" textAnchor="middle" fontFamily="Space Grotesk" fontWeight="700" fontSize="22" fill={color}>
            RISK {risk} · {label}
          </text>
        </svg>
        <div>
          <label className="d-label" htmlFor="rm-l">Likelihood: how likely is it to happen? ({l}/5)</label>
          <input id="rm-l" className="range" type="range" min="1" max="5" value={l} onChange={e => setL(+e.target.value)} />
          <label className="d-label" htmlFor="rm-i" style={{ marginTop: 16 }}>Impact: how bad would it be? ({i}/5)</label>
          <input id="rm-i" className="range" type="range" min="1" max="5" value={i} onChange={e => setI(+e.target.value)} />
          <div className="info-pop">
            <strong>Risk = Likelihood × Impact = {l} × {i} = {risk}</strong>
            <br />
            <span style={{ color: 'var(--ok)' }}>🛡 Fix: </span>
            {SCENARIOS[s].fix}
          </div>
        </div>
      </div>
    </div>
  );
}
