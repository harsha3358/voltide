import { Fragment, useEffect, useRef, useState } from 'react';
import { getSession, SESSIONS } from '../../sessions/index.js';
import { href } from '../lib/router.js';
import { isUnlocked, useLockVersion } from '../lib/lock.js';
import { useProgress } from '../lib/progress.js';
import { useReveal } from '../lib/useReveal.js';
import { scrollToElement, scrollToTop, ScrollTrigger } from '../lib/motion.js';
import Backdrop from '../components/Backdrop.jsx';
import LockGate from '../components/LockGate.jsx';
import Topic from '../components/Topic.jsx';
import SessionCircuit from '../components/SessionCircuit.jsx';
import Tank from '../components/Tank.jsx';
import Loader from '../components/Loader.jsx';
import { CircuitDivider, WaveDivider } from '../components/Dividers.jsx';
import { Md } from '../components/Blocks.jsx';
import EpisodeIntro from '../components/EpisodeIntro.jsx';
import Transmission from '../components/Transmission.jsx';
import BossBattle from '../components/BossBattle.jsx';
import { rememberTopic } from '../components/Extras.jsx';
import DecryptedText from '../vendor/reactbits/DecryptedText/DecryptedText.jsx';
import ShinyText from '../vendor/reactbits/ShinyText/ShinyText.jsx';
import SpotlightCard from '../vendor/reactbits/SpotlightCard/SpotlightCard.jsx';
import { Arrow, Book, Check, Home, Lock, Map, Play } from '../components/Icons.jsx';

function useSessionContent(session, open) {
  const [content, setContent] = useState(null);
  useEffect(() => {
    if (!session || !open) return;
    let alive = true;
    setContent(null);
    session.load().then(m => alive && setContent(m.default));
    return () => {
      alive = false;
    };
  }, [session, open]);
  return content;
}

function useActiveTopic(content) {
  const [active, setActive] = useState(null);
  useEffect(() => {
    if (!content) return;
    const els = [...document.querySelectorAll('[data-topic]')];
    const io = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.dataset.topic);
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [content]);
  return active;
}

