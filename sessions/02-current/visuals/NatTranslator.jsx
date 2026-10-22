import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../../src/lib/motion.js';
import { Glyph } from '../../../src/components/Glyphs.jsx';

// Three devices with private addresses share one public address. The router
// (the gateway) swaps the "from" label on the way out and back on the way in.
const DEVICES = [
  ['Laptop', 'laptop', '192.168.1.5', 60],
  ['Phone', 'phone', '192.168.1.7', 170],
  ['Ubuntu VM', 'server', '192.168.1.9', 280]
];
const PUBLIC = '49.36.12.88';

export default function NatTranslator() {
  const ref = useRef(null);
  const [label, setLabel] = useState('Press send. Watch the “from” address change at the router.');
  const { contextSafe } = useGSAP({ scope: ref });
  const send = contextSafe(k => {
    const [name, , ip, y] = DEVICES[k];
    gsap.timeline()
      .call(() => setLabel(`${name} sends a request from its private address ${ip}…`))
      .set('.nat-pkt', { attr: { transform: `translate(150 ${y})` }, opacity: 1 })
      .set('.nat-from', { textContent: ip })
      .to('.nat-pkt', { attr: { transform: 'translate(400 170)' }, duration: 0.8, ease: 'power1.inOut' })
      .call(() => setLabel(`The router (default gateway) swaps ${ip} for its one public address ${PUBLIC} and remembers who asked.`))
      .to('.nat-router', { scale: 1.12, svgOrigin: '450 170', yoyo: true, repeat: 1, duration: 0.18 })
      .set('.nat-from', { textContent: PUBLIC })
      .to('.nat-pkt', { attr: { transform: 'translate(700 170)' }, duration: 0.8, ease: 'power1.inOut' })
      .call(() => setLabel(`The website only ever sees ${PUBLIC}. Its reply comes back to the router, which forwards it to ${name}. That’s NAT.`))
      .to('.nat-pkt', { opacity: 0, duration: 0.4, delay: 0.6 });
  });
  return (
    <div ref={ref}>
      <svg viewBox="0 0 860 340">
        <rect x="20" y="20" width="360" height="300" rx="20" fill="rgba(43,127,255,.05)" stroke="#2c4f8f" strokeDasharray="6 6" />
        <text x="40" y="310" fontFamily="JetBrains Mono" fontSize="13" fill="#8ec5ff">private network 192.168.1.0/24</text>
        {DEVICES.map(([name, icon, ip, y]) => (
          <g key={name}>
            <line x1="150" y1={y} x2="410" y2="170" stroke="var(--line-strong)" strokeWidth="2" />
            <rect x="40" y={y - 28} width="110" height="56" rx="12" fill="#061428" stroke="var(--accent)" strokeWidth="2" />
            <Glyph name={icon} x={50} y={y - 12} size={24} color="#cfe4ff" />
            <text x="80" y={y - 4} fontFamily="Space Grotesk" fontSize="13" fill="var(--text)">{name}</text>
            <text x="80" y={y + 14} fontFamily="JetBrains Mono" fontSize="10.5" fill="var(--muted)">{ip}</text>
          </g>
        ))}
        <line x1="490" y1="170" x2="760" y2="170" stroke="var(--line-strong)" strokeWidth="3" />
        <g className="nat-router">
          <rect x="410" y="130" width="80" height="80" rx="16" fill="#0b1820" stroke="var(--spark)" strokeWidth="2.5" />
          <Glyph name="router" x={434} y={142} size={32} color="var(--spark)" />
          <text x="450" y="200" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="var(--spark)">NAT</text>
        </g>
        <text x="450" y="236" textAnchor="middle" fontFamily="Space Grotesk" fontSize="13" fill="var(--text-soft)">Router / gateway</text>
        <text x="450" y="254" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="11" fill="var(--muted)">public {PUBLIC}</text>
        <circle cx="790" cy="170" r="34" fill="#061428" stroke="var(--accent)" strokeWidth="2" />
        <Glyph name="globe" x={774} y={154} size={32} color="#cfe4ff" />
        <text x="790" y="226" textAnchor="middle" fontFamily="Space Grotesk" fontSize="13" fill="var(--text-soft)">Website</text>
        <g className="nat-pkt" opacity="0" transform="translate(150 60)">
          <rect x="-62" y="-16" width="124" height="32" rx="8" fill="var(--spark)" />
          <text className="nat-from" x="0" y="5" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="11" fontWeight="700" fill="#2a1d00">from …</text>
        </g>
      </svg>
      <div className="d-row">
        {DEVICES.map(([name], k) => (
          <button key={name} type="button" className="btn btn--sm" onClick={() => send(k)}>Send from {name}</button>
        ))}
      </div>
      <div className="info-pop" aria-live="polite">{label}</div>
    </div>
  );
}
