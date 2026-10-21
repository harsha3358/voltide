import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../lib/motion.js';

// A water droplet with a lightning bolt inside: the VOLTIDE mark.
// The drop outline draws itself, the bolt flickers and ripples spread below.
export default function Logo({ size = 30, animated = true }) {
  const ref = useRef(null);
  useGSAP(
    () => {
      if (!animated) return;
      gsap.from('.logo-drop', { drawSVG: '0%', duration: 1.6, ease: 'power2.inOut' });
      gsap.to('.logo-bolt', {
        keyframes: [{ opacity: 0.35 }, { opacity: 1 }, { opacity: 0.6 }, { opacity: 1 }],
        duration: 0.5,
        repeat: -1,
        repeatDelay: 2.6,
        ease: 'none'
      });
      gsap.fromTo(
        '.logo-ring',
        { attr: { rx: 4, ry: 1.2 }, opacity: 0.9 },
        { attr: { rx: 26, ry: 5 }, opacity: 0, duration: 2.4, ease: 'power1.out', stagger: 0.8, repeat: -1 }
      );
    },
    { scope: ref }
  );
  return (
    <svg ref={ref} width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7df9ff" />
          <stop offset="1" stopColor="#2ee6c5" />
        </linearGradient>
        <filter id="logo-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <ellipse className="logo-ring" cx="32" cy="61" rx="4" ry="1.2" fill="none" stroke="#2ee6c5" strokeWidth="1" />
      <ellipse className="logo-ring" cx="32" cy="61" rx="4" ry="1.2" fill="none" stroke="#2ee6c5" strokeWidth="1" />
      <path className="logo-drop" d="M32 4C32 4 12 28 12 41a20 20 0 0 0 40 0C52 28 32 4 32 4z" fill="rgba(6,16,33,.8)" stroke="url(#logo-g)" strokeWidth="3" />
      <path className="logo-bolt" d="M35 20 24 38h8l-3 14 12-19h-8l2-13z" fill="#ffd23f" filter="url(#logo-glow)" />
    </svg>
  );
}
