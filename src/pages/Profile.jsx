import { useState } from 'react';
import { BADGES, randomHandle, rankFor, RANKS, resetEverything, resetScore, setHandle, useGame } from '../lib/game.js';
import { useProgress } from '../lib/progress.js';
import { SESSIONS } from '../../sessions/index.js';
import Backdrop from '../components/Backdrop.jsx';
import Volty from '../components/Volty.jsx';
import { Icon } from '../components/Glyphs.jsx';
import ElectricBorder from '../vendor/reactbits/ElectricBorder/ElectricBorder.jsx';
import CountUp from '../vendor/reactbits/CountUp/CountUp.jsx';
import ShinyText from '../vendor/reactbits/ShinyText/ShinyText.jsx';
import { OtpReset } from '../components/AuthScreen.jsx';
import { logout, useAuth } from '../lib/auth.js';
import { backendEnabled } from '../lib/backend.js';
import { flush } from '../lib/track.js';

// Your agent profile: handle, rank, badge cabinet and the Episode 01 certificate.
export default function Profile() {
  const g = useGame();
  const progress = useProgress();
  const r = rankFor(g.xp);
  const [name, setName] = useState(g.handle);
  const [resetMode, setResetMode] = useState(null);
  const [resetDone, setResetDone] = useState('');
  const auth = useAuth();
  const [changing, setChanging] = useState(false);
  const earned = Object.keys(g.badges).filter(id => BADGES[id]).length;
  const pct = r.next ? ((g.xp - r.floor) / (r.next - r.floor)) * 100 : 100;
  const doneEpisodes = SESSIONS.filter(s => g.badges[`boss-${s.number}`] && g.badges[`decoder-${s.number}`]).length;
  const graduate = doneEpisodes === SESSIONS.length;
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

        <h2 style={{ marginTop: 40 }}>Episode certificates</h2>
        <div className="grid-3">
          {SESSIONS.map(s => {
            const ok = g.badges[`boss-${s.number}`] && g.badges[`decoder-${s.number}`];
            return (
              <div key={s.number} className="card" style={{ borderColor: ok ? s.accent : undefined }}>
                <span className="d-label" style={{ color: s.accent }}>Episode 0{s.number} · {s.name}</span>
                <strong>{s.title}</strong>
                <p className="d-note">{ok ? '✅ Complete: transmission decrypted and boss defeated.' : '🔒 Finish every mission and beat the boss.'}</p>
              </div>
            );
          })}
        </div>

        <div className="cert cert-print">
          <span className="kicker">Certificate · Cloud Computing Workshop</span>
          {graduate ? (
            <>
              <h2>{g.handle}</h2>
              <p>
                completed all four episodes of <strong>VOLTIDE · Cloud Computing Workshop</strong>: cloud basics &amp; setup, computer
                networks, cloud lab practicals and the cloud deployment challenge, and defeated every form of LAGZILLA.
              </p>
              <p className="d-note">Rank: {r.name} · {g.xp} XP · {earned} badges</p>
              <button type="button" className="btn btn--primary" onClick={() => window.print()}>Print / save as PDF</button>
            </>
          ) : (
            <p style={{ marginTop: 12 }}>
              🔒 Become a <strong>Workshop Graduate</strong>: complete all four episodes ({doneEpisodes}/4 so far).
            </p>
          )}
        </div>

        {backendEnabled && auth && (
          <section className="card account-card" aria-labelledby="account-h">
            <h2 id="account-h" style={{ fontSize: '1.4rem' }}>Your account</h2>
            <dl>
              <dt>Name</dt>
              <dd>{auth.user.name}</dd>
              <dt>Reg. no.</dt>
              <dd>{auth.user.regNo}</dd>
              <dt>Email</dt>
              <dd>{auth.user.email}</dd>
            </dl>
            <p className="d-note" style={{ margin: 0 }}>Your progress is saved to your account, so you can log in on any computer and carry on.</p>
            {changing ? (
              <OtpReset fixedId={auth.user.regNo} purpose="change" onBack={() => setChanging(false)} />
            ) : (
              <div className="d-row">
                <button type="button" className="btn btn--sm" onClick={() => setChanging(true)}>🔑 Change password (OTP)</button>
                <button type="button" className="btn btn--sm btn--ghost" onClick={() => logout(flush)}>Log out</button>
              </div>
            )}
          </section>
        )}

        <section className="card reset-panel" aria-labelledby="reset-h">
          <h2 id="reset-h" style={{ fontSize: '1.4rem' }}>{auth ? 'Reset my progress' : 'Reset (shared lab PCs)'}</h2>
          <p className="d-note" style={{ marginTop: 0 }}>{auth ? 'Handing this computer to the next student? Just log out: your progress is saved. Use these only to start over.' : 'Handing this computer to the next student? Pick one.'}</p>
          {resetMode === null && (
            <div className="reset-grid">
              <button type="button" className="reset-opt" onClick={() => setResetMode('score')}>
                <strong>Reset score</strong>
                <span>XP, rank, badges and combos go to zero. Missions done and unlocked episodes stay.</span>
              </button>
              <button type="button" className="reset-opt reset-opt--danger" onClick={() => setResetMode('all')}>
                <strong>Reset everything</strong>
                <span>{auth ? 'Wipes your whole progress, here and in your saved account: score, badges, missions, secret messages, unlocked episodes. You stay logged in.' : 'Wipes all activity: score, badges, missions, secret messages, unlocked episodes, boss results and intros. Like a brand-new browser.'}</span>
              </button>
            </div>
          )}
          {resetMode && (
            <div className="d-row" role="alertdialog" aria-label="Confirm reset">
              <span style={{ fontSize: 15 }}>
                {resetMode === 'all' ? 'Wipe ALL activity on this browser? There is no undo.' : 'Reset XP, rank and badges to zero? Missions stay done.'}
              </span>
              <button
                type="button"
                className="btn btn--sm"
                style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
                onClick={() => {
                  if (resetMode === 'all') resetEverything();
                  else {
                    resetScore();
                    setResetMode(null);
                    setResetDone('Score reset. Fresh start, same progress.');
                  }
                }}
              >
                {resetMode === 'all' ? 'Yes, reset everything' : 'Yes, reset score'}
              </button>
              <button type="button" className="btn btn--sm btn--ghost" onClick={() => setResetMode(null)}>
                Cancel
              </button>
            </div>
          )}
          {resetDone && <p className="d-note d-good" role="status">{resetDone}</p>}
        </section>
      </section>
    </>
  );
}
