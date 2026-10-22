import { useEffect, useMemo, useState } from 'react';
import { award, badge } from '../../../src/lib/game.js';

// An AWS-style security group: inbound rules on the left, incoming traffic on
// the right. Anything not explicitly allowed is blocked. Mission: allow the
// website for everyone and SSH only for you.
const MY_IP = '49.36.12.88';
const TRAFFIC = [
  ['Student’s phone opens the site', 'Anywhere', 80, true],
  ['Visitor opens the HTTPS site', 'Anywhere', 443, true],
  ['You SSH in from your laptop', MY_IP, 22, true],
  ['Random bot tries SSH', '185.220.1.9', 22, false],
  ['Someone pokes the database port', '103.45.2.1', 3306, false],
  ['Scanner tries Remote Desktop', '45.9.20.1', 3389, false]
];
const PORTS = [22, 80, 443, 3306, 3389];
const SOURCES = ['Anywhere (0.0.0.0/0)', `My IP (${MY_IP}/32)`];

function allowed(rules, src, port) {
  return rules.some(r => r.port === port && (r.src.startsWith('Anywhere') || (r.src.startsWith('My IP') && src === MY_IP)));
}

export default function SecurityGroupSim() {
  const [rules, setRules] = useState([{ port: 80, src: SOURCES[0] }]);
  const results = useMemo(() => TRAFFIC.map(([label, src, port, should]) => ({ label, src, port, should, ok: allowed(rules, src, port) })), [rules]);
  const perfect = results.every(r => r.ok === r.should);
  const add = () => setRules([...rules, { port: 22, src: SOURCES[1] }]);
  const update = (i, k, v) => setRules(rules.map((r, j) => (j === i ? { ...r, [k]: v } : r)));
  const remove = i => setRules(rules.filter((_, j) => j !== i));
  useEffect(() => {
    if (perfect && award('demo:sg', 120, 'Perfect security group')) badge('gatekeeper');
  }, [perfect]);
  return (
    <div className="split-1-2" style={{ gridTemplateColumns: 'minmax(260px, 1fr) minmax(0, 1.3fr)' }}>
      <div className="d-panel">
        <span className="d-label">Inbound rules · sg-fest-website</span>
        <div style={{ display: 'grid', gap: 8 }}>
          {rules.map((r, i) => (
            <div key={i} className="d-row" style={{ gap: 6 }}>
              <select className="input" style={{ flex: '0 0 92px', minHeight: 38 }} value={r.port} onChange={e => update(i, 'port', +e.target.value)} aria-label={`Rule ${i + 1} port`}>
                {PORTS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <select className="input" style={{ flex: '1 1 150px', minHeight: 38, fontSize: 12.5 }} value={r.src} onChange={e => update(i, 'src', e.target.value)} aria-label={`Rule ${i + 1} source`}>
                {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button type="button" className="btn btn--sm btn--ghost" onClick={() => remove(i)} aria-label={`Remove rule ${i + 1}`}>✕</button>
            </div>
          ))}
        </div>
        <button type="button" className="btn btn--sm" style={{ marginTop: 10 }} onClick={add}>+ Add rule</button>
        <p className="d-note">Everything not listed is <strong>blocked</strong> by default. Mission: let everyone see the website (HTTP + HTTPS) and allow SSH <em>only from your IP</em>.</p>
      </div>
      <div className="d-panel">
        <span className="d-label">Incoming traffic · {perfect ? '🏆 perfect config' : `${results.filter(r => r.ok === r.should).length}/${results.length} correct`}</span>
        <div style={{ display: 'grid', gap: 8 }}>
          {results.map(r => (
            <div key={r.label} className={`ethic ${r.ok === r.should ? 'right' : 'wrong'}`} style={{ gridTemplateColumns: '1fr auto' }}>
              <div>
                <div style={{ fontSize: 14.5 }}>{r.label}</div>
                <div className="d-note" style={{ margin: 0, fontSize: 12.5 }}>from {r.src} → port {r.port}</div>
              </div>
              <span className="badge" style={{ color: r.ok ? 'var(--ok)' : 'var(--danger)' }}>{r.ok ? 'ALLOWED' : 'BLOCKED'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
