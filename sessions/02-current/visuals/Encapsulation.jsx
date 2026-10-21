import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../../src/lib/motion.js';

// Sending data is like posting a letter inside envelopes inside a parcel.
// Each layer wraps the one before with its own label (header).
const LAYERS = [
  ['Application', 'Data', 'GET /index.html, the actual request', '#ffd23f'],
  ['Transport · TCP', 'Segment', 'adds ports: from 51544 → to 443, plus sequence numbers', '#7df9ff'],
  ['Internet · IP', 'Packet', 'adds IP addresses: from 192.168.1.5 → to 142.250.183.4', '#4d8bff'],
  ['Link · Wi-Fi/Ethernet', 'Frame', 'adds MAC addresses: from your NIC → to your router', '#b56cff']
];

export default function Encapsulation() {
  const [step, setStep] = useState(1);
  const ref = useRef(null);
  useGSAP(() => {
    gsap.fromTo(`.enc-${step - 1}`, { scale: 1.18, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.8)', svgOrigin: '400 170' });
  }, { scope: ref, dependencies: [step] });
  return (
    <div ref={ref}>
      <svg viewBox="0 0 800 340">
        {LAYERS.slice(0, step)
          .map((l, i) => [l, i])
          .reverse()
          .map(([[name, unit, , color], i]) => {
            const w = 240 + i * 150;
            const h = 70 + i * 70;
            const x = 400 - w / 2;
            const y = 170 - h / 2;
            return (
              <g key={i} className={`enc-${i}`}>
                <rect x={x} y={y} width={w} height={h} rx="16" fill={i ? 'rgba(5,12,26,.7)' : color} stroke={color} strokeWidth="2.5" style={{ filter: `drop-shadow(0 0 10px ${color})` }} />
                {i ? (
                  <text x={x + 16} y={y + 24} fontFamily="JetBrains Mono" fontSize="13" fontWeight="700" fill={color}>
                    {unit.toUpperCase()} HEADER · {name}
                  </text>
                ) : (
                  <text x="400" y="177" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="18" fontWeight="700" fill="#1d1500">
                    DATA: GET /index.html
                  </text>
                )}
              </g>
            );
          })}
      </svg>
      <div className="d-row">
        <button type="button" className="btn btn--sm btn--primary" disabled={step >= 4} onClick={() => setStep(s => s + 1)}>
          Wrap the next layer
        </button>
        <button type="button" className="btn btn--sm btn--ghost" onClick={() => setStep(1)}>
          Reset
        </button>
        <span className="d-note" style={{ margin: 0 }}>Layer {step} of 4</span>
      </div>
      <ul className="points" style={{ marginTop: 14 }}>
        {LAYERS.map(([name, unit, text, color], i) => (
          <li key={name} style={{ opacity: i < step ? 1 : 0.35, transition: 'opacity .4s' }}>
            <strong style={{ color }}>{name}</strong> wraps it into a <strong>{unit}</strong>: {text}.
          </li>
        ))}
      </ul>
    </div>
  );
}
