import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../../src/lib/motion.js';

const PILLARS = {
  C: { name: 'Confidentiality', color: '#7df9ff', x: 300, y: 50, plain: 'Only the right people can see it.', life: 'Your exam marks are visible to you and your teachers, not the whole class.', attack: 'Someone reads your WhatsApp chats over your shoulder, or a database of student phone numbers leaks online.', defend: 'Passwords, encryption, screen locks, access permissions.' },
  I: { name: 'Integrity', color: '#ffd23f', x: 80, y: 420, plain: 'Nobody can secretly change it.', life: 'The fee amount on your receipt is exactly what you paid. Nobody edited it.', attack: 'An attacker changes a bank account number in an invoice email, so the payment goes to them.', defend: 'Hashes, digital signatures, version history, permissions on who can edit.' },
  A: { name: 'Availability', color: '#2ee6c5', x: 520, y: 420, plain: 'It works when you need it.', life: 'The results portal actually opens on results day.', attack: 'Ransomware locks the hospital servers, or a flood of fake traffic crashes the website (DoS).', defend: 'Backups, spare servers, DDoS protection, quick incident response.' }
};

// Tap a corner of the triangle. The current along the edges shows the three
// pillars holding each other up: weaken one and the whole shape is at risk.
export default function CIATriad() {
  const [pick, setPick] = useState('C');
  const ref = useRef(null);
  useGSAP(
    () => {
      gsap.to('.cia-edge-lit', { strokeDashoffset: -120, duration: 1.4, repeat: -1, ease: 'none' });
      gsap.to('.cia-shield', { scale: 1.06, svgOrigin: '300 300', duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    },
    { scope: ref }
  );
  useGSAP(() => {
    gsap.fromTo(`.cia-node-${pick}`, { scale: 0.8 }, { scale: 1, svgOrigin: `${PILLARS[pick].x} ${PILLARS[pick].y}`, duration: 0.6, ease: 'elastic.out(1,0.4)' });
  }, { scope: ref, dependencies: [pick] });
  const p = PILLARS[pick];
  const tri = 'M300 50 L520 420 L80 420 Z';
  return (
    <div ref={ref} className="d-grid" style={{ alignItems: 'center' }}>
      <svg viewBox="0 -40 600 580" style={{ maxWidth: 480, margin: "0 auto" }}>
        <path d={tri} fill="rgba(125,249,255,.04)" stroke="var(--line-strong)" strokeWidth="3" />
        <path className="cia-edge-lit" d={tri} fill="none" stroke={p.color} strokeWidth="3" strokeDasharray="30 30" style={{ filter: `drop-shadow(0 0 6px ${p.color})` }} />
        <g className="cia-shield">
          <path d="M300 240 l50 18 v36 c0 32 -22 54 -50 64 c-28 -10 -50 -32 -50 -64 v-36z" fill="#06172a" stroke={p.color} strokeWidth="3" />
          <text x="300" y="312" textAnchor="middle" fontFamily="Space Grotesk" fontWeight="700" fontSize="26" fill="#fff">CIA</text>
        </g>
        {Object.entries(PILLARS).map(([k, v]) => (
          <g key={k} className={`svg-hover-node cia-node-${k}`} role="button" tabIndex={0} aria-label={v.name} onClick={() => setPick(k)} onKeyDown={e => e.key === 'Enter' && setPick(k)}>
            <circle cx={v.x} cy={v.y} r={pick === k ? 46 : 38} fill={pick === k ? v.color : '#06172a'} stroke={v.color} strokeWidth="3" style={{ filter: pick === k ? `drop-shadow(0 0 18px ${v.color})` : 'none', transition: 'r .3s' }} />
            <text x={v.x} y={v.y + 11} textAnchor="middle" fontFamily="Space Grotesk" fontWeight="700" fontSize="32" fill={pick === k ? '#04101f' : v.color}>{k}</text>
            <text x={v.x} y={k === 'C' ? v.y - 56 : v.y + 72} textAnchor="middle" fontFamily="Space Grotesk" fontSize="20" fill="var(--text)">{v.name}</text>
          </g>
        ))}
      </svg>
      <div className="d-panel" style={{ borderColor: p.color }} aria-live="polite">
        <span className="d-label" style={{ color: p.color }}>{p.name}</span>
        <p className="d-big" style={{ fontSize: '1.5rem', marginBottom: 14 }}>{p.plain}</p>
        <p style={{ fontSize: 15 }}><strong>📘 Everyday example:</strong> {p.life}</p>
        <p style={{ fontSize: 15 }}><strong style={{ color: 'var(--danger)' }}>⚠ When it breaks:</strong> {p.attack}</p>
        <p style={{ fontSize: 15, margin: 0 }}><strong style={{ color: 'var(--ok)' }}>🛡 How we protect it:</strong> {p.defend}</p>
      </div>
    </div>
  );
}
