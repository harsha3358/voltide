import { lazy, Suspense, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { SESSIONS } from '../../sessions/index.js';
import { href } from '../lib/router.js';
import { isUnlocked, useLockVersion } from '../lib/lock.js';
import { useEffects } from '../lib/effects.jsx';
import { useReveal } from '../lib/useReveal.js';
import { gsap } from '../lib/motion.js';
import Backdrop from '../components/Backdrop.jsx';
import DecryptedText from '../vendor/reactbits/DecryptedText/DecryptedText.jsx';
import ShinyText from '../vendor/reactbits/ShinyText/ShinyText.jsx';
import TextType from '../vendor/reactbits/TextType/TextType.jsx';
import CountUp from '../vendor/reactbits/CountUp/CountUp.jsx';
import ElectricBorder from '../vendor/reactbits/ElectricBorder/ElectricBorder.jsx';
import GlitchText from '../vendor/reactbits/GlitchText/GlitchText.jsx';
import { Arrow, Bolt, Book, Check, Drop, Flag, Lock, Play, Search, Shield, Sparkle, Terminal, Unlock } from '../components/Icons.jsx';
import { BADGES } from '../lib/game.js';
import { lastTopic } from '../components/Extras.jsx';

const Lightning = lazy(() => import('../vendor/reactbits/Lightning/Lightning.jsx'));

const HOW = [
  { icon: Sparkle, title: 'TL;DR first', text: 'Every mission opens with one sentence. No jargon. We promise (we checked).' },
  { icon: Drop, title: 'Water & lightning analogies', text: 'Data flows like water, attacks hit like lightning. Your brain already gets it, it just doesn’t know yet.' },
  { icon: Bolt, title: 'Live demos, zero slides', text: 'Spot a phish, flip bits, break a hash. Everything runs in your browser, so nothing real gets hurt.' },
  { icon: Terminal, title: 'Labs you can’t mess up', text: 'Copy, paste, compare. The expected output is right there, inside your own isolated virtual lab.' },
  { icon: Check, title: 'XP, combos, ranks', text: 'Answer right, the screen sparks, the XP bar fills, dopamine happens. That’s just science.' },
  { icon: Flag, title: 'A boss in every episode', text: 'Decrypt NULLSURGE’s secret message, then beat it in a timed boss fight. Badges are non-refundable flexes.' }
];

// The flow line above the session cards: water runs up to the last released
// session, then hits a sparking valve where the locked sessions begin.
function JourneyLine() {
  useLockVersion();
  const ref = useRef(null);
  const open = SESSIONS.filter(isUnlocked).length;
  const xs = [125, 375, 625, 875];
  const end = xs[open - 1] ?? 0;
  useGSAP(
    () => {
      gsap.fromTo('.jl-water', { drawSVG: '0%' }, { drawSVG: '100%', duration: 2, ease: 'power2.inOut', scrollTrigger: { trigger: ref.current, start: 'top 85%' } });
      gsap.to('.jl-flow', { strokeDashoffset: -60, duration: 1.2, repeat: -1, ease: 'none' });
      gsap.to('.jl-spark', { opacity: 0, scale: 0.4, transformOrigin: 'center', duration: 0.12, repeat: -1, yoyo: true, repeatDelay: 0.6, stagger: 0.15 });
    },
    { scope: ref, dependencies: [open], revertOnUpdate: true }
  );
  return (
    <svg ref={ref} viewBox="0 0 1000 80" style={{ width: '100%', height: 'auto', display: 'block', margin: '0 0 6px' }} aria-hidden="true">
      <line x1="0" y1="40" x2="1000" y2="40" stroke="var(--line-strong)" strokeWidth="6" strokeLinecap="round" strokeDasharray="1 12" />
      <line className="jl-water" x1="0" y1="40" x2={end} y2="40" stroke="var(--tide)" strokeWidth="8" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 8px var(--tide))' }} />
      <line className="jl-flow" x1="0" y1="40" x2={end} y2="40" stroke="#dffffa" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 24" opacity=".8" />
      {xs.map((x, i) => {
        const s = SESSIONS[i];
        const lit = i < open;
        return (
          <g key={x}>
            <circle cx={x} cy="40" r="22" fill="#050d1d" stroke={lit ? s.accent : 'var(--line-strong)'} strokeWidth="3" />
            <text x={x} y="46" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="16" fill={lit ? '#fff' : 'var(--muted)'}>
              0{s.number}
            </text>
          </g>
        );
      })}
      {open < 4 && (
        <g transform={`translate(${(xs[open - 1] + xs[open]) / 2} 40)`}>
          <rect x="-10" y="-20" width="20" height="40" rx="4" fill="#1a0b14" stroke="var(--danger)" strokeWidth="2" />
          <line x1="-14" y1="0" x2="14" y2="0" stroke="var(--danger)" strokeWidth="3" />
          {[[-18, -22], [16, -18], [-14, 22], [20, 20]].map(([x, y], i) => (
            <path key={i} className="jl-spark" d={`M${x} ${y} l4 -6 l-2 6 l5 -2`} stroke="var(--spark)" strokeWidth="2" fill="none" />
          ))}
        </g>
      )}
    </svg>
  );
}

