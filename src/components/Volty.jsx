import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../lib/motion.js';

// Volty: a water droplet with a spark for a heart. Floats, blinks, and changes
// face with `mood` (idle · happy · shock · smug).
export default function Volty({ size = 64, mood = 'idle' }) {
  const ref = useRef(null);
  useGSAP(
    () => {
      gsap.to('.vt-body', { y: -4, duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      gsap.to('.vt-eye', { scaleY: 0.1, transformOrigin: 'center', duration: 0.08, yoyo: true, repeat: -1, repeatDelay: 3.2 });
      gsap.to('.vt-spark', { opacity: 0.4, duration: 0.12, yoyo: true, repeat: -1, repeatDelay: 1.4 });
      if (mood === 'happy') gsap.fromTo('.vt-body', { scale: 0.85 }, { scale: 1, svgOrigin: '32 40', duration: 0.6, ease: 'elastic.out(1.2, 0.4)' });
      if (mood === 'shock') gsap.fromTo('.vt-body', { x: -3 }, { x: 0, duration: 0.4, ease: 'rough({ strength: 3, points: 12, randomize: true })' });
    },
    { scope: ref, dependencies: [mood], revertOnUpdate: true }
  );
  const mouth = { idle: 'M26 46 q6 4 12 0', happy: 'M24 44 q8 9 16 0', shock: 'M29 46 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0', smug: 'M26 46 q8 3 12 -2' }[mood];
  return (
    <svg ref={ref} width={size} height={size} viewBox="0 0 64 72" aria-hidden="true" style={{ overflow: 'visible', flex: 'none' }}>
      <ellipse cx="32" cy="69" rx="14" ry="2.5" fill="#2ee6c5" opacity=".25" />
      <g className="vt-body">
        <defs>
          <linearGradient id="vt-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#bffcff" />
            <stop offset=".55" stopColor="#2ee6c5" />
            <stop offset="1" stopColor="#1a7bd6" />
          </linearGradient>
        </defs>
        <path d="M32 4C32 4 10 30 10 44a22 22 0 0 0 44 0C54 30 32 4 32 4z" fill="url(#vt-g)" stroke="#e8feff" strokeWidth="1.5" />
        <path d="M19 30 q4 -8 9 -12" stroke="#fff" strokeOpacity=".7" strokeWidth="3" strokeLinecap="round" fill="none" />
        <ellipse className="vt-eye" cx="25" cy="38" rx="3" ry={mood === 'shock' ? 4.5 : 3.6} fill="#04101f" />
        <ellipse className="vt-eye" cx="39" cy="38" rx="3" ry={mood === 'shock' ? 4.5 : 3.6} fill="#04101f" />
        <circle cx="26" cy="37" r="1" fill="#fff" />
        <circle cx="40" cy="37" r="1" fill="#fff" />
        <path d={mouth} stroke="#04101f" strokeWidth="2.2" fill={mood === 'shock' ? '#04101f' : 'none'} strokeLinecap="round" />
        <path className="vt-spark" d="M33 52 l-4 6 h3 l-1 5 5-7 h-3 l1-4z" fill="#ffd23f" />
      </g>
    </svg>
  );
}
