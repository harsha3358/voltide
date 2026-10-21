import { rankFor, setSound, useGame } from '../lib/game.js';

// Top-bar XP capsule: rank name + a liquid bar that fills toward the next rank.
export function XPMeter() {
  const g = useGame();
  const r = rankFor(g.xp);
  const pct = r.next ? ((g.xp - r.floor) / (r.next - r.floor)) * 100 : 100;
  return (
    <a className="xpm" href="#/profile" title={r.next ? `${r.next - g.xp} XP to ${r.nextName}` : 'Max rank!'} aria-label={`Profile: ${r.name}, ${g.xp} XP`}>
      <span className="xpm__rank">{r.name}</span>
      <span className="xpm__bar">
        <i style={{ width: `${pct}%` }} />
      </span>
      <span className="xpm__xp">{g.xp} XP</span>
      {g.combo >= 2 && <span className="xpm__combo">x{g.combo}</span>}
    </a>
  );
}

export function SoundToggle() {
  const g = useGame();
  return (
    <button type="button" className="icon-btn" aria-pressed={g.sound} onClick={() => setSound(!g.sound)} title={g.sound ? 'Sound effects on' : 'Sound effects off'} aria-label="Toggle sound effects">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 9v6h4l5 4V5L8 9z" />
        {g.sound ? <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" /> : <path d="m17 9 5 6M22 9l-5 6" />}
      </svg>
    </button>
  );
}
