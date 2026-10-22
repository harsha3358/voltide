import { useEffect, useMemo, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../../src/lib/motion.js';
import { award, badge } from '../../../src/lib/game.js';
import { Glyph } from '../../../src/components/Glyphs.jsx';

// Results day: traffic floods in. The college's own 3 servers melt; the cloud
// adds servers automatically, then removes them when the flood drains.
const PER_SERVER = 2000; // visitors one server can handle
const ONPREM = 3;
const RATE = 6; // example: ₹ per server per hour
const PRESETS = [
  ['Normal Tuesday', 1500],
  ['Fest registrations open', 9000],
  ['Results day, 10:00 AM', 34000]
];

export default function AutoScaleSim() {
  const [users, setUsers] = useState(1500);
  const [cloud, setCloud] = useState(true);
  const [peaked, setPeaked] = useState(false);
  const ref = useRef(null);
  const need = Math.max(1, Math.ceil(users / PER_SERVER));
  const servers = cloud ? need : ONPREM;
  const crashed = !cloud && need > ONPREM;
  const cost = servers * RATE;
  const grid = useMemo(() => Array.from({ length: 20 }, (_, i) => i), []);

  useGSAP(() => {
    gsap.to('.as-flow', { strokeDashoffset: -60, duration: Math.max(0.25, 2 - users / 20000), repeat: -1, ease: 'none', overwrite: true });
    gsap.fromTo('.as-on', { scale: 0.7 }, { scale: 1, duration: 0.4, ease: 'back.out(3)', transformOrigin: 'center', stagger: 0.02 });
    if (crashed) gsap.fromTo('.as-rack', { x: -3 }, { x: 3, duration: 0.06, repeat: 7, yoyo: true });
  }, { scope: ref, dependencies: [servers, crashed, users] });

  useEffect(() => {
    if (cloud && users >= 30000) setPeaked(true);
    if (peaked && cloud && users <= 2000 && award('demo:autoscale', 100, 'Scaled up AND down. Elastic king.')) badge('scale-master');
  }, [users, cloud, peaked]);

  return (
    <div ref={ref}>
      <div className="d-row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
        <div className="seg">
          <button type="button" className="is-danger" aria-pressed={!cloud} onClick={() => setCloud(false)}>College’s own 3 servers</button>
          <button type="button" className="is-safe" aria-pressed={cloud} onClick={() => setCloud(true)}>Cloud auto-scaling</button>
        </div>
        <div className="d-row">
          {PRESETS.map(([label, n]) => (
            <button key={label} type="button" className="btn btn--sm" onClick={() => setUsers(n)}>{label}</button>
          ))}
        </div>
      </div>
      <label className="d-label" htmlFor="as-users">Visitors on the results portal right now: {users.toLocaleString('en-IN')}</label>
      <input id="as-users" className="range" type="range" min="200" max="40000" step="100" value={users} onChange={e => setUsers(+e.target.value)} />
      <svg viewBox="0 0 900 230" style={{ marginTop: 10 }}>
        <path d="M30 115 H330" stroke="var(--line-strong)" strokeWidth={8 + users / 1500} strokeLinecap="round" opacity=".5" />
        <path className="as-flow" d="M30 115 H330" stroke={crashed ? 'var(--danger)' : 'var(--accent)'} strokeWidth="3" strokeDasharray="10 20" />
        <text x="30" y="80" fontFamily="Space Grotesk" fontSize="15" fill="var(--text-soft)">students refreshing ↻</text>
        <g className="as-rack">
          {grid.map(i => {
            const x = 380 + (i % 10) * 50;
            const y = 50 + Math.floor(i / 10) * 80;
            const on = i < servers;
            return (
              <g key={i} className={on ? 'as-on' : ''} opacity={on ? 1 : 0.18}>
                <rect x={x} y={y} width="40" height="60" rx="8" fill="#0b1820" stroke={crashed && on ? 'var(--danger)' : on ? 'var(--accent)' : 'var(--line-strong)'} strokeWidth="2" />
                <Glyph name="server" x={x + 8} y={y + 14} size={24} color={crashed && on ? 'var(--danger)' : on ? '#d7fbff' : 'var(--muted)'} />
              </g>
            );
          })}
        </g>
        {crashed && (
          <text x="630" y="225" textAnchor="middle" fontFamily="JetBrains Mono" fontWeight="700" fontSize="18" fill="var(--danger)">503 · SERVER OVERLOADED · LAGZILLA WINS</text>
        )}
      </svg>
      <div className="d-grid" style={{ marginTop: 4 }}>
        <div className="d-panel">
          <span className="d-label">Servers running</span>
          <div className="d-big" style={{ color: crashed ? 'var(--danger)' : 'var(--accent)' }}>{servers}{!cloud && ` / needs ${need}`}</div>
        </div>
        <div className="d-panel">
          <span className="d-label">Cost right now (example rate ₹{RATE}/server/hour)</span>
          <div className="d-big">₹{cost}/hr</div>
          <p className="d-note">{cloud ? 'You pay only for the servers that are on. Traffic drops, servers switch off, bill drops.' : 'You bought 3 servers upfront. They cost money even at 3 AM when nobody visits.'}</p>
        </div>
        <div className="d-panel">
          <span className="d-label">Status</span>
          <div className="d-big" style={{ fontSize: '1.4rem', color: crashed ? 'var(--danger)' : 'var(--ok)' }}>{crashed ? 'Site down. Panic.' : 'Site up. Chill.'}</div>
          <p className="d-note">Challenge: jump to results day in cloud mode, then drag traffic back down. Watch the servers scale <em>down</em> too.</p>
        </div>
      </div>
    </div>
  );
}
