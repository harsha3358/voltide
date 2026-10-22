import { useRef, useState } from 'react';
import { inline } from '../lib/md.js';
import { useSpark } from './Spark.jsx';
import { answer, award } from '../lib/game.js';
import { Alert, Bolt, Check, Drop, Sparkle, Terminal as TermIcon } from './Icons.jsx';

export const Md = ({ as: Tag = 'span', children, ...rest }) => <Tag {...rest} dangerouslySetInnerHTML={inline(children)} />;

// "In plain words", the water/electricity analogy and the jargon list:
// the three helpers every topic gives a first-time learner.
export function Helpers({ plain, analogy, jargon }) {
  if (!plain && !analogy && !jargon?.length) return null;
  const water = analogy?.type === 'water';
  return (
    <div className="helpers" data-reveal>
      {plain && (
        <div className="helper helper--plain">
          <div className="helper__label">
            <Sparkle /> TL;DR
          </div>
          <Md as="p">{plain}</Md>
        </div>
      )}
      {analogy && (
        <div className={`helper ${water ? 'helper--water' : 'helper--electric'}`}>
          <div className="helper__label">
            {water ? <Drop /> : <Bolt />} {water ? 'Water analogy' : 'Electric analogy'}
          </div>
          <Md as="p">{analogy.text}</Md>
        </div>
      )}
      {jargon?.length > 0 && (
        <div className="helper">
          <div className="helper__label">
            <TermIcon /> Jargon, translated
          </div>
          <dl className="jargon">
            {jargon.map(([term, def]) => (
              <div key={term}>
                <dt>{term}</dt>
                <Md as="dd">{def}</Md>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}

export function TermBlock({ cmd, out, label }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  };
  return (
    <div className="term">
      {label && <span className="term__label">{label}</span>}
      {cmd && (
        <>
          <pre>
            {cmd.split('\n').map((line, i) => (
              <div key={i}>
                <span className="prompt">$ </span>
                {line}
              </div>
            ))}
          </pre>
          <button type="button" className="term__copy" onClick={copy}>
            {copied ? 'copied' : 'copy'}
          </button>
        </>
      )}
      {out && (
        <div className="term--out">
          <span className="term__label">EXPECTED OUTPUT (similar)</span>
          <pre>{out}</pre>
        </div>
      )}
    </div>
  );
}

export function Lab({ lab }) {
  return (
    <section className="lab" data-reveal id={lab.id}>
      <div className="lab__head">
        <span className="lab__tag">{lab.tag || 'HANDS-ON LAB'}</span>
        <h3>{lab.title}</h3>
      </div>
      {lab.goal && <Md as="p" className="lab__goal">{lab.goal}</Md>}
      <ol>
        {lab.steps.map((step, i) => (
          <li key={i}>
            <div>
              <Md as="p">{step.do}</Md>
              {(step.cmd || step.out) && <TermBlock cmd={step.cmd} out={step.out} />}
            </div>
          </li>
        ))}
      </ol>
      {lab.safety && (
        <div className="lab__safety">
          <Alert />
          <Md>{lab.safety}</Md>
        </div>
      )}
    </section>
  );
}

const PRAISE = ['Big brain energy. ', 'Correct, and frankly iconic. ', 'W answer. ', 'LAGZILLA felt that. '];
const ROAST = ['Oof. Not quite. ', 'Plot twist: no. ', 'Close, but LAGZILLA is laughing. ', 'Respectfully, no. '];

export function Checkpoint({ check, awardId }) {
  const [picked, setPicked] = useState(null);
  const burst = useSpark();
  const rightRef = useRef(null);
  const choose = i => {
    if (picked !== null) return;
    setPicked(i);
    const right = i === check.answer;
    const combo = answer(right);
    if (right) {
      requestAnimationFrame(() => burst(rightRef.current));
      if (awardId) award(awardId, combo >= 3 ? 100 : 50, combo >= 3 ? `Combo x${combo}: double XP!` : 'Checkpoint cleared');
    }
  };
  return (
    <div className="check" data-reveal>
      <span className="check__tag">⚡ CHECKPOINT · +50 XP</span>
      <Md as="h4">{check.q}</Md>
      <div className="check__options">
        {check.options.map((opt, i) => {
          const state = picked === null ? '' : i === check.answer ? 'is-right' : i === picked ? 'is-wrong' : '';
          return (
            <button
              key={i}
              type="button"
              ref={i === check.answer ? rightRef : undefined}
              className={`check__opt ${state}`}
              onClick={() => choose(i)}
              disabled={picked !== null}
            >
              <b>{state === 'is-right' ? <Check width="14" /> : String.fromCharCode(65 + i)}</b>
              <Md>{opt}</Md>
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div className="check__explain">
          <strong style={{ color: picked === check.answer ? 'var(--ok)' : 'var(--danger)' }}>
            {picked === check.answer ? PRAISE[check.q.length % PRAISE.length] : ROAST[check.q.length % ROAST.length]}
          </strong>
          <Md>{check.explain}</Md>{' '}
          <button type="button" className="btn btn--sm btn--ghost" onClick={() => setPicked(null)} style={{ marginLeft: 6 }}>
            Run it back
          </button>
        </div>
      )}
    </div>
  );
}

// A real photograph loaded from Wikimedia Commons (free-licensed). The credit
// link opens the file page with its author and licence. Offline, a link remains.
export function Photo({ file, caption, alt }) {
  const [failed, setFailed] = useState(false);
  const page = `https://commons.wikimedia.org/wiki/File:${file}`;
  const src = `https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=1400`;
  return (
    <figure className="photo" data-reveal>
      {failed ? (
        <a className="photo__fallback" href={page} target="_blank" rel="noopener noreferrer">
          View photo on Wikimedia Commons ↗
        </a>
      ) : (
        <a href={page} target="_blank" rel="noopener noreferrer">
          <img src={src} alt={alt || caption} loading="lazy" onError={() => setFailed(true)} />
        </a>
      )}
      <figcaption>
        <Md>{caption}</Md>{' '}
        <a href={page} target="_blank" rel="noopener noreferrer">
          Photo: Wikimedia Commons (author &amp; licence) ↗
        </a>
      </figcaption>
    </figure>
  );
}

export function Visual({ caption, note, children }) {
  return (
    <figure className="visual" data-reveal style={{ margin: '28px 0' }}>
      {(caption || note) && (
        <figcaption className="visual__cap">
          <span>{caption}</span>
          {note && <span>{note}</span>}
        </figcaption>
      )}
      {children}
    </figure>
  );
}

export function Demo({ id, title, hint, intro, children }) {
  return (
    <section className="demo" id={id} data-reveal>
      <div className="demo__frame">
        <div className="demo__bar">
          <i />
          <span>LIVE DEMO · {title}</span>
          {hint && <span>{hint}</span>}
        </div>
        <div className="demo__body">
          {intro && <Md as="p" className="demo__intro">{intro}</Md>}
          {children}
        </div>
      </div>
    </section>
  );
}