export default function SessionPage({ route }) {
  useLockVersion();
  const session = getSession(route.session);
  const open = session && isUnlocked(session);
  const content = useSessionContent(session, open);
  const active = useActiveTopic(content);
  const progress = useProgress();
  const ref = useRef(null);
  useReveal(ref, [content]);
  useEffect(() => {
    const t = content?.topics.find(x => x.id === active);
    if (t) rememberTopic(session.number, t.id, t.short || t.title);
  }, [active, content, session]);

  useEffect(() => {
    if (!session) return;
    const root = document.documentElement.style;
    root.setProperty('--accent', session.accent);
    root.setProperty('--accent-2', session.accent2);
    return () => {
      root.removeProperty('--accent');
      root.removeProperty('--accent-2');
    };
  }, [session]);

  // Deep links: #/session/N/topic/ID scrolls to that topic once content exists.
  useEffect(() => {
    if (!content) return;
    if (!route.topic) {
      scrollToTop();
      return;
    }
    const el = document.getElementById(`topic-${route.topic}`);
    const t = setTimeout(() => {
      ScrollTrigger.refresh();
      scrollToElement(el);
    }, 120);
    return () => clearTimeout(t);
  }, [content, route.topic, route.session]);

  if (!session) {
    return (
      <div className="wrap gate">
        <div>
          <h1>No such session</h1>
          <a href={href.home()}>Back home</a>
        </div>
      </div>
    );
  }

  if (!open) {
    return (
      <>
        <Backdrop kind={session.backdrop} opacity={0.6} props={session.world} />
        <LockGate session={session} teaser={session.teaser} />
      </>
    );
  }

  if (!content) return <Loader label={`CHARGING EPISODE 0${session.number}`} />;

  const { topics } = content;
  const doneCount = topics.filter(t => progress.isDone(session.number, t.id)).length;
  const next = SESSIONS.find(s => s.number === session.number + 1);
  const nextOpen = next && isUnlocked(next);

  return (
    <div ref={ref}>
      <Backdrop kind={session.backdrop} opacity={0.75} props={session.world} />
      <EpisodeIntro session={session} episode={content.episode} />
      <section className="s-hero">
        <div className="wrap">
          <div className="tabs" style={{ marginBottom: 22 }}>
            <a href={href.session(session.number)} aria-current="page">
              Learn
            </a>
            <a href={href.guide(session.number)}>Field guide</a>
          </div>
          <br />
          <span className="kicker">
            Episode 0{session.number} · {session.element === 'water' ? '🌊' : '⚡'} {session.element}
          </span>
          <h1 className="s-hero__title">
            <DecryptedText text={session.name} animateOn="view" sequential speed={40} revealDirection="start" />
          </h1>
          <div className="s-hero__sub">
            <ShinyText text={session.title} color="#e6f1ff" shineColor={session.accent} speed={3.2} />
          </div>
          <Md as="p" className="s-hero__lead">{content.intro}</Md>
          <div className="s-hero__actions">
            <a className="btn btn--primary" href={href.topic(session.number, topics[0].id)}>
              <Play /> Start mission 01
            </a>
            <a className="btn" href={href.guide(session.number)}>
              <Book /> Open field guide
            </a>
            <a className="btn btn--ghost" href="#session-map" onClick={e => (e.preventDefault(), scrollToElement(document.getElementById('session-map')))}>
              <Map /> Mission map
            </a>
          </div>
          {content.transmission && <Transmission session={session} phrase={content.transmission} topics={topics} isDone={progress.isDone} villain={content.boss?.name} />}
          {content.outcomes && (
            <div className="outcomes card" data-reveal>
              <span className="kicker">By the end you can (and will, mostly)</span>
              <ol style={{ marginTop: 14 }}>
                {content.outcomes.map(o => (
                  <li key={o}>
                    <Md>{o}</Md>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </section>

      <div className="wrap" id="session-map" style={{ scrollMarginTop: 90 }}>
        <span className="kicker" data-reveal>
          Mission map · tap a node to teleport
        </span>
        <SessionCircuit session={session} topics={topics} isDone={progress.isDone} />
      </div>

      <div className="wrap s-layout" style={{ marginTop: 40 }}>
        <aside className="toc" aria-label="Topics in this session">
          <Tank value={doneCount} total={topics.length} />
          <div className="toc__title">MISSIONS</div>
          <ol>
            {topics.map((t, i) => (
              <li key={t.id}>
                <a href={href.topic(session.number, t.id)} aria-current={active === t.id ? 'true' : undefined}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <span>{t.short || t.title}</span>
                  <span className="toc__done">{progress.isDone(session.number, t.id) ? '✓' : ''}</span>
                </a>
              </li>
            ))}
          </ol>
          <div className="toc__footer">
            <a href={href.guide(session.number)}>
              <Book width="14" /> <span>Field guide</span>
            </a>
            <a href={href.glossary()}>
              <span>🔎</span> <span>Jargon buster</span>
            </a>
            <a href={href.home()}>
              <Home width="14" /> <span>All sessions</span>
            </a>
          </div>
        </aside>

        <div>
          <details className="mobile-toc card">
            <summary>MISSIONS · {doneCount}/{topics.length} DONE</summary>
            <ol>
              {topics.map(t => (
                <li key={t.id}>
                  <a href={href.topic(session.number, t.id)}>{t.title}</a>
                </li>
              ))}
            </ol>
          </details>

          {topics.map((t, i) => (
            <Fragment key={t.id}>
              {i > 0 && (i % 2 ? <WaveDivider /> : <CircuitDivider />)}
              <Topic session={session} topic={t} index={i} done={progress.isDone(session.number, t.id)} onToggleDone={() => progress.toggle(session.number, t.id)} />
            </Fragment>
          ))}

          {content.boss && <BossBattle session={session} boss={content.boss} />}

          <section className="takeaway" data-reveal>
            <span className="kicker">Episode 0{session.number} · the recap</span>
            <h2>{content.takeaway.title}</h2>
            <Md as="p">{content.takeaway.text}</Md>
            {content.takeaway.checklist && (
              <ul className="points">
                {content.takeaway.checklist.map(c => (
                  <Md key={c} as="li">{c}</Md>
                ))}
              </ul>
            )}
            {next && (
              <SpotlightCard spotlightColor={next.accent} className="next-card" style={{ padding: 22, marginTop: 26 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span className="kicker" style={{ color: next.accent }}>
                      Next · Episode 0{next.number}
                    </span>
                    <h3 style={{ margin: '8px 0 4px' }}>
                      {next.name}: {next.title}
                    </h3>
                    <p style={{ margin: 0, color: 'var(--text-soft)' }}>{next.tagline}</p>
                  </div>
                  <a className="btn btn--primary" href={href.session(next.number)} style={{ '--accent': next.accent, '--accent-2': next.accent2 }}>
                    {nextOpen ? (
                      <>
                        Continue <Arrow />
                      </>
                    ) : (
                      <>
                        <Lock /> Locked (for now)
                      </>
                    )}
                  </a>
                </div>
              </SpotlightCard>
            )}
            {!next && (
              <p style={{ marginTop: 20 }}>
                <a className="btn btn--primary" href={href.home()}>
                  <Check /> Finish: back to the journey
                </a>
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
