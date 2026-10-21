import { useId, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../lib/motion.js';

// A small water tank that fills as topics are marked done.
export default function Tank({ value, total, label = 'missions done' }) {
  const ref = useRef(null);
  const clip = useId();
  const pct = total ? value / total : 0;
  useGSAP(
    () => {
      gsap.to('.tank-level', { y: 46 * (1 - pct), duration: 1.1, ease: 'elastic.out(1, 0.55)' });
      gsap.fromTo('.tank-wave', { x: 0 }, { x: -24, duration: 2.2, repeat: -1, ease: 'none' });
    },
    { scope: ref, dependencies: [pct] }
  );
  return (
    <div className="tank" ref={ref}>
      <svg viewBox="0 0 44 56" aria-hidden="true">
        <defs>
          <clipPath id={clip}>
            <rect x="4" y="6" width="36" height="46" rx="8" />
          </clipPath>
        </defs>
        <rect x="4" y="6" width="36" height="46" rx="8" fill="rgba(255,255,255,.03)" />
        <g clipPath={`url(#${clip})`}>
          <g transform="translate(0 4)">
            <g className="tank-level" transform="translate(0 46)">
              <path className="tank-wave" d="M0 2 q6 -4 12 0 t12 0 t12 0 t12 0 t12 0 t12 0 V60 H0z" fill="var(--accent)" opacity=".8" />
            </g>
          </g>
        </g>
        <rect x="4" y="6" width="36" height="46" rx="8" fill="none" stroke="var(--line-strong)" strokeWidth="1.5" />
        <rect x="16" y="1.5" width="12" height="5" rx="2" fill="var(--line-strong)" />
      </svg>
      <div className="tank__label">
        <strong>
          {value}/{total}
        </strong>
        {label}
      </div>
    </div>
  );
}
