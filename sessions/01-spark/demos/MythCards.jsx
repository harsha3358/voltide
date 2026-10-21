import { useEffect, useState } from 'react';
import { award, badge } from '../../../src/lib/game.js';

const MYTHS = [
  ['🕶️', 'Hackers are hoodie geniuses typing at lightning speed.', 'Most real attacks are boring: a guessed password, a fake email, a phone that skipped updates. Simple tricks, repeated millions of times.'],
  ['🤷', 'I am not important. Nobody will hack me.', 'Bots attack everyone automatically. Your account, phone or Wi-Fi is useful as a stepping stone to your friends, family and college.'],
  ['🛡️', 'Antivirus means I am 100% safe.', 'No single tool stops everything. Security works in layers: updates, strong passwords, MFA, backups and your own judgement.'],
  ['🚫', 'All hacking is illegal.', 'Ethical hackers break into systems with written permission to find weaknesses first. It is a real, well-paid career.'],
  ['🕵️', 'Incognito mode makes me invisible.', 'It only skips saving history on your own device. Your college network, ISP and the websites you visit can still see you.'],
  ['🍎', 'Phones and Macs cannot get viruses.', 'Every system has bugs. Fake apps, malicious links and unpatched software affect Android, iOS, macOS and Windows alike.']
];

export default function MythCards() {
  const [flipped, setFlipped] = useState(() => new Set());
  useEffect(() => {
    if (flipped.size === MYTHS.length && award('demo:myths', 80, 'Every myth busted')) badge('myth-buster');
  }, [flipped]);
  const toggle = i =>
    setFlipped(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  return (
    <>
      <div className="d-grid">
        {MYTHS.map(([emoji, myth, truth], i) => (
          <button key={i} type="button" className={`flipcard ${flipped.has(i) ? 'is-flipped' : ''}`} onClick={() => toggle(i)} aria-pressed={flipped.has(i)}>
            <div className="flipcard__inner">
              <div className="flipcard__face">
                <span className="flipcard__emoji">{emoji}</span>
                <span className="badge d-bad" style={{ alignSelf: 'flex-start' }}>MYTH</span>
                <h4>{myth}</h4>
                <span className="flipcard__hint">TAP TO REVEAL THE TRUTH ↻</span>
              </div>
              <div className="flipcard__face flipcard__face--back">
                <span className="badge d-good" style={{ alignSelf: 'flex-start' }}>REALITY</span>
                <p style={{ fontSize: 15, color: 'var(--text)' }}>{truth}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      <p className="d-note">
        Busted {flipped.size} of {MYTHS.length} myths.
      </p>
    </>
  );
}
