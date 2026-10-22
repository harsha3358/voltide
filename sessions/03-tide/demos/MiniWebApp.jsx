import { useEffect, useState } from 'react';
import { award } from '../../../src/lib/game.js';

// A tiny Flask app and a pretend browser. Type a URL; the matching route lights
// up in the code and the response appears. This is how every web app works.
const RESULTS = { '101': 'A+', '102': 'A', '103': 'B+' };
const ROUTES = [
  ['/', 'home', () => ['200 OK', '<h1>Welcome to the campus fest!</h1>']],
  ['/about', 'about', () => ['200 OK', '<p>Made by Team Voltide, running on a cloud VM.</p>']],
  ['/results', 'results', q => {
    const roll = q.get('roll');
    if (!roll) return ['400 Bad Request', '{"error": "add ?roll=101"}'];
    return RESULTS[roll] ? ['200 OK', `{"roll": "${roll}", "grade": "${RESULTS[roll]}"}`] : ['404 Not Found', `{"error": "roll ${roll} not found"}`];
  }]
];
const CODE = `from flask import Flask, request

app = Flask(__name__)
RESULTS = {"101": "A+", "102": "A", "103": "B+"}

@app.route("/")                      # home
def home():
    return "<h1>Welcome to the campus fest!</h1>"

@app.route("/about")                 # about
def about():
    return "<p>Made by Team Voltide, running on a cloud VM.</p>"

@app.route("/results")               # results
def results():
    roll = request.args.get("roll")
    if roll in RESULTS:
        return {"roll": roll, "grade": RESULTS[roll]}
    return {"error": "not found"}, 404

app.run(host="0.0.0.0", port=5000)`;

export default function MiniWebApp() {
  const [url, setUrl] = useState('/results?roll=101');
  const [visited, setVisited] = useState(() => new Set());
  const u = new URL(url.startsWith('/') ? url : `/${url}`, 'http://13.233.10.7:5000');
  const route = ROUTES.find(r => r[0] === u.pathname);
  const [status, body] = route ? route[2](u.searchParams) : ['404 Not Found', '<h1>Not Found</h1>'];
  useEffect(() => {
    setVisited(v => new Set(v).add(route ? route[1] : '404'));
  }, [url]);
  useEffect(() => {
    if (visited.size >= 4) award('demo:webapp', 80, 'Explored every route (and a 404)');
  }, [visited]);
  return (
    <div className="split-2-1" style={{ gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)' }}>
      <pre className="code-view" style={{ fontSize: 12.5, maxHeight: 420, overflow: 'auto' }}>
        {CODE.split('\n').map((l, i) => {
          const hit = route && l.includes(`# ${route[1]}`);
          return <div key={i} style={hit ? { background: 'rgba(83,234,253,.15)', color: '#fff', borderRadius: 4 } : undefined}>{l || ' '}</div>;
        })}
      </pre>
      <div className="d-panel" style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
        <span className="d-label">Browser</span>
        <div className="d-row" style={{ gap: 6 }}>
          <span className="d-mono" style={{ color: 'var(--muted)' }}>http://13.233.10.7:5000</span>
          <input className="input" style={{ flex: '1 1 160px', minHeight: 40 }} value={url} onChange={e => setUrl(e.target.value)} aria-label="URL path" spellCheck="false" />
        </div>
        <div className="d-row">
          {['/', '/about', '/results?roll=102', '/results?roll=999', '/admin'].map(p => <button key={p} type="button" className="btn btn--sm btn--ghost" onClick={() => setUrl(p)}><code>{p}</code></button>)}
        </div>
        <span className="badge" style={{ color: status.startsWith('200') ? 'var(--ok)' : 'var(--warn)', justifySelf: 'start' }}>{status}</span>
        <pre className="code-view">{body}</pre>
        <p className="d-note" style={{ margin: 0 }}>The highlighted lines on the left are the code that answered. Port 5000 must be allowed in the security group.</p>
      </div>
    </div>
  );
}
