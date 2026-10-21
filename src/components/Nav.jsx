import { SESSIONS } from '../../sessions/index.js';
import { href } from '../lib/router.js';
import { isUnlocked, useLockVersion } from '../lib/lock.js';
import { useEffects } from '../lib/effects.jsx';
import Logo from './Logo.jsx';
import { Book, Bolt, Lock, Search } from './Icons.jsx';
import { SoundToggle, XPMeter } from './XPMeter.jsx';

export default function Nav({ route }) {
  useLockVersion();
  const { lite, setLite } = useEffects();
  return (
    <header className="nav">
      <div className="wrap nav__inner">
        <a className="brand" href={href.home()} aria-label="VOLTIDE home">
          <Logo />
          <span>VOLTIDE</span>
        </a>
        <nav className="nav__sessions" aria-label="Sessions">
          {SESSIONS.map(s => {
            const open = isUnlocked(s);
            const current = route.name === 'session' && route.session === s.number;
            return (
              <a
                key={s.number}
                className="pill"
                href={href.session(s.number)}
                aria-current={current ? 'page' : undefined}
                style={{ '--pill-accent': s.accent }}
                title={`Session ${s.number}: ${s.title}${open ? '' : ' (locked)'}`}
              >
                {open ? <span className="pill__dot" /> : <Lock />}
                <span>0{s.number}</span>
                <span className="nav__label">{s.name}</span>
              </a>
            );
          })}
        </nav>
        <XPMeter />
        <div className="nav__tools">
          <a className="icon-btn" href={href.glossary()} title="Jargon Buster (glossary)" aria-label="Glossary">
            <Search />
          </a>
          <a className="icon-btn" href={href.handbook()} title="Handbook: how this walkthrough works" aria-label="Handbook">
            <Book />
          </a>
          <SoundToggle />
          <button
            type="button"
            className="icon-btn"
            aria-pressed={!lite}
            onClick={() => setLite(!lite)}
            title={lite ? 'Effects: LITE. Click for full effects' : 'Effects: FULL. Click for lite mode (older PCs)'}
            aria-label="Toggle visual effects"
          >
            <Bolt />
          </button>
        </div>
      </div>
    </header>
  );
}
