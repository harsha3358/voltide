import { useEffect, useState } from 'react';
import { award, badge } from '../../../src/lib/game.js';

const CASES = [
  ['Scanning the Ubuntu VM you built yourself in VirtualBox, on a host-only network.', true, 'Your machine, your lab, no one else touched. This is exactly how you should practise.'],
  ['Trying a few passwords on a classmate’s Instagram “as a prank”.', false, 'Unauthorised access is a crime under the IT Act (Sec 43 and 66; identity theft under 66C), even as a joke, even if it fails.'],
  ['Poking at the college website for bugs because you are curious, without asking anyone.', false, 'Curiosity is not permission. Ask the IT department for written approval, or report what you noticed without testing it.'],
  ['Testing a company website through its official bug bounty programme, staying inside the published scope.', true, 'The programme is the written permission. Stay in scope, report privately, and never touch real users’ data.'],
  ['Forwarding a leaked list of students’ phone numbers to a WhatsApp group.', false, 'Spreading personal data harms people, and the DPDP Act 2023 and IT Act treat it seriously. Report it, do not share it.'],
  ['Practising web attacks on OWASP Juice Shop running on your own laptop.', true, 'Juice Shop is built to be hacked for learning. Running it locally keeps it legal and safe.']
];

export default function EthicsCheck() {
  const [ans, setAns] = useState({});
  const score = Object.entries(ans).filter(([i, v]) => CASES[i][1] === v).length;
  useEffect(() => {
    if (score === CASES.length && award('demo:ethics', 100, 'Perfect ethics score')) badge('ethics-ace');
  }, [score]);
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {CASES.map(([text, ok, why], i) => {
        const a = ans[i];
        const state = a === undefined ? '' : a === ok ? 'right' : 'wrong';
        return (
          <div key={i} className={`ethic ${state}`}>
            <div>
              <div style={{ fontSize: 15 }}>{text}</div>
              {a !== undefined && (
                <div className="d-note" style={{ marginTop: 6 }}>
                  <strong className={ok ? 'd-good' : 'd-bad'}>{ok ? '✅ Allowed. ' : '⛔ Not allowed. '}</strong>
                  {why}
                </div>
              )}
            </div>
            <div className="seg">
              <button type="button" className="is-safe" aria-pressed={a === true} onClick={() => setAns({ ...ans, [i]: true })}>
                Allowed
              </button>
              <button type="button" className="is-danger" aria-pressed={a === false} onClick={() => setAns({ ...ans, [i]: false })}>
                Not allowed
              </button>
            </div>
          </div>
        );
      })}
      <p className="d-note">
        Score: <strong>{score}</strong> / {CASES.length} {score === CASES.length && '🏆 You think like an ethical hacker.'}
      </p>
    </div>
  );
}
