import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../../src/lib/motion.js';
import { award, badge } from '../../../src/lib/game.js';

// The Day 1 takeaway in one animation: everything that happens between typing
// a URL and seeing the page.
const STEPS = [
  ['⌨️', 'You type', 'You type fest.college.example and press Enter.'],
  ['📖', 'DNS', 'DNS turns the name into the server’s public IP, e.g. 13.233.10.7.'],
  ['📶', 'Your router', 'Your packet leaves your private network through the default gateway; NAT swaps in the public IP.'],
  ['🌐', 'The internet', 'Routers forward it hop by hop (traceroute shows each one) to the cloud provider.'],
  ['🛡️', 'Security group', 'The cloud firewall checks the rules: port 443 from anywhere? Allowed.'],
  ['🤝', 'TCP + TLS', 'A TCP handshake opens the connection on port 443, and TLS sets up encryption (the 🔒).'],
  ['📨', 'HTTP request', 'Your browser sends GET / and the web server on the VM builds the page.'],
  ['✅', '200 OK', 'The response travels all the way back, and your browser draws the page. ~100 ms total.']
];

export default function JourneyStepper() {
  const [i, setI] = useState(0);
  const ref = useRef(null);
  useGSAP(() => {
    gsap.to('.js-fill', { attr: { width: (i / (STEPS.length - 1)) * 840 }, duration: 0.6, ease: 'power2.out' });
    gsap.fromTo(`.js-node-${i}`, { scale: 0.7 }, { scale: 1, svgOrigin: `${30 + i * 120} 40`, duration: 0.5, ease: 'back.out(3)' });
  }, { scope: ref, dependencies: [i] });
  useEffect(() => {
    if (i === STEPS.length - 1 && award('demo:journey', 100, 'Browser → server, fully traced')) badge('journey-pro');
  }, [i]);
  return (
    <div ref={ref}>
      <svg viewBox="0 0 900 80">
        <rect x="30" y="37" width="840" height="6" rx="3" fill="var(--line-strong)" />
        <rect className="js-fill" x="30" y="37" width="0" height="6" rx="3" fill="var(--accent)" style={{ filter: 'drop-shadow(0 0 6px var(--accent))' }} />
        {STEPS.map(([icon], k) => (
          <g key={k} className={`js-node-${k}`} style={{ cursor: 'pointer' }} onClick={() => setI(k)} role="button" tabIndex={0} aria-label={`Step ${k + 1}`} onKeyDown={e => e.key === 'Enter' && setI(k)}>
            <circle cx={30 + k * 120} cy="40" r="20" fill={k <= i ? 'var(--accent)' : '#0b1820'} stroke="var(--accent)" strokeWidth="2" />
            <text x={30 + k * 120} y="47" textAnchor="middle" fontSize="18">{icon}</text>
          </g>
        ))}
      </svg>
      <div className="info-pop" aria-live="polite" style={{ minHeight: 100 }}>
        <span className="d-label">Step {i + 1} of {STEPS.length} · {STEPS[i][1]}</span>
        <p style={{ margin: 0, fontSize: 16.5, color: 'var(--text)' }}>{STEPS[i][2]}</p>
      </div>
      <div className="d-row" style={{ marginTop: 12 }}>
        <button type="button" className="btn btn--sm btn--ghost" disabled={i === 0} onClick={() => setI(i - 1)}>← Back</button>
        <button type="button" className="btn btn--sm btn--primary" disabled={i === STEPS.length - 1} onClick={() => setI(i + 1)}>Next step →</button>
      </div>
    </div>
  );
}
