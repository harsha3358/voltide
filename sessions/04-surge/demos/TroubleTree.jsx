import { useState } from 'react';
import { award, badge } from '../../../src/lib/game.js';

// "It works on my laptop but not on my friend's phone." Walk the checks in
// order, like a real engineer, until you find the cause.
const TREE = {
  start: ['Your friend says the site won’t open on their phone. First check: does it open on YOUR laptop at http://IP?', [['Yes, it opens', 'phone'], ['No, not even on my laptop', 'nginx']]],
  nginx: ['On the server, run `sudo systemctl status nginx`. What does it say?', [['active (running)', 'port80'], ['inactive (dead) or failed', 'fix-nginx']]],
  port80: ['nginx runs but even you can’t open it. Check the security group inbound rules. Is HTTP (80) allowed?', [['No, only SSH (22) is there', 'fix-sg'], ['Yes, 80 from 0.0.0.0/0', 'fix-file']]],
  phone: ['It works for you. What exactly did your friend type?', [['https://13.233.10.7', 'fix-https'], ['http://13.233.10.7', 'myip']]],
  myip: ['They typed http:// correctly. Look at the HTTP rule’s Source in the security group:', [['My IP (/32)', 'fix-myip'], ['Anywhere (0.0.0.0/0)', 'fix-ip']]],
  'fix-nginx': ['🔧 nginx is not running. Start it and make it start on boot: `sudo systemctl enable --now nginx`, then check `sudo nginx -t` for config errors.'],
  'fix-sg': ['🔧 The firewall is blocking the web. Add an inbound rule: **HTTP, port 80, source 0.0.0.0/0**.'],
  'fix-file': ['🔧 If you see the nginx welcome page, your file isn’t in place. Copy it to `/var/www/html/index.html`. If you get no reply at all, check `sudo ufw status`: allow port 80.'],
  'fix-https': ['🔧 Your server only speaks HTTP (no certificate yet). Their phone tried **https://**. Ask them to type **http://** explicitly. Real fix later: a domain + free HTTPS certificate.'],
  'fix-myip': ['🔧 Found it! HTTP is allowed only from YOUR IP, so it works for you and nobody else. Change the source of the port 80 rule to **Anywhere (0.0.0.0/0)**. (Keep SSH on My IP!)'],
  'fix-ip': ['🔧 Double-check the IP. If you stopped and started the instance, its **public IP changed**. Copy the new one from the console (or use an Elastic IP).']
};

export default function TroubleTree() {
  const [path, setPath] = useState(['start']);
  const [found, setFound] = useState(() => new Set());
  const node = path[path.length - 1];
  const [text, options] = TREE[node];
  const go = next => {
    setPath([...path, next]);
    if (next.startsWith('fix-')) {
      const n = new Set(found).add(next);
      setFound(n);
      if (n.has('fix-myip') && award('demo:trouble', 100, 'Solved the phone mystery')) badge('fixer');
    }
  };
  const md = s => s.split(/(\*\*[^*]+\*\*|`[^`]+`)/).map((p, i) => (p.startsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : p.startsWith('`') ? <code key={i}>{p.slice(1, -1)}</code> : p));
  return (
    <div className="split-2-1">
      <div className="d-panel" style={{ borderColor: options ? 'var(--line)' : 'var(--ok)' }}>
        <span className="d-label">Step {path.length}</span>
        <p style={{ fontSize: 16.5, margin: '0 0 14px' }}>{md(text)}</p>
        <div className="d-row">
          {options ? (
            options.map(([label, next]) => <button key={label} type="button" className="btn btn--sm" onClick={() => go(next)}>{label}</button>)
          ) : (
            <button type="button" className="btn btn--sm btn--primary" onClick={() => setPath(['start'])}>↺ Try another branch</button>
          )}
          {path.length > 1 && options && <button type="button" className="btn btn--sm btn--ghost" onClick={() => setPath(path.slice(0, -1))}>← Back</button>}
        </div>
      </div>
      <div className="d-panel">
        <span className="d-label">Causes found · {found.size}/6</span>
        <p className="d-note" style={{ marginTop: 0 }}>The most common one in class is the sneaky “works only for me” rule. Find it for the badge.</p>
        <ul className="missions">
          {[['fix-myip', 'HTTP allowed only from My IP'], ['fix-https', 'Phone tried https://'], ['fix-sg', 'Port 80 not open'], ['fix-nginx', 'nginx not running'], ['fix-file', 'File in the wrong place'], ['fix-ip', 'Public IP changed']].map(([k, l]) => (
            <li key={k} className={found.has(k) ? 'done' : ''}><span>{found.has(k) ? '✔' : '•'}</span><span>{l}</span></li>
          ))}
        </ul>
      </div>
    </div>
  );
}
