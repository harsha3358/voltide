import { useEffect, useRef, useState } from 'react';
import { award, badge } from '../../../src/lib/game.js';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../../src/lib/motion.js';

const ITEMS = [
  ['I turned on MFA (2-step login) for my cloud account.', 'The account holds your card details. Protect it like your UPI PIN.'],
  ['I set a billing alert / budget (e.g. ₹100).', 'You get an email before a forgotten server eats your pocket money.'],
  ['I use the free tier and the smallest machine size for practice.', 'Tiny machines are free or cost paise. Big ones cost real rupees.'],
  ['I picked a nearby region, like Mumbai (ap-south-1).', 'Closer region = faster for Indian users.'],
  ['I never paste access keys or passwords into code or GitHub.', 'Bots scan GitHub for leaked keys within minutes.'],
  ['I don’t use the main “root” account for daily work.', 'Create a separate user with only the permissions you need.'],
  ['I name or tag what I create (e.g. “ravi-lab-vm”).', 'So you can find and delete it later.'],
  ['I stop or delete servers when the workshop ends.', 'Stopped = (mostly) free. Running = meter ticking.']
];

// Cloud account safety: each good habit fills the shield with water and makes it glow.
export default function CloudShield() {
  const [on, setOn] = useState(() => new Set());
  const ref = useRef(null);
  const pct = on.size / ITEMS.length;
  useEffect(() => {
    if (pct === 1 && award('demo:cloudshield', 80, 'Cloud account locked down')) badge('shield-max');
  }, [pct]);
  useGSAP(() => {
    gsap.to('.hy-level', { y: 180 * (1 - pct), duration: 1, ease: 'elastic.out(1,0.5)' });
    gsap.fromTo('.hy-wave', { x: 0 }, { x: -60, duration: 2, repeat: -1, ease: 'none' });
  }, { scope: ref, dependencies: [pct] });
  const color = pct < 0.4 ? 'var(--danger)' : pct < 0.8 ? 'var(--warn)' : 'var(--ok)';
  return (
    <div ref={ref} className="split-1-2">
      <div style={{ textAlign: 'center' }}>
        <svg viewBox="0 0 200 230" style={{ maxWidth: 200 }}>
          <defs>
            <clipPath id="cs-clip">
              <path d="M100 12 L180 40 V110 C180 165 145 200 100 218 C55 200 20 165 20 110 V40 Z" />
            </clipPath>
          </defs>
          <path d="M100 12 L180 40 V110 C180 165 145 200 100 218 C55 200 20 165 20 110 V40 Z" fill="#06172a" />
          <g clipPath="url(#cs-clip)">
            <g transform="translate(0 30)">
              <g className="hy-level" transform="translate(0 180)">
                <path className="hy-wave" d="M0 6 q15 -10 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 V260 H0 Z" fill={color} opacity=".75" />
              </g>
            </g>
          </g>
          <path d="M100 12 L180 40 V110 C180 165 145 200 100 218 C55 200 20 165 20 110 V40 Z" fill="none" stroke={color} strokeWidth="4" style={{ filter: `drop-shadow(0 0 ${6 + pct * 18}px ${color})`, transition: 'all .4s' }} />
          <text x="100" y="125" textAnchor="middle" fontFamily="Space Grotesk" fontWeight="700" fontSize="38" fill="#fff">
            {Math.round(pct * 100)}%
          </text>
        </svg>
        <p className="d-note">Shield level</p>
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        {ITEMS.map(([t, why], i) => (
          <label key={i} className={`hyg ${on.has(i) ? 'on' : ''}`}>
            <input
              type="checkbox"
              checked={on.has(i)}
              onChange={() => {
                const n = new Set(on);
                n.has(i) ? n.delete(i) : n.add(i);
                setOn(n);
              }}
            />
            <span>
              <span style={{ fontSize: 15 }}>{t}</span>
              <br />
              <span className="d-note" style={{ margin: 0, fontSize: 13 }}>{why}</span>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
