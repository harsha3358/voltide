import { useEffect, useMemo, useState } from 'react';
import { award, badge } from '../../../src/lib/game.js';

// Build the team webpage with a live preview, then copy or download the HTML.
const THEMES = [
  ['Electric', '#2b7fff', '#8e51ff'],
  ['Tide', '#0891b2', '#46ecd5'],
  ['Sunset', '#f97316', '#e12afb'],
  ['Forest', '#15803d', '#a3e635']
];
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function readTeam() {
  try {
    const t = JSON.parse(localStorage.getItem('voltide:team'));
    if (t?.name) return t;
  } catch {}
  return null;
}

export function buildHtml({ name, tagline, about, members, theme }) {
  const [, a, b] = THEMES[theme];
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(name)}</title>
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; background: #0b1020; color: #f3f6ff; }
    header { padding: 56px 24px; text-align: center; background: linear-gradient(135deg, ${a}, ${b}); }
    h1 { margin: 0 0 8px; font-size: clamp(2rem, 6vw, 3.2rem); }
    main { max-width: 760px; margin: 0 auto; padding: 28px 24px; }
    .card { padding: 16px 20px; border-radius: 14px; background: #141a33; margin-bottom: 14px; }
    footer { text-align: center; padding: 20px; opacity: 0.7; font-size: 14px; }
  </style>
</head>
<body>
  <header>
    <h1>${esc(name)}</h1>
    <p>${esc(tagline)}</p>
  </header>
  <main>
    <div class="card"><h2>About us</h2><p>${esc(about)}</p></div>
    <div class="card"><h2>Team</h2><p>${esc(members)}</p></div>
    <div class="card"><h2>How it’s hosted</h2><p>AWS EC2 (Ubuntu) + nginx.</p></div>
  </main>
  <footer>Made in VOLTIDE Episode 04</footer>
</body>
</html>`;
}

export default function PageBuilder() {
  const [f, setF] = useState(() => {
    const t = readTeam();
    return {
      name: t?.name || 'Team Nimbus',
      tagline: 'Our first website, deployed on a real cloud server.',
      about: 'First-years who just learned the cloud is someone else’s computer.',
      members: t ? t.people.filter(Boolean).join(' · ') : 'Ravi · Ananya · Kabir · Meera',
      theme: 0
    };
  });
  const [edits, setEdits] = useState(0);
  const [copied, setCopied] = useState(false);
  const html = useMemo(() => buildHtml(f), [f]);
  const set = (k, v) => {
    setF({ ...f, [k]: v });
    setEdits(n => n + 1);
  };
  useEffect(() => {
    if (edits >= 3 && award('demo:page', 80, 'Customised the team webpage')) badge('page-maker');
  }, [edits]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: 'index.html' });
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <div className="split-1-2" style={{ gridTemplateColumns: 'minmax(240px, 0.9fr) minmax(0, 1.4fr)' }}>
      <div className="d-panel" style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
        {[['name', 'Team name'], ['tagline', 'Tagline'], ['about', 'About us'], ['members', 'Members']].map(([k, l]) => (
          <div key={k}>
            <label className="d-label" htmlFor={`pb-${k}`} style={{ marginBottom: 4 }}>{l}</label>
            <input id={`pb-${k}`} className="input" style={{ width: '100%' }} value={f[k]} maxLength={120} onChange={e => set(k, e.target.value)} />
          </div>
        ))}
        <div>
          <span className="d-label" style={{ marginBottom: 4 }}>Colours</span>
          <div className="seg">
            {THEMES.map(([n], i) => <button key={n} type="button" aria-pressed={f.theme === i} onClick={() => set('theme', i)}>{n}</button>)}
          </div>
        </div>
        <div className="d-row">
          <button type="button" className="btn btn--sm btn--primary" onClick={copy}>{copied ? '✓ Copied' : 'Copy HTML'}</button>
          <button type="button" className="btn btn--sm" onClick={download}>⬇ Download index.html</button>
        </div>
        <p className="d-note" style={{ margin: 0 }}>Change at least three things for the badge. Your page, your vibe.</p>
      </div>
      <div className="d-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="d-row" style={{ padding: '8px 12px', borderBottom: '1px solid var(--line)', fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--muted)' }}>
          <span>● ● ●</span><span>http://13.233.10.7/</span>
        </div>
        <iframe title="Live preview of your team page" srcDoc={html} sandbox="" style={{ width: '100%', height: 380, border: 0, background: '#0b1020', display: 'block' }} />
      </div>
    </div>
  );
}
