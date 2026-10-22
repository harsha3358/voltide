import { useEffect, useMemo, useState } from 'react';
import { GLOSSARY } from '../data/glossary.js';
import { href } from '../lib/router.js';
import { scrollToElement } from '../lib/motion.js';
import Backdrop from '../components/Backdrop.jsx';
import { Arrow } from '../components/Icons.jsx';

const slug = t => t.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export default function Glossary({ route }) {
  const [q, setQ] = useState('');
  const list = useMemo(() => GLOSSARY.filter(([t, d]) => `${t} ${d}`.toLowerCase().includes(q.toLowerCase())), [q]);
  const letters = [...new Set(GLOSSARY.map(([t]) => t[0].toUpperCase()))];
  useEffect(() => {
    if (!route.term) return;
    const t = setTimeout(() => scrollToElement(document.getElementById(`term-${slug(route.term)}`)), 120);
    return () => clearTimeout(t);
  }, [route.term]);
  return (
    <>
      <Backdrop kind="world" opacity={0.3} />
      <section className="wrap glossary">
        <h1 style={{ fontSize: 'clamp(2.4rem, 7vw, 4.4rem)' }}>Jargon buster</h1>
        <p style={{ color: 'var(--text-soft)', maxWidth: 640 }}>Every scary word from the walkthrough, translated into human, with a link to where it’s taught.</p>
        <div className="glossary__search">
          <input className="input" value={q} onChange={e => setQ(e.target.value)} placeholder="Search a word…" aria-label="Search the glossary" />
        </div>
        <nav className="glossary__letters" aria-label="Jump to letter">
          {letters.map(l => (
            <a key={l} href={href.glossary(GLOSSARY.find(([t]) => t[0].toUpperCase() === l)[0])}>{l}</a>
          ))}
        </nav>
        <div className="glossary__list">
          {list.map(([term, def, s, topic]) => (
            <article key={term} id={`term-${slug(term)}`} className={`term-card ${route.term && slug(route.term) === slug(term) ? 'is-target' : ''}`}>
              <h3>{term}</h3>
              <p>{def}</p>
              <div className="term-card__foot">
                <span className="chip">Episode 0{s}</span>
                <a href={href.topic(s, topic)}>
                  Learn it <Arrow width="13" style={{ verticalAlign: '-2px' }} />
                </a>
              </div>
            </article>
          ))}
          {!list.length && <p>No match. Try a shorter word.</p>}
        </div>
      </section>
    </>
  );
}
