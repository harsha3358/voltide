import { useEffect, useState } from 'react';
import { award, badge } from '../../../src/lib/game.js';

// Form a squad: a name and one person per role. Saved locally so the team
// card survives a refresh.
const ROLES = [
  ['Builder', 'Writes and edits the webpage.'],
  ['Deployer', 'Launches the server and copies the files.'],
  ['Tester', 'Opens it on phones, finds what’s broken.'],
  ['Presenter', 'Runs the 3-minute live demo.']
];
const KEY = 'voltide:team';
const load = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || null;
  } catch {
    return null;
  }
};

export default function TeamBuilder() {
  const [team, setTeam] = useState(() => load() || { name: '', people: ['', '', '', ''] });
  const ready = team.name.trim() && team.people.every(p => p.trim());
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(team));
    } catch {}
  }, [team]);
  useEffect(() => {
    if (ready && award('demo:team', 60, 'Squad formed')) badge('squad-up');
  }, [ready]);
  const setPerson = (i, v) => setTeam({ ...team, people: team.people.map((p, j) => (j === i ? v : p)) });
  return (
    <div className="split-2-1">
      <div className="d-panel">
        <label className="d-label" htmlFor="team-name">Team name</label>
        <input id="team-name" className="input" style={{ width: '100%' }} value={team.name} maxLength={28} onChange={e => setTeam({ ...team, name: e.target.value })} placeholder="Team Nimbus" />
        <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
          {ROLES.map(([r, job], i) => (
            <div key={r}>
              <label className="d-label" htmlFor={`role-${i}`} style={{ marginBottom: 4 }}>{r} · <span style={{ textTransform: 'none', letterSpacing: 0 }}>{job}</span></label>
              <input id={`role-${i}`} className="input" style={{ width: '100%' }} value={team.people[i]} maxLength={24} onChange={e => setPerson(i, e.target.value)} placeholder="Name" />
            </div>
          ))}
        </div>
        <p className="d-note">Fewer than four people? One person can hold two roles. Just type their name twice.</p>
      </div>
      <div className="d-panel" style={{ borderColor: ready ? 'var(--ok)' : 'var(--line)', alignSelf: 'start' }}>
        <span className="d-label">Team card</span>
        <div className="d-big" style={{ fontSize: 26, marginBottom: 10 }}>{team.name || 'Your team'}</div>
        <ul className="missions">
          {ROLES.map(([r], i) => (
            <li key={r} className={team.people[i].trim() ? 'done' : ''}><span>{team.people[i].trim() ? '✔' : '•'}</span><span>{r}: {team.people[i] || '…'}</span></li>
          ))}
        </ul>
        <p className="d-note">{ready ? 'Squad locked in. Screenshot this card for your facilitator.' : 'Fill every role to lock in your squad.'}</p>
      </div>
    </div>
  );
}
