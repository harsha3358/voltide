import GlitchText from '../vendor/reactbits/GlitchText/GlitchText.jsx';
import DecryptedText from '../vendor/reactbits/DecryptedText/DecryptedText.jsx';
import UnlockForm from './UnlockForm.jsx';
import { href } from '../lib/router.js';
import { Back, Lock } from './Icons.jsx';

export default function LockGate({ session, teaser = [] }) {
  return (
    <section className="gate">
      <div className="wrap">
        <div className="gate__panel">
          <span className="kicker">
            Episode 0{session.number} · {session.name}
          </span>
          <div style={{ margin: '18px 0 10px' }}>
            <GlitchText speed={0.6} intensity={0.55} mode="slices" fontSize="clamp(2.6rem, 9vw, 5.5rem)" shadowColors={['#ff4d6d', session.accent]}>
              LOCKED
            </GlitchText>
          </div>
          <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>
            <DecryptedText text={session.title} animateOn="view" sequential speed={22} />
          </h2>
          <p style={{ color: 'var(--text-soft)', fontSize: '1.08rem' }}>
            {session.tagline} Nice try, though. This episode opens when your facilitator drops the code in class.
          </p>
          {teaser.length > 0 && (
            <div className="gate__teaser" aria-label="Coming up">
              {teaser.map(t => (
                <span key={t} className="chip">
                  <Lock width="12" /> {t}
                </span>
              ))}
            </div>
          )}
          <div className="card" style={{ marginTop: 10 }}>
            <strong>Facilitator unlock</strong>
            <p style={{ color: 'var(--muted)', fontSize: 14, margin: '4px 0 0' }}>
              Codes are in <code>facilitator/README.md</code>.
            </p>
            <UnlockForm session={session} />
          </div>
          <p style={{ marginTop: 22 }}>
            <a className="btn btn--ghost btn--sm" href={href.home()}>
              <Back /> Retreat to safety
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
