import { useState } from 'react';

// An IP address is a building; ports are the flats inside it. Each service
// lives behind its own numbered door, and every open door is a way in.
const PORTS = [
  [21, 'FTP', 'File transfer. Sends passwords in plain text.', 'high'],
  [22, 'SSH', 'Secure remote login to Linux servers. Encrypted, but a favourite target for password guessing.', 'medium'],
  [23, 'Telnet', 'Ancient remote login with no encryption at all. Should be closed everywhere.', 'high'],
  [25, 'SMTP', 'Sending email between mail servers.', 'medium'],
  [53, 'DNS', 'Turns names like google.com into IP addresses.', 'low'],
  [80, 'HTTP', 'Websites without encryption. Anyone on the path can read it.', 'medium'],
  [443, 'HTTPS', 'Websites with TLS encryption. The padlock in your browser.', 'low'],
  [3306, 'MySQL', 'A database. Should never be open to the internet.', 'high'],
  [3389, 'RDP', 'Windows Remote Desktop. A top entry point for ransomware gangs.', 'high'],
  [8080, 'HTTP-alt', 'Often a test web server someone forgot to close.', 'medium']
];
const COLOR = { low: 'var(--ok)', medium: 'var(--warn)', high: 'var(--danger)' };

function classify(ip) {
  const m = ip.trim().match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!m) return ['Not a valid IPv4 address', 'Four numbers 0–255 separated by dots, like 192.168.1.10.', 'var(--danger)'];
  const [a, b] = [+m[1], +m[2]];
  if (m.slice(1).some(n => +n > 255)) return ['Invalid', 'Each of the four parts must be between 0 and 255.', 'var(--danger)'];
  if (a === 127) return ['Loopback (this device)', '127.x.x.x always means “myself”. Traffic never leaves your computer.', 'var(--volt)'];
  if (a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168)) return ['Private address', 'Used inside homes, hostels and offices. Not reachable from the internet directly; the router translates it (NAT).', 'var(--ok)'];
  if (a === 169 && b === 254) return ['Link-local (no DHCP)', 'Your device gave itself this because it could not get an address from the router.', 'var(--warn)'];
  if (a >= 224) return ['Multicast / reserved', 'Special-purpose ranges, not used for normal devices.', 'var(--muted)'];
  return ['Public address', 'Globally reachable on the internet. Your router has one; websites have them.', 'var(--accent)'];
}

export default function PortBuilding() {
  const [open, setOpen] = useState(22);
  const [ip, setIp] = useState('192.168.56.102');
  const p = PORTS.find(x => x[0] === open);
  const [kind, text, color] = classify(ip);
  return (
    <div className="split-2-1">
      <div>
        <span className="d-label">Building 192.168.56.102 · tap a door</span>
        <div className="port-building">
          {PORTS.map(([n, name, , risk]) => (
            <button key={n} type="button" className={`port-door ${open === n ? 'is-open' : ''}`} style={{ '--risk': COLOR[risk] }} onClick={() => setOpen(n)} aria-pressed={open === n}>
              <b>{n}</b>
              <span>{name}</span>
            </button>
          ))}
        </div>
        <div className="info-pop" aria-live="polite">
          <strong>Port {p[0]} · {p[1]}: </strong>
          {p[2]} <span className="badge" style={{ color: COLOR[p[3]], marginLeft: 6 }}>risk if exposed: {p[3]}</span>
        </div>
      </div>
      <div className="d-panel">
        <span className="d-label">IP address checker</span>
        <input className="input" style={{ width: '100%' }} value={ip} onChange={e => setIp(e.target.value)} aria-label="IP address" spellCheck="false" />
        <div className="d-row" style={{ marginTop: 8 }}>
          {['192.168.1.5', '10.0.0.1', '8.8.8.8', '127.0.0.1', '300.1.1.1'].map(x => (
            <button key={x} type="button" className="btn btn--sm btn--ghost" onClick={() => setIp(x)}>
              {x}
            </button>
          ))}
        </div>
        <p className="d-big" style={{ fontSize: '1.4rem', color, margin: '16px 0 6px' }}>{kind}</p>
        <p className="d-note" style={{ margin: 0 }}>{text}</p>
      </div>
    </div>
  );
}