function SessionCard({ s }) {
  const open = isUnlocked(s);
  return (
    <a className={`session-card ${open ? '' : 'session-card--locked'}`} href={href.session(s.number)} style={{ '--card-accent': s.accent }} data-reveal>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span className="session-card__num">0{s.number}</span>
        <span className={`lock-badge ${open ? 'lock-badge--open' : ''}`}>
          {open ? <Unlock /> : <Lock />} {open ? 'OPEN' : 'LOCKED'}
        </span>
      </div>
      <div className="session-card__name">{open ? s.name : <GlitchText speed={0.9} intensity={0.3} enableShadows={false} fontSize="13px" fontWeight={500} color={s.accent}>{s.name}</GlitchText>}</div>
      <h3>{s.title}</h3>
      <p>{s.tagline}</p>
      <ul>
        {s.teaser.slice(0, 6).map(t => (
          <li key={t}>{t}</li>
        ))}
        {s.teaser.length > 6 && <li>+ {s.teaser.length - 6} more</li>}
      </ul>
      <div className="session-card__foot">
        <span>{s.element === 'water' ? '🌊' : '⚡'} {s.element.toUpperCase()}</span>
        <span>
          {open ? 'Enter' : 'Preview'} <Arrow width="14" style={{ verticalAlign: '-2px' }} />
        </span>
      </div>
    </a>
  );
}

export default function Home() {
  useLockVersion();
  const { lite } = useEffects();
  const ref = useRef(null);
  useReveal(ref);
  const topicCount = SESSIONS.reduce((n, s) => n + s.teaser.length, 0);
  const last = lastTopic();
  return (
    <div ref={ref}>
      <Backdrop kind="world" opacity={0.9} />
      <section className="hero">
        {!lite && (
          <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'screen', opacity: 0.75, pointerEvents: 'none' }} aria-hidden="true">
            <Suspense fallback={null}>
              <Lightning color="#7df9ff" bolts={1} xOffset={0.55} angle={-6} branches={0.7} glow={1.3} intensity={0.8} speed={0.55} flicker={0.8} mouseInteraction={false} />
            </Suspense>
          </div>
        )}
        <div className="wrap" style={{ position: 'relative' }}>
          <span className="kicker">B.Tech · Cybersecurity · Zero experience, zero judgement</span>
          <h1 className="hero__title">
            <DecryptedText text="VOLTIDE" animateOn="view" sequential speed={45} revealDirection="center" characters="01⚡~≈#@%&" />
          </h1>
          <p className="hero__lead">
            <ShinyText text="Four episodes. One rogue AI. Zero boring lectures." color="#c9d3d5" shineColor="#ffffff" speed={3} /> Go from
            “wait, what’s a bit?” to taking down NULLSURGE with your squad. If you can doomscroll, you can do this.
          </p>
          <div className="hero__typer">
            <TextType
              text={[
                '> Your password is probably “password”. We need to talk.',
                '> Hackers don’t break in. They log in. With your password.',
                '> Every click sends a packet somewhere. Yes, even that one.',
                '> Defenders win in layers. Like an onion. Or a good biryani.'
              ]}
              typingSpeed={38}
              pauseDuration={2200}
              cursorCharacter="▌"
            />
          </div>
          <div className="hero__actions">
            <ElectricBorder color="#7df9ff" borderRadius={14} chaos={0.45} thickness={1.4} speed={0.9}>
              <a className="btn btn--primary" href={href.session(1)}>
                <Bolt /> Start Episode 01
              </a>
            </ElectricBorder>
            <a className="btn" href={href.handbook()}>
              <Book /> How this works
            </a>
            <a className="btn btn--ghost" href={href.glossary()}>
              <Search /> Jargon buster
            </a>
          </div>
          {last && (
            <a className="resume" href={href.topic(last.session, last.topic)}>
              <Play width="16" height="16" /> Resume Episode 0{last.session}: <strong>{last.title}</strong>
            </a>
          )}
        </div>
        <div className="scroll-cue" aria-hidden="true">
          <i />
          SCROLL
        </div>
      </section>

      <div className="wrap">
        <div className="stats">
          {[
            [SESSIONS.length, 'episodes'],
            [topicCount, 'missions from scratch'],
            [13, 'live demos, zero slides'],
            [Object.keys(BADGES).length, 'badges to flex']
          ].map(([n, l]) => (
            <div className="stat" key={l} data-reveal>
              <strong>
                <CountUp to={n} duration={1.8} />
              </strong>
              <span>{l}</span>
            </div>
          ))}
        </div>

        <section className="journey" aria-labelledby="journey-h">
          <div className="section-head" data-reveal>
            <span className="kicker">The journey</span>
            <h2 id="journey-h">Spark → Current → Tide → Surge</h2>
            <p>
              Each episode levels you up. Episode 01 is live now. The rest unlock when your facilitator decides you’ve
              earned it. No pressure. (Some pressure.)
            </p>
          </div>
          <JourneyLine />
          <div className="journey__grid">
            {SESSIONS.map(s => (
              <SessionCard key={s.number} s={s} />
            ))}
          </div>
        </section>

        <section className="how" aria-labelledby="how-h">
          <div className="section-head" data-reveal>
            <span className="kicker">Built for people who skip intros</span>
            <h2 id="how-h">Why you’ll actually stay till the end</h2>
          </div>
          <div className="grid-3">
            {HOW.map(({ icon: Icon, title, text }) => (
              <div className="card how__item" key={title} data-reveal>
                <span className="how__icon">
                  <Icon />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="card" data-reveal style={{ marginTop: 18, display: 'flex', gap: 16, alignItems: 'center', borderColor: 'rgba(255,181,71,.35)' }}>
            <span className="how__icon" style={{ color: 'var(--warn)', borderColor: 'rgba(255,181,71,.4)', background: 'rgba(255,181,71,.08)' }}>
              <Shield />
            </span>
            <p style={{ margin: 0 }}>
              <strong>The one rule that keeps you out of an FIR:</strong> only test systems you own or have <em>written
              permission</em> to test. Everything here runs in your browser or your own isolated lab. Main-character energy,
              legally.{' '}
              <a href={href.topic(1, 'law-ethics')}>Why this matters →</a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
