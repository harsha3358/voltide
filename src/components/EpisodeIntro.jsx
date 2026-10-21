import { useState } from 'react';
import TextType from '../vendor/reactbits/TextType/TextType.jsx';
import GlitchText from '../vendor/reactbits/GlitchText/GlitchText.jsx';
import Volty from './Volty.jsx';
import { sfx } from '../lib/game.js';

// "Incoming transmission" cut-scene shown the first time a session opens.
const seenKey = n => `voltide:episode:${n}`;

export default function EpisodeIntro({ session, episode }) {
  const [open, setOpen] = useState(() => {
    try {
      return !localStorage.getItem(seenKey(session.number));
    } catch {
      return true;
    }
  });
  if (!open || !episode) return null;
  const close = () => {
    try {
      localStorage.setItem(seenKey(session.number), '1');
    } catch {}
    sfx('up');
    setOpen(false);
  };
  return (
    <div className="episode" role="dialog" aria-modal="true" aria-label={`Episode ${session.number} briefing`}>
      <div className="episode__card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Volty size={64} mood="shock" />
          <span className="kicker">Incoming transmission · Episode 0{session.number}</span>
        </div>
        <h2>
          <GlitchText speed={0.8} intensity={0.35} enableShadows fontSize="clamp(1.3rem, 4vw, 2rem)" shadowColors={['#ff4d6d', session.accent]}>
            {episode.title}
          </GlitchText>
        </h2>
        <div className="episode__lines">
          <TextType text={[episode.lines.join('\n')]} typingSpeed={22} loop={false} cursorCharacter="▌" />
        </div>
        <div className="d-row" style={{ marginTop: 20 }}>
          <button type="button" className="btn btn--primary" onClick={close} autoFocus>
            ⚡ Accept mission
          </button>
          <span className="d-note" style={{ margin: 0 }}>Reward pool: {episode.reward}</span>
        </div>
      </div>
    </div>
  );
}
