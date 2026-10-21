import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../lib/motion.js';

// Two section dividers: a breathing wave (water) and a circuit trace with
// current pulses running along it (electricity). They alternate between topics.
const wavePath = (phase, amp) => {
  let d = 'M0 35';
  for (let x = 0; x <= 1200; x += 40) d += ` L${x} ${(35 + Math.sin(x / 95 + phase) * amp).toFixed(1)}`;
  return d;
};

export function WaveDivider() {
  const ref = useRef(null);
  useGSAP(
    () => {
      const paths = gsap.utils.toArray('path', ref.current);
      paths.forEach((p, i) => {
        const state = { phase: i * 1.4 };
        gsap.to(state, {
          phase: `+=${Math.PI * 2}`,
          duration: 7 + i * 2,
          repeat: -1,
          ease: 'none',
          onUpdate: () => p.setAttribute('d', wavePath(state.phase, 9 + i * 5))
        });
      });
    },
    { scope: ref }
  );
  return (
    <svg ref={ref} className="divider" viewBox="0 0 1200 70" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="wd-g" x1="0" x2="1">
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0" />
          <stop offset=".5" stopColor="var(--accent)" />
          <stop offset="1" stopColor="var(--accent-2)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2].map(i => (
        <path key={i} d={wavePath(i, 9)} fill="none" stroke="url(#wd-g)" strokeWidth={2 - i * 0.5} opacity={1 - i * 0.28} />
      ))}
    </svg>
  );
}

const TRACE = 'M0 35 H260 L290 12 H520 L550 35 H700 L730 58 H930 L960 35 H1200';

export function CircuitDivider() {
  const ref = useRef(null);
  useGSAP(
    () => {
      gsap.fromTo(
        '.cd-pulse',
        { strokeDashoffset: 1300 },
        { strokeDashoffset: -100, duration: 2.6, ease: 'power1.inOut', repeat: -1, stagger: 1.3, repeatDelay: 0.4 }
      );
      gsap.to('.cd-node', { opacity: 0.3, duration: 0.18, repeat: -1, yoyo: true, repeatDelay: 1.3, stagger: 0.25 });
    },
    { scope: ref }
  );
  return (
    <svg ref={ref} className="divider" viewBox="0 0 1200 70" preserveAspectRatio="none" aria-hidden="true">
      <path d={TRACE} fill="none" stroke="var(--line-strong)" strokeWidth="1.5" />
      {[0, 1].map(i => (
        <path key={i} className="cd-pulse" d={TRACE} fill="none" stroke={i ? 'var(--spark)' : 'var(--accent)'} strokeWidth="2.5" strokeDasharray="90 1300" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 6px currentColor)' }} />
      ))}
      {[260, 520, 700, 930].map(x => (
        <circle key={x} className="cd-node" cx={x + 15} cy={x === 520 ? 12 : x === 930 ? 58 : 35} r="4" fill="var(--accent)" />
      ))}
    </svg>
  );
}
