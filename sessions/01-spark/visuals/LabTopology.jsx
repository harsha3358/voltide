import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../../src/lib/motion.js';

// Your practice cloud-in-a-laptop: VirtualBox runs an Ubuntu VM that reaches
// the internet through your laptop (NAT), exactly like a tiny cloud server.
const PARTS = {
  host: ['Your laptop (the host)', 'The real computer. Its CPU, RAM and disk get shared with the virtual machine.'],
  vbox: ['VirtualBox / VMware (hypervisor)', 'The software that slices your laptop into virtual computers. Cloud providers run the same idea on giant servers.'],
  vm: ['Ubuntu VM', 'Your own Linux server. In Episode 03 you install a C compiler and a web app on it, just like on a cloud VM.'],
  res: ['VM resources', 'You decide how much CPU, RAM and disk the VM gets, exactly like picking a machine size on AWS or Azure.'],
  nat: ['NAT network', 'The VM borrows your laptop’s internet connection, so it can download updates while hiding behind your laptop.'],
  net: ['Internet', 'Where cloud providers live. Same Ubuntu, same commands: only the computer is somewhere else.']
};

export default function LabTopology() {
  const ref = useRef(null);
  const [pick, setPick] = useState('vm');
  useGSAP(
    () => {
      gsap.to('.lt-flow', { strokeDashoffset: -60, duration: 1.4, repeat: -1, ease: 'none' });
      gsap.to('.lt-cpu', { opacity: 0.35, duration: 0.5, repeat: -1, yoyo: true, stagger: 0.15 });
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
      <svg viewBox="0 0 900 380">
        <Hot id="host">
          <rect x="20" y="20" width="620" height="340" rx="26" fill="rgba(83,234,253,.03)" stroke={pick === 'host' ? 'var(--spark)' : 'var(--line-strong)'} strokeWidth="2" />
          <text x="44" y="56" fontFamily="Space Grotesk" fontSize="18" fill="var(--text)">💻 Your laptop (host)</text>
        </Hot>
        <Hot id="vbox">
          <rect x="50" y="80" width="560" height="250" rx="20" fill="rgba(43,127,255,.05)" stroke={pick === 'vbox' ? 'var(--spark)' : '#2c4f8f'} strokeWidth="2" strokeDasharray="6 6" />
          <text x="72" y="110" fontFamily="JetBrains Mono" fontSize="14" fill="#8ec5ff">VirtualBox / VMware</text>
        </Hot>
        <Hot id="vm">
          <rect x="110" y="140" width="250" height="150" rx="18" fill="#2a0f1a" stroke={pick === 'vm' ? 'var(--spark)' : '#e95420'} strokeWidth="2.5" />
          <circle cx="160" cy="190" r="20" fill="#e95420" />
          <text x="160" y="197" textAnchor="middle" fontFamily="Space Grotesk" fontWeight="700" fontSize="18" fill="#fff">U</text>
          <text x="195" y="186" fontFamily="Space Grotesk" fontSize="18" fill="var(--text)">Ubuntu VM</text>
          <text x="195" y="208" fontFamily="JetBrains Mono" fontSize="12" fill="var(--muted)">student@ubuntu</text>
          <text x="130" y="260" fontFamily="JetBrains Mono" fontSize="12" fill="var(--muted)">$ sudo apt update ▌</text>
        </Hot>
        <Hot id="res">
          <rect x="390" y="140" width="190" height="150" rx="18" fill="#0b1820" stroke={pick === 'res' ? 'var(--spark)' : 'var(--accent)'} strokeWidth="2" />
          {['2 CPU', '4 GB RAM', '25 GB disk'].map((t, i) => (
            <g key={t}>
              <rect className="lt-cpu" x="410" y={160 + i * 40} width="14" height="14" rx="3" fill="var(--accent)" />
              <text x="434" y={172 + i * 40} fontFamily="JetBrains Mono" fontSize="14" fill="var(--text)">{t}</text>
            </g>
          ))}
        </Hot>
        <Hot id="nat">
          <path d="M610 205 H760" stroke="var(--line-strong)" strokeWidth="12" strokeLinecap="round" />
          <path className="lt-flow" d="M610 205 H760" stroke="var(--ok)" strokeWidth="3" strokeDasharray="10 20" />
          <text x="685" y="190" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="13" fill="var(--ok)">NAT</text>
        </Hot>
        <Hot id="net">
          <text x="820" y="215" textAnchor="middle" fontSize="44">🌐</text>
          <text x="820" y="250" textAnchor="middle" fontFamily="Space Grotesk" fontSize="15" fill="var(--muted)">Internet &amp; cloud</text>
        </Hot>
      </svg>
      <div className="info-pop" aria-live="polite">
        <strong>{PARTS[pick][0]}: </strong>
        {PARTS[pick][1]}
      </div>
    </div>
  );
}
