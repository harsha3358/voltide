import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../../src/lib/motion.js';

// Your safe practice lab: two virtual machines inside your laptop, joined by a
// private "host-only" water channel, with the valve to the internet shut.
const PARTS = {
  host: ['Your laptop (the host)', 'The real computer. VirtualBox runs on it and pretends to be extra computers.'],
  vbox: ['VirtualBox', 'Free software that creates virtual machines (VMs): computers made of software, living inside a window.'],
  kali: ['Kali Linux VM · 192.168.56.101', 'Your toolbox computer. It comes with hundreds of security tools pre-installed. You practise FROM here.'],
  ubuntu: ['Ubuntu VM · 192.168.56.102', 'Your practice target. You own it, so you are allowed to test it. In later sessions it runs a web server and firewall.'],
  net: ['Host-only network 192.168.56.0/24', 'A private network that exists only inside your laptop. The VMs can talk to each other, but nobody outside can reach them.'],
  valve: ['Closed valve to the internet', 'While you practise attacks, keep the lab cut off from real networks, so a mistake cannot hurt anyone else.']
};

export default function LabTopology() {
  const ref = useRef(null);
  const [pick, setPick] = useState('net');
  useGSAP(
    () => {
      gsap.to('.lt-flow', { strokeDashoffset: -60, duration: 1.4, repeat: -1, ease: 'none' });
      const path = ref.current.querySelector('.lt-channel');
      gsap.utils.toArray('.lt-drop', ref.current).forEach((d, i) => {
        gsap.to(d, { motionPath: { path, align: path, alignOrigin: [0.5, 0.5], start: i % 2, end: (i + 1) % 2 }, duration: 3, repeat: -1, delay: i * 0.75, ease: 'sine.inOut' });
      });
      gsap.to('.lt-x', { opacity: 0.3, repeat: -1, yoyo: true, duration: 0.6 });
    },
    { scope: ref }
  );
  const Hot = ({ id, children }) => (
    <g className="svg-hover-node" role="button" tabIndex={0} aria-label={PARTS[id][0]} onClick={() => setPick(id)} onMouseEnter={() => setPick(id)} onFocus={() => setPick(id)}>
      {children}
    </g>
  );
  return (
    <div ref={ref}>
      <svg viewBox="0 0 900 400">
        <Hot id="host">
          <rect x="20" y="20" width="660" height="360" rx="26" fill="rgba(125,249,255,.03)" stroke={pick === 'host' ? 'var(--spark)' : 'var(--line-strong)'} strokeWidth="2" />
          <text x="44" y="56" fontFamily="Space Grotesk" fontSize="18" fill="var(--text)">💻 Your laptop (host)</text>
        </Hot>
        <Hot id="vbox">
          <rect x="50" y="80" width="600" height="270" rx="20" fill="rgba(77,139,255,.05)" stroke={pick === 'vbox' ? 'var(--spark)' : '#2c4f8f'} strokeWidth="2" strokeDasharray="6 6" />
          <text x="72" y="110" fontFamily="JetBrains Mono" fontSize="14" fill="#7fa8ff">VirtualBox</text>
        </Hot>
        <path className="lt-channel" d="M210 230 C 300 300, 400 300, 490 230" fill="none" stroke="#0b2a3a" strokeWidth="26" strokeLinecap="round" />
        <Hot id="net">
          <path d="M210 230 C 300 300, 400 300, 490 230" fill="none" stroke={pick === 'net' ? 'var(--spark)' : 'var(--tide)'} strokeOpacity=".35" strokeWidth="18" strokeLinecap="round" />
          <path className="lt-flow" d="M210 230 C 300 300, 400 300, 490 230" fill="none" stroke="var(--tide)" strokeWidth="3" strokeDasharray="10 20" />
          <text x="350" y="326" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="13" fill="var(--tide)">host-only · 192.168.56.0/24</text>
        </Hot>
        {[0, 1, 2, 3].map(i => (
          <circle key={i} className="lt-drop" r="6" fill={i % 2 ? 'var(--spark)' : '#bffcff'} style={{ filter: 'drop-shadow(0 0 6px #7df9ff)' }} />
        ))}
        <Hot id="kali">
          <rect x="100" y="140" width="200" height="90" rx="16" fill="#071a33" stroke={pick === 'kali' ? 'var(--spark)' : '#4d8bff'} strokeWidth="2.5" />
          <text x="200" y="178" textAnchor="middle" fontSize="24">🐉</text>
          <text x="200" y="206" textAnchor="middle" fontFamily="Space Grotesk" fontSize="16" fill="var(--text)">Kali Linux</text>
          <text x="200" y="224" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="11" fill="var(--muted)">.56.101</text>
        </Hot>
        <Hot id="ubuntu">
          <rect x="400" y="140" width="200" height="90" rx="16" fill="#1d0c19" stroke={pick === 'ubuntu' ? 'var(--spark)' : '#ff7a45'} strokeWidth="2.5" />
          <text x="500" y="178" textAnchor="middle" fontSize="24">🎯</text>
          <text x="500" y="206" textAnchor="middle" fontFamily="Space Grotesk" fontSize="16" fill="var(--text)">Ubuntu target</text>
          <text x="500" y="224" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="11" fill="var(--muted)">.56.102</text>
        </Hot>
        <line x1="680" y1="200" x2="790" y2="200" stroke="var(--line-strong)" strokeWidth="10" strokeLinecap="round" />
        <Hot id="valve">
          <circle cx="735" cy="200" r="22" fill="#1a0b14" stroke="var(--danger)" strokeWidth="3" />
          <path className="lt-x" d="M725 190 L745 210 M745 190 L725 210" stroke="var(--danger)" strokeWidth="4" strokeLinecap="round" />
        </Hot>
        <text x="830" y="190" textAnchor="middle" fontSize="40">🌐</text>
        <text x="830" y="230" textAnchor="middle" fontFamily="Space Grotesk" fontSize="15" fill="var(--muted)">Internet</text>
      </svg>
      <div className="info-pop" aria-live="polite">
        <strong>{PARTS[pick][0]}: </strong>
        {PARTS[pick][1]}
      </div>
    </div>
  );
}
