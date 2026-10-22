import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../lib/motion.js';
import { answer, award, badge, sfx } from '../lib/game.js';
import { useSpark } from './Spark.jsx';
import Volty from './Volty.jsx';
import GlitchText from '../vendor/reactbits/GlitchText/GlitchText.jsx';
import { Md } from './Blocks.jsx';

const TIME = 20;

// The end-of-episode boss (named in content.boss.name): answer fast to strike it with lightning.
// Wrong answers or timeouts cost a life. Three lives, one boss, no farming.
function Monster({ hit }) {
  return (
    <svg viewBox="0 0 220 220" className="boss-svg" aria-hidden="true" style={{ width: '100%', maxWidth: 260, margin: '0 auto', display: 'block' }}>
      <defs>
        <radialGradient id="ns-g">
          <stop offset="0" stopColor="#ff6f8e" />
          <stop offset=".6" stopColor="#7a1a3a" />
          <stop offset="1" stopColor="#1a0612" />
        </radialGradient>
      </defs>
      <path className="ns-strike" d="M120 0 L96 70 L122 74 L92 140" fill="none" stroke="#fff6c8" strokeWidth="6" opacity="0" style={{ filter: 'drop-shadow(0 0 12px #ffd23f)' }} />
      <g className="ns-body">
        <polygon points="110,40 180,80 180,150 110,190 40,150 40,80" fill="url(#ns-g)" stroke="#ff4d6d" strokeWidth="3" />
        <polygon points="110,62 160,90 160,140 110,168 60,140 60,90" fill="none" stroke="#ff4d6d" strokeOpacity=".5" strokeDasharray="6 6" className="ns-ring" />
        <rect x="76" y="102" width="22" height="10" rx="2" fill={hit ? '#fff' : '#ffd23f'} />
        <rect x="122" y="102" width="22" height="10" rx="2" fill={hit ? '#fff' : '#ffd23f'} />
        <path d="M84 142 h52" stroke="#ff4d6d" strokeWidth="4" strokeDasharray="6 4" />
      </g>
    </svg>
  );
}

