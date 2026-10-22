import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../../src/lib/motion.js';
import { award, badge } from '../../../src/lib/game.js';
import { Glyph } from '../../../src/components/Glyphs.jsx';

// The internet's phonebook in action: a name becomes an IP address in five hops.
const N = {
  browser: [90, 200, 'Your browser', 'laptop'],
  resolver: [330, 200, 'Resolver (ISP / 8.8.8.8)', 'server'],
  root: [600, 60, 'Root server', 'globe'],
  tld: [770, 200, '.in TLD server', 'database'],
  auth: [600, 340, 'college.ac.in name server', 'building']
};
const HOPS = [
  ['browser', 'resolver', 'Browser: “Where is www.college.ac.in?” (not in my cache)'],
  ['resolver', 'root', 'Root server: “No idea, but ask the .in servers.”'],
  ['resolver', 'tld', '.in server: “Ask the name server for college.ac.in.”'],
  ['resolver', 'auth', 'Authoritative server: “www.college.ac.in = 203.0.113.10”'],
  ['resolver', 'browser', 'Answer delivered and cached. Next time: instant.']
];

export default function DNSJourney() {
  const ref = useRef(null);
  const [step, setStep] = useState(-1);
  const { contextSafe } = useGSAP({ scope: ref });
  const run = contextSafe(() => {
    const tl = gsap.timeline({ onComplete: () => award('demo:dns', 60, 'DNS lookup complete') && badge('dns-detective') });
    HOPS.forEach(([a, b], i) => {
      const [x1, y1] = N[a];
      const [x2, y2] = N[b];
      tl.call(() => setStep(i))
        .fromTo('.dns-dot', { attr: { cx: x1, cy: y1 }, opacity: 1 }, { attr: { cx: x2, cy: y2 }, duration: 0.85, ease: 'power2.inOut' })
        .to({}, { duration: 0.55 });
      if (a !== 'browser' && b !== 'browser') tl.to('.dns-dot', { attr: { cx: N.resolver[0], cy: N.resolver[1] }, duration: 0.55, ease: 'power2.inOut' });
    });
    tl.to('.dns-dot', { opacity: 0 });
  });
  const live = step >= 0 ? HOPS[step] : null;
  return (
    <div ref={ref}>
      <svg viewBox="0 0 870 410">
        {[['browser', 'resolver'], ['resolver', 'root'], ['resolver', 'tld'], ['resolver', 'auth']].map(([a, b]) => (
          <line key={a + b} x1={N[a][0]} y1={N[a][1]} x2={N[b][0]} y2={N[b][1]} stroke="var(--line-strong)" strokeWidth="2.5" strokeDasharray="6 8" />
        ))}
        {Object.entries(N).map(([id, [x, y, label, icon]]) => {
          const on = live && (live[0] === id || live[1] === id);
          return (
            <g key={id}>
              <circle cx={x} cy={y} r="38" fill="#061428" stroke={on ? 'var(--spark)' : 'var(--accent)'} strokeWidth="2.5" />
              <Glyph name={icon} x={x - 16} y={y - 16} size={32} color="#cfe4ff" />
              <text x={x} y={y + 60} textAnchor="middle" fontFamily="Space Grotesk" fontSize="14" fill="var(--text-soft)">{label}</text>
            </g>
          );
        })}
        <circle className="dns-dot" cx={N.browser[0]} cy={N.browser[1]} r="10" fill="var(--spark)" opacity="0" style={{ filter: 'drop-shadow(0 0 10px var(--spark))' }} />
      </svg>
      <div className="d-row">
        <button type="button" className="btn btn--sm btn--primary" onClick={run}>▶ Look up www.college.ac.in</button>
      </div>
      <div className="info-pop" aria-live="polite">
        {live ? <><strong>Step {step + 1}/5:</strong> {live[2]}</> : 'Press the button to follow a DNS lookup step by step.'}
      </div>
    </div>
  );
}
