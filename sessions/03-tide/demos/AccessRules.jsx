import { useEffect, useState } from 'react';
import { award, badge } from '../../../src/lib/game.js';

// IAM in one grid: give each person exactly what their job needs, nothing more.
const PERMS = [
  ['s3read', 'Read files in S3'],
  ['s3write', 'Upload files to S3'],
  ['ec2start', 'Start / stop EC2'],
  ['ec2launch', 'Launch new EC2'],
  ['billing', 'See billing'],
  ['admin', 'Delete anything (admin)']
];
const PEOPLE = [
  ['Intern', 'Only needs to view the fest photos in S3.', ['s3read']],
  ['Developer', 'Uploads the website files and restarts the test server.', ['s3read', 's3write', 'ec2start']],
  ['Faculty coordinator', 'Approves budgets and checks spending.', ['billing']]
];

export default function AccessRules() {
  const [grid, setGrid] = useState(() => PEOPLE.map(() => new Set(['admin'])));
  const toggle = (p, k) => setGrid(g => g.map((s, i) => { if (i !== p) return s; const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n; }));
  const ok = PEOPLE.map(([, , need], i) => need.length === grid[i].size && need.every(n => grid[i].has(n)));
  const all = ok.every(Boolean);
  useEffect(() => {
    if (all && award('demo:iam', 120, 'Least privilege achieved')) badge('least-privilege');
  }, [all]);
  return (
    <div className="scroll-x">
      <table className="table-sim" style={{ fontFamily: 'var(--font-body)', minWidth: 640 }}>
        <thead>
          <tr>
            <th>Person (IAM user)</th>
            {PERMS.map(([k, l]) => <th key={k} style={{ textAlign: 'center' }}>{l}</th>)}
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {PEOPLE.map(([name, job], p) => (
            <tr key={name} className={ok[p] ? 'ok' : ''}>
              <td><strong style={{ color: 'var(--text)' }}>{name}</strong><br /><span className="d-note" style={{ margin: 0, fontSize: 12.5 }}>{job}</span></td>
              {PERMS.map(([k]) => (
                <td key={k} style={{ textAlign: 'center' }}>
                  <input type="checkbox" checked={grid[p].has(k)} onChange={() => toggle(p, k)} aria-label={`${name}: ${k}`} style={{ width: 18, height: 18, accentColor: 'var(--accent)' }} />
                </td>
              ))}
              <td>{ok[p] ? <span className="d-good">✓ just right</span> : grid[p].has('admin') ? <span className="d-bad">way too powerful</span> : <span className="d-warn">not quite</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="d-note">Everyone starts as admin (a classic mistake). Untick and tick until each person has <strong>exactly</strong> what their job needs. That principle is called <strong>least privilege</strong>.</p>
    </div>
  );
}
