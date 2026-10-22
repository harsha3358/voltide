import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../../src/lib/motion.js';

// How we got here: from renting storage to serverless and Indian cloud regions.
const EVENTS = [
  ['2006', 'AWS launches S3 and EC2', 'Amazon starts renting storage (S3) and virtual servers (EC2) by the hour. Modern cloud computing begins.'],
  ['2008', 'Google App Engine', 'Upload your code, Google runs it. One of the first big PaaS platforms.'],
  ['2010', 'Microsoft Azure', 'Microsoft enters the cloud race, later becoming the #2 provider worldwide.'],
  ['2013', 'Docker containers', 'Apps get packed into lightweight containers that run the same everywhere.'],
  ['2014', 'Serverless (AWS Lambda)', 'Run a function only when something happens, and pay per millisecond. No server to manage.'],
  ['2016', 'Cloud regions in India', 'AWS opens its Mumbai region (Azure and Google followed nearby), so Indian apps get faster and data can stay in the country.']
];

export default function CloudTimeline() {
  const ref = useRef(null);
  useGSAP(
    () => {
      gsap.fromTo('.ct-line', { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.6, ease: 'power2.inOut', scrollTrigger: { trigger: ref.current, start: 'top 80%' } });
      gsap.to('.ct-ripple', { attr: { r: 26 }, opacity: 0, duration: 2.2, repeat: -1, stagger: 0.35, ease: 'power1.out' });
    },
    { scope: ref }
  );
  const xs = EVENTS.map((_, i) => 70 + i * 152);
  return (
    <div ref={ref}>
      <svg viewBox="0 0 900 80" aria-hidden="true">
        <line className="ct-line" x1="30" y1="40" x2="870" y2="40" stroke="var(--accent)" strokeWidth="3" />
        {xs.map((x, i) => (
          <g key={x}>
            <circle className="ct-ripple" cx={x} cy="40" r="9" fill="none" stroke="var(--accent)" />
            <circle cx={x} cy="40" r="9" fill="var(--accent)" style={{ filter: 'drop-shadow(0 0 10px var(--accent))' }} />
            <text x={x} y="20" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="14" fill="var(--text-soft)">{EVENTS[i][0]}</text>
          </g>
        ))}
      </svg>
      <div className="d-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))' }}>
        {EVENTS.map(([year, title, text]) => (
          <div key={year} className="d-panel">
            <span className="d-label">{year}</span>
            <h4 style={{ margin: '0 0 6px', fontSize: '1.08rem' }}>{title}</h4>
            <p style={{ fontSize: 14.5, color: 'var(--text-soft)', margin: 0 }}>{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
