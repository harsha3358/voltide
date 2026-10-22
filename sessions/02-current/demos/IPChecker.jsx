import { useEffect, useState } from 'react';
import { award } from '../../../src/lib/game.js';

// Type any IPv4 address and find out what kind it is.
export function classify(ip) {
  const m = ip.trim().match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!m) return ['Not a valid IPv4 address', 'Four numbers from 0 to 255 separated by dots, like 192.168.1.10.', 'var(--danger)', 'bad'];
  const [a, b] = [+m[1], +m[2]];
  if (m.slice(1).some(n => +n > 255)) return ['Invalid', 'Each of the four parts must be between 0 and 255.', 'var(--danger)', 'bad'];
  if (a === 127) return ['Loopback (this device)', '127.x.x.x always means “myself”. Traffic never leaves your computer.', 'var(--volt)', 'loop'];
  if (a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168))
    return ['Private address', 'Used inside homes, hostels, offices and cloud networks (VPCs). Not reachable from the internet directly; a router or NAT gateway translates it.', 'var(--ok)', 'private'];
  if (a === 169 && b === 254) return ['Link-local (no DHCP)', 'Your device gave itself this because it couldn’t get an address from the router.', 'var(--warn)', 'link'];
  if (a >= 224) return ['Multicast / reserved', 'Special-purpose ranges, not used for normal devices.', 'var(--muted)', 'reserved'];
  return ['Public address', 'Reachable on the internet. Your router has one; a cloud VM gets one so the world can reach it.', 'var(--accent)', 'public'];
}

const SAMPLES = [
  ['192.168.1.5', 'your laptop on hostel Wi-Fi'],
  ['10.0.2.15', 'your Ubuntu VM on NAT'],
  ['172.31.20.4', 'an EC2 instance inside AWS'],
  ['13.233.10.7', 'that EC2 instance’s public IP'],
  ['8.8.8.8', 'Google’s DNS server'],
  ['127.0.0.1', 'localhost'],
  ['300.1.1.1', 'a typo']
];

export default function IPChecker() {
  const [ip, setIp] = useState('192.168.1.5');
  const [seen, setSeen] = useState(() => new Set());
  const [kind, text, color, key] = classify(ip);
  useEffect(() => {
    setSeen(prev => new Set(prev).add(key));
  }, [key]);
  useEffect(() => {
    if (seen.has('private') && seen.has('public') && seen.has('loop')) award('demo:ip', 60, 'Public, private AND loopback spotted');
  }, [seen]);
  return (
    <div className="split-2-1">
      <div className="d-panel">
        <label className="d-label" htmlFor="ip-in">Type an IP address</label>
        <input id="ip-in" className="input" style={{ width: '100%' }} value={ip} onChange={e => setIp(e.target.value)} spellCheck="false" />
        <p className="d-big" style={{ fontSize: '1.5rem', color, margin: '16px 0 6px' }}>{kind}</p>
        <p className="d-note" style={{ margin: 0 }}>{text}</p>
      </div>
      <div className="d-panel">
        <span className="d-label">Try these</span>
        <div style={{ display: 'grid', gap: 6 }}>
          {SAMPLES.map(([x, label]) => (
            <button key={x} type="button" className="btn btn--sm btn--ghost" style={{ justifyContent: 'space-between' }} onClick={() => setIp(x)}>
              <code>{x}</code> <span style={{ color: 'var(--muted)', fontSize: 12.5 }}>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
