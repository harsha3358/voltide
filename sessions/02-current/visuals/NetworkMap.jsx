import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../../src/lib/motion.js';
import { Glyph } from '../../../src/components/Glyphs.jsx';

// A hostel network drawn as a circuit board: devices → switch/AP → router → modem → ISP.
// Current pulses run along the traces; tap any part to learn what it does.
const PARTS = {
  laptop: ['Laptop (NIC)', 'Every device has a Network Interface Card (Wi-Fi or Ethernet). The NIC has a permanent hardware address called a **MAC address**.', 'laptop', 90, 70],
  phone: ['Phone', 'Your phone joins over Wi-Fi radio waves, still with its own MAC and an IP address from the router.', 'phone', 90, 190],
  printer: ['Printer / IoT', 'Printers, smart TVs and CCTV cameras are computers too, and often the least protected device on the network.', 'printer', 90, 310],
  switch: ['Switch + Wi-Fi access point', 'Connects devices **inside** the same local network (LAN). It forwards frames using MAC addresses.', 'switch', 330, 190],
  router: ['Router + firewall', 'Joins your LAN to other networks. It hands out private IPs (DHCP), translates them to one public IP (NAT) and usually has a basic firewall.', 'router', 560, 190],
  modem: ['Modem / ONT', 'Converts signals for the ISP’s fibre or cable. The boundary between your network and the outside world.', 'modem', 760, 190],
  isp: ['ISP → Internet', 'Your provider’s network, then the wider internet: a WAN (Wide Area Network) of countless routers.', 'globe', 940, 190]
};
const LINKS = [['laptop', 'switch'], ['phone', 'switch'], ['printer', 'switch'], ['switch', 'router'], ['router', 'modem'], ['modem', 'isp']];

export default function NetworkMap() {
  const ref = useRef(null);
  const [pick, setPick] = useState('router');
  useGSAP(() => gsap.to('.nm-pulse', { strokeDashoffset: -200, duration: 1.8, repeat: -1, ease: 'none', stagger: 0.25 }), { scope: ref });
  const path = ([a, b]) => {
    const [, , , x1, y1] = PARTS[a];
    const [, , , x2, y2] = PARTS[b];
    const mx = (x1 + x2) / 2;
    return `M${x1 + 40} ${y1} H${mx} V${y2} H${x2 - 40}`;
  };
  return (
    <div ref={ref}>
      <svg viewBox="0 0 1020 380">
        <rect x="20" y="20" width="420" height="340" rx="20" fill="rgba(77,139,255,.05)" stroke="#2c4f8f" strokeDasharray="6 6" />
        <text x="40" y="350" fontFamily="JetBrains Mono" fontSize="13" fill="#7fa8ff">LAN · private 192.168.1.0/24</text>
        <text x="880" y="350" fontFamily="JetBrains Mono" fontSize="13" fill="var(--muted)">WAN · public internet</text>
        {LINKS.map(l => (
          <g key={l.join()}>
            <path d={path(l)} fill="none" stroke="var(--line-strong)" strokeWidth="3" />
            <path className="nm-pulse" d={path(l)} fill="none" stroke="var(--accent)" strokeWidth="3" strokeDasharray="24 176" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 6px var(--accent))' }} />
          </g>
        ))}
        {Object.entries(PARTS).map(([id, [name, , icon, x, y]]) => (
          <g key={id} className="svg-hover-node" role="button" tabIndex={0} aria-label={name} onClick={() => setPick(id)} onMouseEnter={() => setPick(id)} onFocus={() => setPick(id)}>
            <rect x={x - 40} y={y - 36} width="80" height="72" rx="16" fill="#061428" stroke={pick === id ? 'var(--spark)' : 'var(--accent)'} strokeWidth="2" />
            <Glyph name={icon} x={x - 16} y={y - 24} size={32} color={pick === id ? 'var(--spark)' : '#cfe4ff'} />
            <text x={x} y={y + 26} textAnchor="middle" fontFamily="Space Grotesk" fontSize="12" fill="var(--text-soft)">{name.split(' ')[0]}</text>
          </g>
        ))}
      </svg>
      <div className="info-pop" aria-live="polite">
        <strong>{PARTS[pick][0]}: </strong>
        <span dangerouslySetInnerHTML={{ __html: PARTS[pick][1].replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
      </div>
    </div>
  );
}
