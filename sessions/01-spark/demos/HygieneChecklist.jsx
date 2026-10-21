import { useEffect, useRef, useState } from 'react';
import { award, badge } from '../../../src/lib/game.js';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../../src/lib/motion.js';

const ITEMS = [
  ['Automatic updates are ON for my phone, laptop and apps.', 'Most attacks use old, already-fixed bugs.'],
  ['My phone and laptop lock with a PIN, password or fingerprint.', 'A lost device should be a brick, not an open diary.'],
  ['My email account has 2-step verification (MFA) turned on.', 'Your email resets every other password, so it is the master key.'],
  ['I use a different password for every important account.', 'One leak should not open all your doors.'],
  ['I have a backup of my important files somewhere other than my laptop.', 'Ransomware, theft and spilt chai happen.'],
  ['I only install apps from the official Play Store or App Store.', 'Random APKs are the number one way Android phones get infected.'],
  ['I check app permissions (camera, mic, SMS, location) now and then.', 'A torch app does not need your contacts.'],
  ['I never share OTPs, even with “bank staff” or “customer care”.', 'No real bank will ever ask for your OTP.']
];

// Your personal shield: each good habit fills it with water and makes it glow.
export default function HygieneChecklist() {
  const [on, setOn] = useState(() => new Set());
  const ref = useRef(null);
  const pct = on.size / ITEMS.length;
  useEffect(() => {
    if (pct === 1 && award('demo:hygiene', 80, 'Shield at 100%')) badge('shield-max');
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
            <clipPath id="hy-clip">
              <path d="M100 12 L180 40 V110 C180 165 145 200 100 218 C55 200 20 165 20 110 V40 Z" />
            </clipPath>
          </defs>
          <path d="M100 12 L180 40 V110 C180 165 145 200 100 218 C55 200 20 165 20 110 V40 Z" fill="#06172a" />
          <g clipPath="url(#hy-clip)">
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
