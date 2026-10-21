import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../../src/lib/motion.js';

const EVENTS = [
  { year: '2017', name: 'WannaCry ransomware', where: 'Worldwide, 150+ countries', what: 'A worm spread through computers that had skipped a Windows security update, locking files and demanding Bitcoin. Hospitals in the UK had to turn patients away.', lesson: 'Install updates. The fix existed months before the attack.' },
  { year: '2017', name: 'Equifax data breach', where: 'USA, about 147 million people', what: 'Attackers used a known bug in a web application that had not been patched, and quietly copied personal and financial records.', lesson: 'One unpatched server can expose millions of people.' },
  { year: '2022', name: 'AIIMS Delhi ransomware', where: 'India, a major public hospital', what: 'A ransomware attack took core hospital servers offline. Staff ran registration and labs by hand for around two weeks.', lesson: 'Cyber attacks hurt real people offline. Backups and response plans save time.' }
];

export default function IncidentTimeline() {
  const ref = useRef(null);
  useGSAP(
    () => {
      gsap.fromTo('.it-line', { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.6, ease: 'power2.inOut', scrollTrigger: { trigger: ref.current, start: 'top 80%' } });
      gsap.to('.it-ripple', { attr: { r: 34 }, opacity: 0, duration: 2.2, repeat: -1, stagger: 0.7, ease: 'power1.out' });
    },
    { scope: ref }
  );
  return (
    <div ref={ref}>
      <svg viewBox="0 0 900 80" aria-hidden="true">
        <line className="it-line" x1="40" y1="40" x2="860" y2="40" stroke="var(--danger)" strokeWidth="3" />
        {[150, 450, 750].map((x, i) => (
          <g key={x}>
            <circle className="it-ripple" cx={x} cy="40" r="10" fill="none" stroke="var(--danger)" />
            <circle cx={x} cy="40" r="10" fill="var(--danger)" style={{ filter: 'drop-shadow(0 0 10px var(--danger))' }} />
            <text x={x} y="20" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="14" fill="var(--text-soft)">{EVENTS[i].year}</text>
          </g>
        ))}
      </svg>
      <div className="d-grid">
        {EVENTS.map(e => (
          <div key={e.name} className="d-panel">
            <span className="d-label">{e.where}</span>
            <h4 style={{ margin: '0 0 8px', fontSize: '1.15rem' }}>{e.name}</h4>
            <p style={{ fontSize: 14.5, color: 'var(--text-soft)', margin: '0 0 10px' }}>{e.what}</p>
            <p style={{ fontSize: 14, margin: 0 }}>
              <strong style={{ color: 'var(--spark)' }}>Lesson: </strong>
              {e.lesson}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
