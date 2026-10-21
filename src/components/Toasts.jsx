import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../lib/motion.js';
import { onToast } from '../lib/game.js';
import { useSpark } from './Spark.jsx';
import { Icon } from './Glyphs.jsx';
import Volty from './Volty.jsx';
import DecryptedText from '../vendor/reactbits/DecryptedText/DecryptedText.jsx';

// XP pops, badge unlocks and the full-screen rank-up moment.
function RankUp({ rank, onDone }) {
  const ref = useRef(null);
  const burst = useSpark();
  useGSAP(
    () => {
      const tl = gsap.timeline({ onComplete: onDone });
      tl.fromTo(ref.current, { opacity: 0 }, { opacity: 1, duration: 0.25 })
        .fromTo('.ru-bolt', { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.35, ease: 'power4.in' })
        .to('.ru-flash', { opacity: 0.9, duration: 0.05, yoyo: true, repeat: 3 })
        .fromTo('.ru-card', { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(2)' }, '-=0.1')
        .call(() => burst(ref.current.querySelector('.ru-card')))
        .to({}, { duration: 2.6 })
        .to(ref.current, { opacity: 0, duration: 0.4 });
    },
    { scope: ref }
  );
  return (
    <div ref={ref} className="rankup" role="status" onClick={onDone}>
      <div className="ru-flash" />
      <svg className="ru-svg" viewBox="0 0 400 600" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
        <path className="ru-bolt" d="M210 0 L170 180 L230 190 L160 380 L250 260 L190 250 L240 90" fill="none" stroke="#fff6c8" strokeWidth="6" style={{ filter: 'drop-shadow(0 0 18px #ffd23f)' }} />
      </svg>
      <div className="ru-card">
        <Volty size={84} mood="happy" />
        <span className="kicker">Rank up</span>
        <h2>
          <DecryptedText text={rank.name} animateOn="view" sequential speed={45} />
        </h2>
        <p>{rank.line}</p>
      </div>
    </div>
  );
}

export default function Toasts() {
  const [items, setItems] = useState([]);
  const [rank, setRank] = useState(null);
  useEffect(
    () =>
      onToast(t => {
        if (t.kind === 'rank') return setRank(t.rank);
        const id = Math.random();
        setItems(list => [...list.slice(-3), { ...t, id }]);
        setTimeout(() => setItems(list => list.filter(x => x.id !== id)), t.kind === 'badge' ? 4200 : 2600);
      }),
    []
  );
  return (
    <>
      <div className="toasts" aria-live="polite">
        {items.map(t =>
          t.kind === 'badge' ? (
            <div key={t.id} className="toast toast--badge">
              <span className="toast__icon">
                <Icon name={t.badge[2]} size={22} />
              </span>
              <div>
                <strong>Badge unlocked: {t.badge[0]}</strong>
                <span>{t.badge[1]}</span>
              </div>
            </div>
          ) : (
            <div key={t.id} className="toast">
              <strong className="toast__xp">+{t.xp} XP</strong>
              <span>{t.label}</span>
            </div>
          )
        )}
      </div>
      {rank && <RankUp rank={rank} onDone={() => setRank(null)} />}
    </>
  );
}
