import { useEffect, useRef, useState } from 'react';
import { award, badge } from '../../../src/lib/game.js';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../../src/lib/motion.js';

// Your message is split into packets that flow like water through pipes:
// device → Wi-Fi router → ISP → internet → server, then get reassembled.
const NODES = [
  { id: 'you', x: 70, y: 150, icon: '📱', name: 'Your device', text: 'Your phone or laptop is the **client**. It has an IP address, like a house number, so replies can find their way back.' },
  { id: 'router', x: 250, y: 150, icon: '📶', name: 'Wi-Fi router', text: 'The router joins your home or hostel network to the outside world. It is the main gate: everything leaving or entering passes through here.' },
  { id: 'isp', x: 430, y: 150, icon: '🏢', name: 'ISP', text: 'Your Internet Service Provider (Jio, Airtel, BSNL, your college) owns the big pipes that carry your packets onward.' },
  { id: 'net', x: 610, y: 150, icon: '🌐', name: 'Internet', text: 'A network of networks. Packets hop through many routers, each one choosing the next pipe, like water finding its way downhill.' },
  { id: 'server', x: 790, y: 150, icon: '🖥️', name: 'Web server', text: 'The **server** is a computer that answers requests, for example the college website. It sends its reply back as packets the same way.' }
];
const PIPE = 'M70 150 C 160 90, 160 90, 250 150 S 340 210, 430 150 S 520 90, 610 150 S 700 210, 790 150';
const WORD = ['H', 'E', 'L', 'L', 'O'];

export default function PacketPipes() {
  const ref = useRef(null);
  const [info, setInfo] = useState(NODES[0]);
  const [arrived, setArrived] = useState('');
  useEffect(() => {
    if (arrived === 'HELLO' && award('demo:packets', 50, 'HELLO delivered')) badge('packet-pusher');
  }, [arrived]);
  const { contextSafe } = useGSAP(
    () => {
      gsap.to('.pp-flow', { strokeDashoffset: -80, duration: 2, repeat: -1, ease: 'none' });
      gsap.to('.pp-halo', { attr: { r: 42 }, opacity: 0, duration: 2, repeat: -1, stagger: 0.4, ease: 'power1.out' });
    },
    { scope: ref }
  );
  const send = contextSafe(() => {
    setArrived('');
    const packets = gsap.utils.toArray('.pp-packet', ref.current);
    gsap.set(packets, { opacity: 1 });
    packets.forEach((p, i) => {
      const pipe = ref.current.querySelector('.pp-pipe');
      gsap.to(p, {
        motionPath: { path: pipe, align: pipe, alignOrigin: [0.5, 0.5] },
        duration: 2.6 + Math.random() * 1.2,
        delay: i * 0.25,
        ease: 'power1.inOut',
        overwrite: true,
        onComplete: () => {
          gsap.to(p, { opacity: 0, duration: 0.2 });
          setArrived(a => (a.length < WORD.length ? WORD.slice(0, a.length + 1).join('') : a));
        }
      });
    });
  });
  return (
    <div ref={ref}>
      <svg viewBox="0 0 860 260">
        <path className="pp-pipe" d={PIPE} fill="none" stroke="#0b2a3a" strokeWidth="22" strokeLinecap="round" />
        <path d={PIPE} fill="none" stroke="var(--tide)" strokeOpacity=".25" strokeWidth="14" strokeLinecap="round" />
        <path className="pp-flow" d={PIPE} fill="none" stroke="var(--tide)" strokeWidth="3" strokeDasharray="10 30" strokeLinecap="round" />
        {NODES.map(n => (
          <g key={n.id} className="svg-hover-node" tabIndex={0} role="button" aria-label={n.name} onClick={() => setInfo(n)} onFocus={() => setInfo(n)} onMouseEnter={() => setInfo(n)}>
            <circle className="pp-halo" cx={n.x} cy={n.y} r="30" fill="none" stroke="var(--tide)" />
            <circle cx={n.x} cy={n.y} r="32" fill="#06172a" stroke={info.id === n.id ? 'var(--spark)' : 'var(--tide)'} strokeWidth="2" />
            <text x={n.x} y={n.y + 9} textAnchor="middle" fontSize="26">{n.icon}</text>
            <text x={n.x} y={n.y + 62} textAnchor="middle" fontFamily="Space Grotesk" fontSize="15" fill="var(--text)">{n.name}</text>
          </g>
        ))}
        {WORD.map((l, i) => (
          <g key={i} className="pp-packet" opacity="0">
            <rect x="-13" y="-13" width="26" height="26" rx="7" fill="var(--spark)" style={{ filter: 'drop-shadow(0 0 8px var(--spark))' }} />
            <text y="5" textAnchor="middle" fontFamily="JetBrains Mono" fontWeight="700" fontSize="14" fill="#2a1d00">{l}</text>
          </g>
        ))}
        <text x="790" y="72" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="16" fill="var(--spark)">{arrived ? `received: ${arrived}` : ''}</text>
      </svg>
      <div className="d-row">
        <button type="button" className="btn btn--sm btn--primary" onClick={send}>
          ⚡ Send “HELLO” as 5 packets
        </button>
        <span className="d-note" style={{ margin: 0 }}>Hover or tap each stop to learn what it does.</span>
      </div>
      <div className="info-pop" aria-live="polite">
        <strong>{info.icon} {info.name}: </strong>
        <span dangerouslySetInnerHTML={{ __html: info.text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
      </div>
    </div>
  );
}
