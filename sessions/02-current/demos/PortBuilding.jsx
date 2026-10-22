import { useState } from 'react';

// An IP address is a building; ports are the numbered flats inside it.
// Each service on a server lives behind its own door.
const PORTS = [
  [21, 'FTP', 'File transfer. Sends passwords in plain text.', 'high'],
  [22, 'SSH', 'Secure remote login to Linux servers, how you’ll log into EC2. Allow it only from your own IP.', 'medium'],
  [23, 'Telnet', 'Ancient remote login with no encryption at all. Should be closed everywhere.', 'high'],
  [25, 'SMTP', 'Sending email between mail servers.', 'medium'],
  [53, 'DNS', 'Turns names like google.com into IP addresses.', 'low'],
  [80, 'HTTP', 'Websites without encryption. Anyone on the path can read it.', 'medium'],
  [443, 'HTTPS', 'Websites with TLS encryption. The padlock in your browser.', 'low'],
  [3306, 'MySQL', 'A database. Keep it private: only your app server should reach it.', 'high'],
  [3389, 'RDP', 'Windows Remote Desktop. Never open it to the whole internet.', 'high'],
  [5000, 'Flask', 'The default port for a Python Flask app (Episode 03).', 'medium'],
  [8080, 'HTTP-alt', 'A common port for test web servers.', 'medium']
];
const COLOR = { low: 'var(--ok)', medium: 'var(--warn)', high: 'var(--danger)' };

export default function PortBuilding() {
  const [open, setOpen] = useState(22);
  const p = PORTS.find(x => x[0] === open);
  return (
    <div>
      <div>
        <span className="d-label">Building 13.233.10.7 (one server) · tap a door</span>
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
          {p[2]} <span className="badge" style={{ color: COLOR[p[3]], marginLeft: 6 }}>open to the internet? {p[3] === 'low' ? 'usually fine' : p[3] === 'medium' ? 'only if needed' : 'no!'}</span>
        </div>
      </div>
    </div>
  );
}
