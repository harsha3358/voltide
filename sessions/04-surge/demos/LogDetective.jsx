import { useEffect, useState } from 'react';
import { award, badge } from '../../../src/lib/game.js';

// Three real-looking incidents. Click the log line that explains each one.
const CASES = [
  {
    title: 'Case 1: “The page shows 404 Not Found”',
    cmd: 'sudo tail /var/log/nginx/access.log',
    lines: [
      '49.36.12.88 - - [22/Oct/2026:10:02:11 +0530] "GET / HTTP/1.1" 200 1432 "-" "Mozilla/5.0"',
      '49.36.12.88 - - [22/Oct/2026:10:02:12 +0530] "GET /favicon.ico HTTP/1.1" 404 162 "-" "Mozilla/5.0"',
      '106.51.8.20 - - [22/Oct/2026:10:03:40 +0530] "GET /Index.html HTTP/1.1" 404 162 "-" "Mozilla/5.0 (Android)"',
      '106.51.8.20 - - [22/Oct/2026:10:03:41 +0530] "GET /favicon.ico HTTP/1.1" 404 162 "-" "Mozilla/5.0 (Android)"'
    ],
    answer: 2,
    explain: 'The phone asked for **/Index.html** with a capital I. Linux file names are case-sensitive, so the file is index.html. (The favicon 404s are harmless.)'
  },
  {
    title: 'Case 2: “nginx won’t start after I edited the config”',
    cmd: 'sudo journalctl -u nginx --since "10 min ago"',
    lines: [
      'Oct 22 10:10:01 ip-172-31-20-4 systemd[1]: Starting nginx.service - A high performance web server...',
      'Oct 22 10:10:01 ip-172-31-20-4 nginx[2210]: nginx: [emerg] unexpected "}" in /etc/nginx/sites-enabled/default:24',
      'Oct 22 10:10:01 ip-172-31-20-4 systemd[1]: nginx.service: Control process exited, code=exited, status=1/FAILURE',
      'Oct 22 10:10:01 ip-172-31-20-4 systemd[1]: Failed to start nginx.service - A high performance web server.'
    ],
    answer: 1,
    explain: 'The **[emerg]** line names the exact file and line: a stray `}` on line 24. Fix it, then run `sudo nginx -t` before restarting.'
  },
  {
    title: 'Case 3: “The site shows 403 Forbidden”',
    cmd: 'sudo tail /var/log/nginx/error.log',
    lines: [
      '2026/10/22 10:20:05 [notice] 2301#2301: signal process started',
      '2026/10/22 10:21:17 [error] 2302#2302: *4 open() "/var/www/html/index.html" failed (13: Permission denied), client: 106.51.8.20',
      '2026/10/22 10:21:17 [info] 2302#2302: *4 client closed keepalive connection',
      '2026/10/22 10:22:40 [notice] 2301#2301: worker process 2302 exited'
    ],
    answer: 1,
    explain: 'nginx can’t read the file: **Permission denied**. Fix with `sudo chmod 644 /var/www/html/index.html`.'
  }
];

export default function LogDetective() {
  const [c, setC] = useState(0);
  const [pick, setPick] = useState(null);
  const [solved, setSolved] = useState(() => new Set());
  const cur = CASES[c];
  useEffect(() => {
    if (solved.size === CASES.length && award('demo:logs', 120, 'Solved all three log cases')) badge('log-detective');
  }, [solved]);
  const choose = i => {
    setPick(i);
    if (i === cur.answer) setSolved(new Set(solved).add(c));
  };
  const md = s => s.split(/(\*\*[^*]+\*\*|`[^`]+`)/).map((p, i) => (p.startsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : p.startsWith('`') ? <code key={i}>{p.slice(1, -1)}</code> : p));
  return (
    <div>
      <div className="seg" style={{ marginBottom: 12 }}>
        {CASES.map((k, i) => (
          <button key={i} type="button" aria-pressed={c === i} onClick={() => { setC(i); setPick(null); }}>{solved.has(i) ? '✓ ' : ''}Case {i + 1}</button>
        ))}
      </div>
      <p style={{ margin: '0 0 8px', fontWeight: 600 }}>{cur.title}</p>
      <div className="term-sim">
        <div className="term-sim__screen" style={{ maxHeight: 'none' }}>
          <div><span style={{ color: 'var(--ok)' }}>ubuntu@ip-172-31-20-4:~$</span> {cur.cmd}</div>
          {cur.lines.map((l, i) => (
            <button key={i} type="button" onClick={() => choose(i)} style={{ display: 'block', width: '100%', textAlign: 'left', font: 'inherit', color: pick === i ? (i === cur.answer ? 'var(--ok)' : 'var(--danger)') : 'inherit', background: pick === i ? 'rgba(255,255,255,.06)' : 'transparent', border: 0, padding: '3px 4px', borderRadius: 6, cursor: 'pointer', wordBreak: 'break-all' }}>
              {l}
            </button>
          ))}
        </div>
      </div>
      <p className="d-note">{pick === null ? 'Click the line that explains the problem.' : pick === cur.answer ? <>✓ {md(cur.explain)}</> : 'Not that one. Look for words like error, emerg, denied, or an odd path.'}</p>
      <p className="d-note" style={{ marginTop: 4 }}>Solved {solved.size}/{CASES.length}</p>
    </div>
  );
}
