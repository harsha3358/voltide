import { useEffect, useState } from 'react';
import { award } from '../../../src/lib/game.js';

// Pick a situation; see the exact HTTP request your browser sends and the
// status code the server sends back.
const CASES = [
  ['Open the homepage', 'GET', '/', 200, 'OK', 'Here’s the page. Everything worked.', 'text/html', 'var(--ok)'],
  ['Typo in the URL', 'GET', '/resluts', 404, 'Not Found', 'That page doesn’t exist on this server.', 'text/html', 'var(--warn)'],
  ['Open results without logging in', 'GET', '/results', 401, 'Unauthorized', 'You need to log in first.', 'application/json', 'var(--warn)'],
  ['Results day, 10:00 AM', 'GET', '/results', 503, 'Service Unavailable', 'Server overloaded. LAGZILLA strikes. (Auto-scaling fixes this.)', 'text/html', 'var(--danger)'],
  ['Bug in the server code', 'POST', '/register', 500, 'Internal Server Error', 'The server crashed while handling your request. Check the logs.', 'text/html', 'var(--danger)'],
  ['Old link, page moved', 'GET', '/fest2025', 301, 'Moved Permanently', 'The page lives at a new address; the browser follows automatically.', 'text/html', 'var(--volt)']
];

export default function HttpInspector() {
  const [i, setI] = useState(0);
  const [seen, setSeen] = useState(() => new Set([0]));
  const [secure, setSecure] = useState(true);
  const [label, method, path, code, reason, meaning, type, color] = CASES[i];
  useEffect(() => {
    if (seen.size === CASES.length) award('demo:http', 60, 'Every status code decoded');
  }, [seen]);
  const pick = k => {
    setI(k);
    setSeen(new Set(seen).add(k));
  };
  return (
    <div>
      <div className="d-row" style={{ marginBottom: 12 }}>
        {CASES.map(([l], k) => (
          <button key={l} type="button" className={`btn btn--sm ${i === k ? 'btn--primary' : ''}`} onClick={() => pick(k)}>{l}</button>
        ))}
      </div>
      <div className="d-row" style={{ marginBottom: 12 }}>
        <div className="seg">
          <button type="button" aria-pressed={!secure} className="is-danger" onClick={() => setSecure(false)}>http://</button>
          <button type="button" aria-pressed={secure} className="is-safe" onClick={() => setSecure(true)}>https:// 🔒</button>
        </div>
        <span className="d-note" style={{ margin: 0 }}>
          {secure ? 'HTTPS: the same request, but encrypted with TLS, so nobody in between can read or change it.' : 'HTTP: sent as readable text. Fine for learning, never for logins.'}
        </span>
      </div>
      <div className="d-grid">
        <div className="d-panel">
          <span className="d-label">Request (browser → server)</span>
          <pre className="code-view">{`${method} ${path} HTTP/1.1
Host: portal.college.example
User-Agent: Chrome/131
Accept: text/html`}{secure ? '\n\n(🔒 wrapped in TLS on port 443)' : '\n\n(plain text on port 80)'}</pre>
        </div>
        <div className="d-panel" style={{ borderColor: color }}>
          <span className="d-label">Response (server → browser)</span>
          <pre className="code-view">{`HTTP/1.1 ${code} ${reason}
Content-Type: ${type}
Server: nginx`}</pre>
          <p className="d-big" style={{ fontSize: '1.6rem', color, margin: '10px 0 4px' }}>{code} · {reason}</p>
          <p className="d-note" style={{ margin: 0 }}>{meaning}</p>
        </div>
      </div>
      <p className="d-note">Cheat code: <strong>2xx</strong> = success · <strong>3xx</strong> = go elsewhere · <strong>4xx</strong> = your mistake · <strong>5xx</strong> = server’s mistake. Decoded {seen.size}/{CASES.length}.</p>
    </div>
  );
}
