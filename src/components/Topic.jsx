import { forwardRef } from 'react';
import { href } from '../lib/router.js';
import { Checkpoint, Demo, Helpers, Lab, Md, Photo, Visual } from './Blocks.jsx';
import { Arrow, Check } from './Icons.jsx';
import Volty from './Volty.jsx';
import { award } from '../lib/game.js';
import { CopyLink } from './Extras.jsx';

// Renders one topic object from a session's content.jsx. Every field is optional
// except id and title, so a topic can be as light or as rich as it needs.
const Topic = forwardRef(function Topic({ session, topic, index, done, onToggleDone }, ref) {
  const demos = topic.demos || (topic.demo ? [topic.demo] : []);
  const visuals = topic.visuals || (topic.visual ? [topic.visual] : []);
  return (
    <article ref={ref} className="topic" id={`topic-${topic.id}`} data-topic={topic.id}>
      <header className="topic__head">
        {topic.hook && (
          <div className="hook" data-reveal>
            <Volty size={52} mood={done ? 'happy' : 'idle'} />
            <p className="hook__bubble">
              {topic.hook}
            </p>
          </div>
        )}
        <span className="kicker" data-reveal>
          {String(index + 1).padStart(2, '0')} · {topic.kicker}
        </span>
        <h2 className="topic__title" data-reveal>
          <a href={href.topic(session.number, topic.id)}>{topic.title}</a>
        </h2>
        {topic.lead && <Md as="p" className="topic__lead" data-reveal>{topic.lead}</Md>}
      </header>

      <Helpers plain={topic.plain} analogy={topic.analogy} jargon={topic.jargon} />

      <div className="topic__body">
        {topic.body?.map((p, i) => (
          <Md key={i} as="p" data-reveal>{p}</Md>
        ))}
        {topic.points && (
          <ul className="points" data-reveal>
            {topic.points.map((p, i) => (
              <Md key={i} as="li">{p}</Md>
            ))}
          </ul>
        )}
      </div>

      {visuals.map((v, i) => (
        <Visual key={i} caption={v.caption} note={v.note}>
          {v.el}
        </Visual>
      ))}

      {topic.photos?.map(p => (
        <Photo key={p.file} {...p} />
      ))}

      {demos.map(d => (
        <Demo key={d.id} id={d.id} title={d.title} hint={d.hint} intro={d.intro}>
          {d.el}
        </Demo>
      ))}

      {topic.after?.map((p, i) => (
        <Md key={i} as="p" className="topic__body" style={{ color: 'var(--text-soft)' }} data-reveal>{p}</Md>
      ))}

      {topic.lab && <Lab lab={topic.lab} />}
      {topic.check && <Checkpoint check={topic.check} awardId={`quiz:${session.number}:${topic.id}`} />}

      <footer className="topic__foot" data-reveal>
        <button type="button" className="btn btn--sm done-btn" aria-pressed={done} onClick={() => {
            if (!done) award(`done:${session.number}:${topic.id}`, 30, 'Mission complete · fragment decrypted');
            onToggleDone();
          }}>
          <Check /> {done ? 'Mission complete. Look at you go.' : 'Mark mission complete (+30 XP)'}
        </button>
        <CopyLink hash={href.topic(session.number, topic.id)} />
        {topic.links?.length > 0 && (
          <div className="topic__links">
            {topic.links.map(l =>
              /^https?:/.test(l.href) ? (
                <a key={l.href} className="btn btn--sm btn--ghost" href={l.href} target="_blank" rel="noopener noreferrer">
                  {l.label} <span aria-hidden="true">↗</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                <a key={l.href} className="btn btn--sm btn--ghost" href={l.href}>
                  {l.label} <Arrow />
                </a>
              )
            )}
          </div>
        )}
      </footer>
    </article>
  );
});

export default Topic;
