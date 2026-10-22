import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../../src/lib/motion.js';

// How we got here, from a 1961 idea to today. Tap a year (or press play) to
// step through; the era colours show how the cloud grew up.
const ERAS = {
  idea: ['The idea', '#a3b3ff'],
  rent: ['Rent it', '#53eafd'],
  build: ['Build on it', '#46ecd5'],
  everywhere: ['Everywhere', '#ffb900'],
  ai: ['The AI cloud', '#e12afb']
};
const EVENTS = [
  ['1961', 'idea', 'Computing as a utility', 'Computer scientist John McCarthy predicts computing could one day be sold like electricity or water. Took a while, but he was right.'],
  ['1999', 'idea', 'Salesforce: software over the web', 'Business software you use in a browser instead of installing it. One of the first big SaaS companies.'],
  ['2006', 'rent', 'AWS launches S3 and EC2', 'Amazon starts renting storage (S3) and virtual servers (EC2) by the hour. Modern cloud computing begins.'],
  ['2008', 'rent', 'Google App Engine', 'Upload your code, Google runs it. One of the first big PaaS platforms.'],
  ['2010', 'rent', 'Microsoft Azure', 'Microsoft enters the cloud race, later becoming one of the top two providers worldwide.'],
  ['2011', 'rent', 'NIST defines “cloud”', 'The US standards body publishes the official definition, including IaaS, PaaS and SaaS. The words you learn in this episode.'],
  ['2013', 'build', 'Docker containers', 'Apps get packed into lightweight containers that run the same everywhere.'],
  ['2014', 'build', 'Kubernetes and serverless', 'Google open-sources Kubernetes to run containers at scale, and AWS Lambda lets you run a function only when something happens, paying per millisecond.'],
  ['2016', 'everywhere', 'Cloud regions in India', 'AWS opens its Mumbai region (Azure and Google Cloud have Indian regions too), so Indian apps get faster and data can stay in the country.'],
  ['2020', 'everywhere', 'The whole world goes online', 'Lockdown moves classes, offices and exams to Zoom, Meet and Teams overnight. The cloud scales up to carry it.'],
  ['2022', 'ai', 'ChatGPT goes viral', 'A chatbot trained and served on huge cloud GPU clusters reaches millions of users in days. The AI era begins.'],
  ['2024–26', 'ai', 'The AI cloud race', 'Providers build giant AI data centres and design their own AI chips (Google TPU, AWS Trainium, Microsoft Maia). Today almost every app you use, and the site you deploy in Episode 04, runs in the cloud.']
];

export default function CloudTimeline() {
  const ref = useRef(null);
  const [on, setOn] = useState(EVENTS.length - 1);
  const [playing, setPlaying] = useState(false);
  const n = EVENTS.length;
  const xs = EVENTS.map((_, i) => 40 + (i * 1020) / (n - 1));
  useGSAP(
    () => {
      gsap.fromTo('.ct-line', { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.6, ease: 'power2.inOut', scrollTrigger: { trigger: ref.current, start: 'top 80%' } });
      gsap.to('.ct-ripple', { attr: { r: 26 }, opacity: 0, duration: 2.2, repeat: -1, ease: 'power1.out' });
    },
    { scope: ref }
  );
  useEffect(() => {
    if (!playing) return;
    if (on >= n - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setOn(on + 1), 1400);
    return () => clearTimeout(t);
  }, [playing, on]);
  const [year, era, title, text] = EVENTS[on];
  const [eraName, eraColor] = ERAS[era];
  return (
    <div ref={ref}>
      <div className="d-row" style={{ marginBottom: 8 }}>
        <button type="button" className="btn btn--sm btn--primary" onClick={() => (setOn(0), setPlaying(true))}>{playing ? '⏵ Playing…' : '▶ Play history'}</button>
        <div className="d-row" style={{ gap: 12, fontSize: 12.5, color: 'var(--text-soft)' }}>
          {Object.values(ERAS).map(([name, c]) => (
            <span key={name} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><i style={{ width: 10, height: 10, borderRadius: 3, background: c }} />{name}</span>
          ))}
        </div>
      </div>
      <div className="scroll-x">
        <svg viewBox="0 0 1100 92" style={{ minWidth: 640 }} role="group" aria-label="Cloud computing timeline from 1961 to today">
          <line x1="20" y1="48" x2="1080" y2="48" stroke="var(--line-strong)" strokeWidth="3" />
          <line className="ct-line" x1="20" y1="48" x2={xs[on]} y2="48" stroke={eraColor} strokeWidth="3" />
          {xs.map((x, i) => {
            const c = ERAS[EVENTS[i][1]][1];
            const active = i === on;
            return (
              <g key={i} onClick={() => (setPlaying(false), setOn(i))} style={{ cursor: 'pointer' }} role="button" tabIndex={0} aria-label={`${EVENTS[i][0]}: ${EVENTS[i][2]}`} onKeyDown={e => e.key === 'Enter' && setOn(i)}>
                {i === n - 1 && <circle className="ct-ripple" cx={x} cy="48" r="10" fill="none" stroke={c} />}
                <circle cx={x} cy="48" r={active ? 12 : 8} fill={i <= on ? c : '#0b1820'} stroke={c} strokeWidth="2" style={{ filter: active ? `drop-shadow(0 0 10px ${c})` : 'none', transition: 'r 0.25s' }} />
                <text x={x} y={i % 2 ? 84 : 24} textAnchor="middle" fontFamily="JetBrains Mono" fontSize="13" fontWeight={active ? 700 : 400} fill={active ? '#fff' : 'var(--text-soft)'}>{EVENTS[i][0]}</text>
              </g>
            );
          })}
          <text x={xs[n - 1]} y="70" textAnchor="middle" fontFamily="Space Grotesk" fontSize="11" fill={ERAS.ai[1]}>you are here</text>
        </svg>
      </div>
      <div className="d-panel" style={{ borderColor: eraColor, marginTop: 6 }} aria-live="polite">
        <span className="d-label" style={{ color: eraColor }}>{year} · {eraName}</span>
        <h4 style={{ margin: '0 0 6px', fontSize: '1.25rem' }}>{title}</h4>
        <p style={{ fontSize: 15, color: 'var(--text-soft)', margin: 0 }}>{text}</p>
        <div className="d-row" style={{ marginTop: 10 }}>
          <button type="button" className="btn btn--sm btn--ghost" disabled={on === 0} onClick={() => (setPlaying(false), setOn(on - 1))}>← Earlier</button>
          <button type="button" className="btn btn--sm btn--ghost" disabled={on === n - 1} onClick={() => (setPlaying(false), setOn(on + 1))}>Later →</button>
        </div>
      </div>
    </div>
  );
}
