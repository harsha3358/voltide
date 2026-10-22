import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../../src/lib/motion.js';
import { award } from '../../../src/lib/game.js';
import { Glyph } from '../../../src/components/Glyphs.jsx';

// A sequence diagram that plays itself. TCP says hello first and confirms every
// piece; UDP just throws packets and doesn't look back.
const TCP = [
  ['SYN', 1, 'Client: “Hi, can we talk? My starting number is 1000.”', '#53eafd'],
  ['SYN-ACK', -1, 'Server: “Yes! Got your 1000. Mine is 5000.”', '#ffdf20'],
  ['ACK', 1, 'Client: “Got your 5000.” Connection open.', '#00d492'],
  ['GET /', 1, 'Now real data flows, numbered so nothing is lost or out of order.', '#8ec5ff'],
  ['200 OK', -1, 'Server replies. Every piece is acknowledged.', '#8ec5ff'],
  ['FIN', 1, 'Client: “Done.” The connection closes politely.', '#fe9a00']
];
const UDP = [
  ['frame 1', 1, 'UDP just sends. No hello, no confirmation.', '#53eafd'],
  ['frame 2', 1, 'Fast and light: perfect for video calls, games, live streams and DNS.', '#53eafd'],
  ['frame 3 ✕', 1, 'Lost on the way? Nobody resends it. A tiny glitch in your video call.', '#ff6467'],
  ['frame 4', 1, 'The stream keeps going. Speed matters more than perfection.', '#53eafd']
];

export default function Handshake() {
  const [mode, setMode] = useState('tcp');
  const [line, setLine] = useState('Press play to watch the conversation.');
  const [played, setPlayed] = useState(() => new Set());
  const ref = useRef(null);
  const steps = mode === 'tcp' ? TCP : UDP;
  const { contextSafe } = useGSAP({ scope: ref, dependencies: [mode], revertOnUpdate: true });
  const play = contextSafe(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        const next = new Set(played).add(mode);
        setPlayed(next);
        if (next.size === 2) award('demo:handshake', 60, 'TCP vs UDP: both played');
      }
    });
    gsap.set('.hs-msg', { opacity: 0 });
    steps.forEach(([, dir, text], i) => {
      const y = 92 + i * 46;
      const from = dir > 0 ? 160 : 640;
      const to = dir > 0 ? 640 : 160;
      const lost = mode === 'udp' && i === 2;
      tl.call(() => setLine(text))
        .set(`.hs-msg-${i}`, { opacity: 1 })
        .fromTo(`.hs-arrow-${i}`, { attr: { x2: from } }, { attr: { x2: lost ? 420 : to }, duration: 0.65, ease: 'power2.in' })
        .fromTo(`.hs-dot-${i}`, { attr: { cx: from, cy: y } }, { attr: { cx: lost ? 420 : to }, duration: 0.65, ease: 'power2.in' }, '<')
        .to(`.hs-splash-${i}`, lost ? { attr: { r: 26 }, opacity: 0, duration: 0.6 } : { duration: 0 })
        .to({}, { duration: 0.6 });
    });
  });
  return (
    <div ref={ref}>
      <div className="d-row" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
        <div className="seg">
          <button type="button" aria-pressed={mode === 'tcp'} onClick={() => { setMode('tcp'); setLine('Press play to watch the conversation.'); }}>TCP (reliable)</button>
          <button type="button" aria-pressed={mode === 'udp'} onClick={() => { setMode('udp'); setLine('Press play to watch the stream.'); }}>UDP (fast)</button>
        </div>
        <button type="button" className="btn btn--sm btn--primary" onClick={play}>▶ Play</button>
      </div>
      <svg viewBox="0 0 800 380">
        {[[160, 'Client', 'laptop'], [640, 'Server', 'server']].map(([x, label, icon]) => (
          <g key={x}>
            <rect x={x - 46} y="10" width="92" height="52" rx="12" fill="#061428" stroke="var(--accent)" strokeWidth="2" />
            <Glyph name={icon} x={x - 34} y={22} size={28} color="#cfe4ff" />
            <text x={x + 12} y="42" fontFamily="Space Grotesk" fontSize="14" fill="var(--text)">{label}</text>
            <line x1={x} y1="62" x2={x} y2="370" stroke="var(--line-strong)" strokeWidth="2" strokeDasharray="4 6" />
          </g>
        ))}
        {steps.map(([label, dir, , color], i) => {
          const y = 92 + i * 46;
          const from = dir > 0 ? 160 : 640;
          return (
            <g key={`${mode}-${i}`} className={`hs-msg hs-msg-${i}`} opacity="0">
              <line className={`hs-arrow-${i}`} x1={from} y1={y} x2={from} y2={y} stroke={color} strokeWidth="2.5" />
              <circle className={`hs-dot-${i}`} cx={from} cy={y} r="7" fill={color} style={{ filter: `drop-shadow(0 0 8px ${color})` }} />
              <circle className={`hs-splash-${i}`} cx="420" cy={y} r="4" fill="none" stroke="var(--danger)" strokeWidth="2" opacity={mode === 'udp' && i === 2 ? 1 : 0} />
              <text x="400" y={y - 8} textAnchor="middle" fontFamily="JetBrains Mono" fontSize="13" fill={color}>{label}</text>
            </g>
          );
        })}
      </svg>
      <div className="info-pop" aria-live="polite">{line}</div>
    </div>
  );
}
