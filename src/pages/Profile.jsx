import { useState } from 'react';
import { BADGES, randomHandle, rankFor, RANKS, resetGame, setHandle, useGame } from '../lib/game.js';
import { useProgress } from '../lib/progress.js';
import { SESSIONS } from '../../sessions/index.js';
import Backdrop from '../components/Backdrop.jsx';
import Volty from '../components/Volty.jsx';
import { Icon } from '../components/Glyphs.jsx';
import ElectricBorder from '../vendor/reactbits/ElectricBorder/ElectricBorder.jsx';
import CountUp from '../vendor/reactbits/CountUp/CountUp.jsx';
import ShinyText from '../vendor/reactbits/ShinyText/ShinyText.jsx';

// Your agent profile: handle, rank, badge cabinet and the Episode 01 certificate.
export default function Profile() {
  const g = useGame();
  const progress = useProgress();
  const r = rankFor(g.xp);
  const [name, setName] = useState(g.handle);
  const [confirmReset, setConfirmReset] = useState(false);
  const earned = Object.keys(g.badges).filter(id => BADGES[id]).length;
  const pct = r.next ? ((g.xp - r.floor) / (r.next - r.floor)) * 100 : 100;
  const s1Done = g.badges['boss-1'] && g.badges['decoder-1'];
  return (
    <>
      <Backdrop kind="world" opacity={0.45} />
      <section className="wrap profile">
        <div className="split-1-2" style={{ alignItems: 'center' }}>
          <Volty size={150} mood={earned ? 'happy' : 'idle'} />
          <div>
            <span className="kicker">Agent profile</span>
            <h1 style={{ fontSize: 'clamp(2.2rem, 7vw, 4.2rem)', margin: '10px 0 6px' }}>
              <ShinyText text={g.handle} color="#e6f1ff" shineColor="#ffd23f" speed={3} />
            </h1>
            <div className="d-row">
              <input className="input" style={{ maxWidth: 280 }} value={name} onChange={e => setName(e.target.value)} onBlur={() => setHandle(name)} aria-label="Your player handle" maxLength={24} />
              <button type="button" className="btn btn--sm" onClick={() => { const h = randomHandle(); setName(h); setHandle(h); }}>
                🎲 Reroll handle
              </button>
            </div>
            <p className="d-note">Use a handle, not your real name. That’s lesson one of online privacy.</p>
          </div>
        </div>

        <div className="grid-3" style={{ margin: '36px 0' }}>
          <ElectricBorder color="#ffd23f" borderRadius={20} chaos={0.4} thickness={1.3}>
            <div className="card" style={{ height: '100%' }}>
              <span className="d-label">Rank</span>
              <div className="d-big" style={{ color: 'var(--spark)' }}>{r.name}</div>
              <p className="d-note">{r.line}</p>
              <div className="meter" style={{ marginTop: 10 }}>
                <i style={{ width: `${pct}%`, '--meter-full': `${(100 / Math.max(pct, 1)) * 100}%` }} />
              </div>
              <p className="d-note">{r.next ? `${r.next - g.xp} XP to ${r.nextName}` : 'Max rank. Legend status.'}</p>
            </div>
          </ElectricBorder>
          <div className="card">
            <span className="d-label">Total XP</span>
            <div className="d-big"><CountUp to={g.xp} duration={1.4} /></div>
            <p className="d-note">Best combo: x{g.best}</p>
          </div>
          <div className="card">
            <span className="d-label">Progress</span>
            {SESSIONS.map(s => (
              <p key={s.number} style={{ margin: '4px 0', fontSize: 14 }}>
                <strong style={{ color: s.accent }}>0{s.number} {s.name}</strong> · {progress.countFor(s.number)} missions done
              </p>
            ))}
          </div>
        </div>

        <h2>Badge cabinet · {earned}/{Object.keys(BADGES).length}</h2>
        <div className="badge-grid">
          {Object.entries(BADGES).map(([id, [title, how, icon]]) => (
            <div key={id} className={`badge-tile ${g.badges[id] ? '' : 'is-locked'}`}>
              <span className="badge-tile__icon"><Icon name={icon} size={28} /></span>
              <strong>{title}</strong>
              <span>{g.badges[id] ? how : `Locked: ${how.toLowerCase()}`}</span>
            </div>
          ))}
        </div>

        <h2 style={{ marginTop: 40 }}>Rank ladder</h2>
        <ol className="points">
          {RANKS.map(([xp, rank, line]) => (
            <li key={rank} style={{ opacity: g.xp >= xp ? 1 : 0.5 }}>
              <strong>{rank}</strong> · {xp} XP · {line}
            </li>
          ))}
        </ol>

        <div className="cert cert-print">
          <span className="kicker">Certificate · Episode 01 · SPARK</span>
          {s1Done ? (
            <>
              <h2>{g.handle}</h2>
              <p>completed <strong>Episode 01 · SPARK: Cloud from Zero + Setup</strong>, decrypted the transmission and defeated LAGZILLA.</p>
              <p className="d-note">Rank: {r.name} · {g.xp} XP · {earned} badges</p>
              <button type="button" className="btn btn--primary" onClick={() => window.print()}>Print / save as PDF</button>
            </>
          ) : (
            <p style={{ marginTop: 12 }}>🔒 Unlocks when you finish every Episode 01 mission <em>and</em> beat the boss.</p>
          )}
        </div>

        <p className="d-row" style={{ marginTop: 30 }}>
          {confirmReset ? (
            <>
              <span className="d-note" style={{ margin: 0 }}>Wipe all XP and badges on this device? No undo.</span>
              <button type="button" className="btn btn--sm" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => { resetGame(); setConfirmReset(false); }}>
                Yes, reset
              </button>
              <button type="button" className="btn btn--sm btn--ghost" onClick={() => setConfirmReset(false)}>
                Keep my stuff
              </button>
            </>
          ) : (
            <button type="button" className="btn btn--sm btn--ghost" onClick={() => setConfirmReset(true)}>
              Reset my progress
            </button>
          )}
        </p>
      </section>
    </>
  );
}
