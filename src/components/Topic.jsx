import { forwardRef, useEffect, useRef, useState } from 'react';
import { href } from '../lib/router.js';
import { Checkpoint, Demo, Helpers, Lab, Md, Photo, Visual } from './Blocks.jsx';
import { Arrow, Check } from './Icons.jsx';
import Volty from './Volty.jsx';
import { award } from '../lib/game.js';
import { CopyLink } from './Extras.jsx';
import { scrollToElement } from '../lib/motion.js';
import { missionTheme } from '../lib/missionThemes.js';

// Learn → Try → Lab → Check: a small strip that ticks as you scroll past each
// part of the mission, and jumps to a part when tapped.
function StepStrip({ root, topic }) {
  const steps = [['learn', 'Learn', '.topic__head']];
  if (topic.visual || topic.visuals || topic.demo || topic.demos) steps.push(['try', 'Try it', '.visual, .demo']);
  if (topic.lab) steps.push(['lab', 'Lab', '.lab']);
  if (topic.check) steps.push(['check', 'Check', '.check']);
  const [reached, setReached] = useState(() => new Set());
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      entries =>
        entries.forEach(e => {
          if (e.isIntersecting || e.boundingClientRect.top < 0) setReached(r => (r.has(e.target.dataset.step) ? r : new Set(r).add(e.target.dataset.step)));
        }),
      { rootMargin: '0px 0px -45% 0px' }
    );
    steps.forEach(([k, , sel]) => {
      const t = el.querySelector(sel);
      if (t) {
        t.dataset.step = k;
        io.observe(t);
      }
    });
    return () => io.disconnect();
  }, [topic.id]);
  // Reaching a part also counts every part above it (you may have jumped past them).
  const top = steps.reduce((m, [k], i) => (reached.has(k) ? i : m), -1);
  const current = steps[top]?.[0];
  return (
    <nav className="steps" aria-label="Parts of this mission">
      {steps.map(([k, label, sel], i) => (
        <button key={k} type="button" className={`steps__item ${i <= top ? 'is-done' : ''} ${current === k ? 'is-current' : ''}`} onClick={() => scrollToElement(root.current?.querySelector(sel), -150)}>
          <i>{i < top ? '✓' : i + 1}</i>
          {label}
        </button>
      ))}
    </nav>
  );
}

// Renders one topic object from a session's content.jsx. Every field is optional
// except id and title, so a topic can be as light or as rich as it needs.
const Topic = forwardRef(function Topic({ session, topic, index, done, onToggleDone, next, onNext }, ref) {
  const own = useRef(null);
  const demos = topic.demos || (topic.demo ? [topic.demo] : []);
  const visuals = topic.visuals || (topic.visual ? [topic.visual] : []);
  const th = missionTheme(session.number, index, topic.theme);
  return (
    <article ref={el => { own.current = el; if (typeof ref === 'function') ref(el); else if (ref) ref.current = el; }} className={`topic topic--${th.motif}`} id={`topic-${topic.id}`} data-topic={topic.id} style={{ '--accent': th.a, '--accent-2': th.b, '--m-deep': th.deep }}>
      <div className="topic__bg" aria-hidden="true">
        <i className="topic__pattern" />
        <i className="topic__orb" />
        <i className="topic__orb topic__orb--2" />
      </div>
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

      <StepStrip root={own} topic={topic} />

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
        <button type="button" className="btn btn--primary next-btn" onClick={() => {
            if (!done) {
              award(`done:${session.number}:${topic.id}`, 30, 'Mission complete · fragment decrypted');
              onToggleDone();
            }
            onNext?.();
          }}>
          {!done && <Check />}
          <span>{done ? '' : 'Done · '}{next ? `Next: ${next.short || next.title}` : 'To the boss fight'}</span>
          <Arrow />
        </button>
        <button type="button" className="btn btn--sm done-btn" aria-pressed={done} onClick={() => {
            if (!done) award(`done:${session.number}:${topic.id}`, 30, 'Mission complete · fragment decrypted');
            onToggleDone();
          }}>
          <Check /> {done ? 'Mission complete' : 'Mark complete (+30 XP)'}
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