export default function BossBattle({ session, boss }) {
  const name = boss.name || 'LAGZILLA';
  const total = boss.questions.length;
  const [i, setI] = useState(0);
  const [hp, setHp] = useState(total);
  const [lives, setLives] = useState(3);
  const [state, setState] = useState('idle');
  const [picked, setPicked] = useState(null);
  const ref = useRef(null);
  const burst = useSpark();
  const { contextSafe } = useGSAP({ scope: ref });
  const timer = useRef(null);

  const strike = contextSafe(() => {
    sfx('hit');
    gsap.timeline()
      .set('.ns-strike', { opacity: 1 })
      .fromTo('.ns-strike', { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.18, ease: 'power4.in' })
      .to('.ns-body', { x: 8, duration: 0.05, yoyo: true, repeat: 5 })
      .to('.ns-strike', { opacity: 0, duration: 0.2 });
  });
  const hurt = contextSafe(() => {
    ref.current.classList.remove('is-shaking');
    void ref.current.offsetWidth;
    ref.current.classList.add('is-shaking');
  });
  useGSAP(() => gsap.to('.ns-ring', { rotation: 360, svgOrigin: '110 115', duration: 12, repeat: -1, ease: 'none' }), { scope: ref });

  useEffect(() => {
    if (state !== 'fight' || picked !== null) return;
    gsap.fromTo(timer.current, { scaleX: 1 }, { scaleX: 0, duration: TIME, ease: 'none' });
    const t = setTimeout(() => choose(-1), TIME * 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, i, picked]);

  const start = () => {
    setI(0);
    setHp(total);
    setLives(3);
    setPicked(null);
    setState('fight');
  };

  const choose = k => {
    if (picked !== null) return;
    gsap.killTweensOf(timer.current);
    const q = boss.questions[i];
    const right = k === q.answer;
    setPicked(k);
    answer(right);
    let nextHp = hp;
    let nextLives = lives;
    if (right) {
      nextHp = hp - 1;
      setHp(nextHp);
      strike();
    } else {
      nextLives = lives - 1;
      setLives(nextLives);
      hurt();
    }
    setTimeout(() => {
      if (nextHp <= 0) {
        setState('won');
        award(`boss:${session.number}`, 400, `${name} defeated · Episode 0${session.number}`);
        badge(`boss-${session.number}`);
        burst(ref.current);
      } else if (nextLives <= 0) setState('lost');
      else {
        setI(i + 1);
        setPicked(null);
      }
    }, 1300);
  };

  const q = boss.questions[Math.min(i, total - 1)];
  return (
    <section ref={ref} className="boss" aria-label="Boss battle">
      <div className="boss__stage">
        <div>
          <GlitchText speed={0.7} intensity={0.4} fontSize="clamp(1.6rem, 4vw, 2.4rem)" shadowColors={['#ff4d6d', '#7df9ff']}>
            {name}
          </GlitchText>
          <Monster hit={picked !== null && picked === q.answer} />
          <span className="d-label" style={{ marginTop: 8 }}>Boss HP</span>
          <div className="boss__hp">
            <i style={{ width: `${(hp / total) * 100}%` }} />
          </div>
          <div className="d-row" style={{ justifyContent: 'space-between' }}>
            <span className="d-note" style={{ margin: 0 }}>{hp}/{total}</span>
            <span className="boss__lives" aria-label={`${lives} lives left`}>{'💧'.repeat(lives)}{'·'.repeat(3 - lives)}</span>
          </div>
        </div>
        <div>
          {state === 'idle' && (
            <div style={{ display: 'grid', gap: 14 }}>
              <div className="hook">
                <Volty size={60} mood="shock" />
                <div className="hook__bubble">
                  <b>Volty</b>
                  {boss.taunt}
                </div>
              </div>
              <p style={{ color: 'var(--text-soft)' }}>
                {total} rapid-fire questions · {TIME}s each · 3 lives. Every right answer is a lightning strike. Win for <strong>+400 XP</strong> and a badge.
              </p>
              <button type="button" className="btn btn--primary" onClick={start} style={{ justifySelf: 'start', '--accent': '#ff4d6d', '--accent-2': '#ffd23f' }}>
                ⚡ Start the boss fight
              </button>
            </div>
          )}
          {state === 'fight' && (
            <div>
              <span className="d-label">
                Question {i + 1}/{total}
              </span>
              <div className="boss__timer" ref={timer} />
              <Md as="h4" style={{ fontSize: '1.2rem', margin: '14px 0' }}>{q.q}</Md>
              <div className="check__options">
                {q.options.map((o, k) => {
                  const st = picked === null ? '' : k === q.answer ? 'is-right' : k === picked ? 'is-wrong' : '';
                  return (
                    <button key={k} type="button" className={`check__opt ${st}`} onClick={() => choose(k)} disabled={picked !== null}>
                      <b>{String.fromCharCode(65 + k)}</b>
                      <Md>{o}</Md>
                    </button>
                  );
                })}
              </div>
              {picked === -1 && <p className="d-note d-bad">Too slow! {name} hits back.</p>}
            </div>
          )}
          {state === 'won' && (
            <div className="hook" style={{ alignItems: 'center' }}>
              <Volty size={90} mood="happy" />
              <div>
                <h3 style={{ fontSize: '1.8rem', color: 'var(--spark)' }}>{name} deleted. GG.</h3>
                <p style={{ color: 'var(--text-soft)' }}>{boss.win}</p>
                <a className="btn btn--sm" href="#/profile">See your badges</a>
              </div>
            </div>
          )}
          {state === 'lost' && (
            <div className="hook" style={{ alignItems: 'center' }}>
              <Volty size={80} mood="shock" />
              <div>
                <h3 style={{ fontSize: '1.6rem' }}>Signal lost.</h3>
                <p style={{ color: 'var(--text-soft)' }}>No stress: every expert fails first. Scroll up, revise, then go again.</p>
                <button type="button" className="btn btn--sm btn--primary" onClick={start}>
                  Rematch
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
