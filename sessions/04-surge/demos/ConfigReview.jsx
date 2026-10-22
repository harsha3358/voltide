import { useEffect, useState } from 'react';
import { award } from '../../../src/lib/game.js';

// A teammate's deployment, line by line. Mark each setting safe or risky.
const ITEMS = [
  ['Inbound: SSH (22) from 0.0.0.0/0', false, 'Every bot on the internet can try to log in. Use My IP.'],
  ['Inbound: HTTP (80) from 0.0.0.0/0', true, 'Correct: a public website must be reachable by everyone.'],
  ['Inbound: All traffic, all ports, from 0.0.0.0/0', false, 'This switches the firewall off completely. Delete it.'],
  ['key.pem pasted in the team WhatsApp group', false, 'Anyone with the key owns the server. Never share it in chats.'],
  ['sudo apt update && sudo apt upgrade -y ran today', true, 'Good: security patches installed.'],
  ['ufw enabled with 22, 80 and 443 allowed', true, 'Good: a second firewall inside the VM.'],
  ['Root account used every day, no MFA', false, 'Use an IAM user and turn on MFA for root.'],
  ['Billing alert set at ₹100', true, 'Good: you’ll know before a surprise bill does.']
];

export default function ConfigReview() {
  const [marks, setMarks] = useState({});
  const right = ITEMS.filter(([, safe], i) => marks[i] === safe).length;
  const done = Object.keys(marks).length === ITEMS.length;
  useEffect(() => {
    if (right === ITEMS.length) award('demo:review', 100, 'Security review: perfect score');
  }, [right]);
  return (
    <div>
      <div style={{ display: 'grid', gap: 8 }}>
        {ITEMS.map(([t, safe, why], i) => {
          const m = marks[i];
          return (
            <div key={i} className={`ethic ${m === undefined ? '' : m === safe ? 'right' : 'wrong'}`}>
              <div>
                <div style={{ fontSize: 14.5, fontFamily: 'var(--font-mono)' }}>{t}</div>
                {m !== undefined && <div className="d-note" style={{ margin: '4px 0 0', fontSize: 13 }}>{m === safe ? '✓ ' : '✗ '}{why}</div>}
              </div>
              <div className="seg">
                <button type="button" className="is-safe" aria-pressed={m === true} onClick={() => setMarks({ ...marks, [i]: true })}>Safe</button>
                <button type="button" className="is-danger" aria-pressed={m === false} onClick={() => setMarks({ ...marks, [i]: false })}>Risky</button>
              </div>
            </div>
          );
        })}
      </div>
      <p className="d-note">{done ? `Score: ${right}/${ITEMS.length}. ${right === ITEMS.length ? 'Hire this person.' : 'Fix the red ones and you’re there.'}` : `${Object.keys(marks).length}/${ITEMS.length} reviewed`}</p>
    </div>
  );
}
