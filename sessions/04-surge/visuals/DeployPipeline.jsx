import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../../src/lib/motion.js';
import { Icon } from '../../../src/components/Glyphs.jsx';

// The deployment route, end to end: your laptop → scp → EC2 → nginx → anyone's phone.
const STEPS = [
  ['laptop', 'Your laptop', 'index.html lives here', 'nano index.html'],
  ['terminal', 'scp', 'copies the file over SSH', 'scp -i key.pem index.html ubuntu@IP:~'],
  ['server', 'EC2 instance', 'Ubuntu in Mumbai', 'sudo mv ~/index.html /var/www/html/'],
  ['globe', 'nginx', 'serves it on port 80', 'sudo systemctl status nginx'],
  ['phone', 'Anyone’s phone', 'opens http://IP', 'curl -I http://IP']
];

export default function DeployPipeline() {
  const ref = useRef(null);
  const [at, setAt] = useState(-1);
  const { contextSafe } = useGSAP({ scope: ref });
  const play = contextSafe(() => {
    const tl = gsap.timeline();
    STEPS.forEach((_, i) => {
      tl.call(() => setAt(i)).fromTo(`.dp-node-${i}`, { scale: 0.85 }, { scale: 1, duration: 0.35, ease: 'back.out(3)' }).to({}, { duration: 0.45 });
    });
    tl.fromTo('.dp-flow', { strokeDashoffset: 600 }, { strokeDashoffset: 0, duration: STEPS.length * 0.8, ease: 'none' }, 0);
  });
  return (
    <div ref={ref}>
      <svg viewBox="0 0 640 120" aria-hidden="true" style={{ width: '100%', height: 'auto' }}>
        <line x1="60" y1="50" x2="580" y2="50" stroke="var(--line-strong)" strokeWidth="3" />
        <line className="dp-flow" x1="60" y1="50" x2="580" y2="50" stroke="var(--accent)" strokeWidth="3" strokeDasharray="600" strokeDashoffset="600" />
        {STEPS.map(([ic, label], i) => {
          const x = 60 + i * 130;
          return (
            <g key={label} className={`dp-node-${i}`} style={{ transformOrigin: `${x}px 50px` }}>
              <circle cx={x} cy="50" r="28" fill="#0b1820" stroke={at >= i ? 'var(--accent)' : 'var(--line-strong)'} strokeWidth="2.5" />
              <g transform={`translate(${x - 12} 38)`} color={at >= i ? 'var(--accent)' : 'var(--muted)'}><Icon name={ic} size={24} /></g>
              <text x={x} y="102" textAnchor="middle" fontSize="13" fontFamily="Space Grotesk" fill={at >= i ? 'var(--text)' : 'var(--muted)'}>{label}</text>
            </g>
          );
        })}
      </svg>
      <div className="d-row" style={{ marginTop: 6 }}>
        <button type="button" className="btn btn--sm btn--primary" onClick={play}>▶ Deploy</button>
        {at >= 0 && <span className="d-note" style={{ margin: 0 }}><strong>{STEPS[at][1]}</strong>: {STEPS[at][2]} · <code>{STEPS[at][3]}</code></span>}
      </div>
    </div>
  );
}
