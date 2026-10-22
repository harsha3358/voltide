import { useEffect, useState } from 'react';
import { award, badge } from '../../../src/lib/game.js';

// Real situations, four choices. Which cloud model fits?
const CASES = [
  ['Your class writes notes together in Google Docs.', 'SaaS', 'A finished app in the browser: you just use it.'],
  ['You rent an Ubuntu server on AWS EC2 and install everything yourself.', 'IaaS', 'You get a bare virtual machine; the OS and apps are your job.'],
  ['You upload your Python web app and Google App Engine runs and scales it.', 'PaaS', 'You bring the code; the platform handles servers and scaling.'],
  ['The college keeps its exam database on servers in its own locked room.', 'On-prem', 'Owned and run in-house: no cloud provider involved.'],
  ['The fest team uses Zoom for meetings and Canva for posters.', 'SaaS', 'Both are ready-made apps you log into.'],
  ['A startup rents virtual machines and networks to run its own database.', 'IaaS', 'Renting raw infrastructure is IaaS.']
];
const OPTS = ['IaaS', 'PaaS', 'SaaS', 'On-prem'];

export default function ModelMatcher() {
  const [ans, setAns] = useState({});
  const score = Object.entries(ans).filter(([i, v]) => CASES[i][1] === v).length;
  useEffect(() => {
    if (score === CASES.length && award('demo:models', 100, 'Perfect model matcher')) badge('model-matcher');
  }, [score]);
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {CASES.map(([text, right, why], i) => {
        const a = ans[i];
        const state = a === undefined ? '' : a === right ? 'right' : 'wrong';
        return (
          <div key={i} className={`ethic ${state}`}>
            <div>
              <div style={{ fontSize: 15 }}>{text}</div>
              {a !== undefined && (
                <div className="d-note" style={{ marginTop: 6 }}>
                  <strong className={a === right ? 'd-good' : 'd-bad'}>{a === right ? `✅ ${right}. ` : `❌ It’s ${right}. `}</strong>
                  {why}
                </div>
              )}
            </div>
            <div className="seg">
              {OPTS.map(o => (
                <button key={o} type="button" aria-pressed={a === o} className={a === o ? (o === right ? 'is-safe' : 'is-danger') : ''} onClick={() => setAns({ ...ans, [i]: o })}>
                  {o}
                </button>
              ))}
            </div>
          </div>
        );
      })}
      <p className="d-note">Score: <strong>{score}</strong> / {CASES.length} {score === CASES.length && '🏆 Cloud architect energy.'}</p>
    </div>
  );
}
