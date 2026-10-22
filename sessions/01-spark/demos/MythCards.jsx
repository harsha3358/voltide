import { useEffect, useState } from 'react';
import { award, badge } from '../../../src/lib/game.js';

const MYTHS = [
  ['☁️', 'The cloud is literally up in the sky.', 'It’s very much on the ground: huge buildings full of servers (data centres) in places like Mumbai, Hyderabad and Virginia, connected by fibre cables.'],
  ['🆓', 'The cloud is free.', 'Free tiers exist, but the cloud is pay-as-you-go. Forget to switch off a big server and the bill keeps ticking, like leaving the geyser on all month.'],
  ['📁', 'Cloud = Google Drive.', 'Drive is one cloud *app* (SaaS). The cloud also rents out whole virtual computers, databases, AI models and networks to build your own apps on.'],
  ['👩‍💻', 'You need to be a coding genius to use it.', 'You can launch your first server by clicking buttons in a web console. The coding comes later, and it’s the fun part.'],
  ['💥', 'The cloud never goes down.', 'It’s very reliable, but outages happen. Good cloud apps are spread across several data centres so one failure doesn’t take everything down.'],
  ['🐢', 'My laptop is basically as good.', 'Your laptop has a few CPU cores. One cloud account can borrow thousands of them for an hour, then give them back.']
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
