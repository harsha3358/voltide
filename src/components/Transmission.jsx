import { useEffect } from 'react';
import { award, badge } from '../lib/game.js';
import DecryptedText from '../vendor/reactbits/DecryptedText/DecryptedText.jsx';
import Volty from './Volty.jsx';

// A hidden message split into one fragment per topic. Finishing a topic
// decrypts its fragment; the full line only appears when the session is done.
const split = (phrase, n) => {
  const out = [];
  const size = phrase.length / n;
  for (let i = 0; i < n; i++) out.push(phrase.slice(Math.round(i * size), Math.round((i + 1) * size)));
  return out;
};

export default function Transmission({ session, phrase, topics, isDone }) {
  const chunks = split(phrase, topics.length);
  const open = topics.map(t => isDone(session.number, t.id));
  const count = open.filter(Boolean).length;
  const complete = count === topics.length;
  useEffect(() => {
    if (!complete) return;
    award(`decoder:${session.number}`, 250, 'Transmission decrypted');
    badge(`decoder-${session.number}`);
  }, [complete, session.number]);
  return (
    <section className={`transmission ${complete ? 'is-complete' : ''}`} aria-label="Secret transmission">
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <Volty size={54} mood={complete ? 'happy' : 'smug'} />
        <div>
          <span className="kicker">Encrypted transmission · {count}/{topics.length} fragments</span>
          <p style={{ margin: '6px 0 0', color: 'var(--text-soft)', fontSize: 15 }}>
            {complete
              ? 'Decrypted. Screenshot it, it’s yours.'
              : 'NULLSURGE hid a message in this session. Every topic you finish cracks one fragment.'}
          </p>
        </div>
      </div>
      <div className="transmission__msg">
        {chunks.map((c, i) => (
          <span key={i} className={`transmission__chunk ${open[i] ? 'is-open' : ''}`} title={open[i] ? undefined : `Finish topic ${i + 1} to decrypt`}>
            {open[i] ? <DecryptedText text={c} animateOn="view" speed={40} maxIterations={14} /> : c.replace(/\S/g, '▓')}
          </span>
        ))}
      </div>
    </section>
  );
}
