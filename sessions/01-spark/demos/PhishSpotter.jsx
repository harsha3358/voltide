import { useEffect, useRef, useState } from 'react';
import { award, badge } from '../../../src/lib/game.js';
import { useSpark } from '../../../src/components/Spark.jsx';
import './spark.css';

// A fictional phishing email with six hidden red flags. The X-ray lens peels
// back the "skin" of the email and shows what is really underneath, an
// illusion that teaches the core idea: what you see is not what you get.
const FLAGS = {
  sender: ['Look-alike sender', 'The real company is campuspay.in. This is “campuspay-secure.co”, a domain anyone can buy for a few hundred rupees.'],
  urgency: ['Panic and a deadline', '“2 hours” and CAPITAL LETTERS are there to rush you so you do not stop and think.'],
  greeting: ['Generic greeting', 'A real service knows your name. “Dear Student” means the email went to thousands of people at once.'],
  link: ['The link lies', 'The button says CampusPay, but the real address (the X-ray shows it) goes to a completely different site.'],
  attachment: ['Double extension', '“.pdf.exe” is a program pretending to be a document. Opening it runs it.'],
  typo: ['Spelling slips', '“recieve” and “acount”: rushed attacker copy. Real companies proofread.']
};

function Flag({ id, found, onFind, children }) {
  return (
    <span className={`phish-flag ${found ? 'is-found' : ''}`} role="button" tabIndex={0} onClick={e => onFind(id, e.currentTarget)} onKeyDown={e => e.key === 'Enter' && onFind(id, e.currentTarget)}>
      {children}
    </span>
  );
}

function Email({ xray, found = new Set(), onFind = () => {} }) {
  const F = (id, normal, truth) => (xray ? <span className="xr-truth">{truth}</span> : <Flag id={id} found={found.has(id)} onFind={onFind}>{normal}</Flag>);
  return (
    <div className={`phish-mail ${xray ? 'phish-mail--xray' : ''}`}>
      <div className="phish-mail__row">
        <span className="phish-mail__k">From</span>
        <span>CampusPay Support &lt;{F('sender', 'support@campuspay-secure.co', 'support@campuspay-secure.co ≠ campuspay.in')}&gt;</span>
      </div>
      <div className="phish-mail__row">
        <span className="phish-mail__k">Subject</span>
        <strong>{F('urgency', '⚠ URGENT: Your scholarship will be CANCELLED in 2 hours', 'PRESSURE TACTIC: rush the victim')}</strong>
      </div>
      <div className="phish-mail__body">
        <p>{F('greeting', 'Dear Student,', 'Dear <bulk list of 40,000 emails>,')}</p>
        <p>
          We detected unusual activity on your scholarship {F('typo', 'acount', 'typo: account')}. To continue to{' '}
          {xray ? <span className="xr-truth">typo: receive</span> : <Flag id="typo" found={found.has('typo')} onFind={onFind}>recieve</Flag>} your ₹25,000
          payment, verify your login details immediately.
        </p>
        <p style={{ textAlign: 'center' }}>
          {xray ? (
            <span className="xr-truth xr-url">http://campuspay.verify-login.top/steal.php</span>
          ) : (
            <Flag id="link" found={found.has('link')} onFind={onFind}>
              <span className="phish-btn">Verify on CampusPay →</span>
            </Flag>
          )}
        </p>
        <p className="phish-mail__att">
          📎 {F('attachment', 'Scholarship_Form.pdf.exe', 'Scholarship_Form.pdf.exe = a PROGRAM, not a PDF')}
        </p>
        <p style={{ marginBottom: 0 }}>Regards,<br />CampusPay Security Team</p>
      </div>
    </div>
  );
}

function Homoglyph() {
  const [reveal, setReveal] = useState(false);
  const real = 'campuspay.in';
  const fake = 'cаmpuspay.in';
  const row = s => (
    <div className="glyph-row">
      {[...s].map((ch, i) => {
        const odd = ch.charCodeAt(0) > 127;
        return (
          <span key={i} className={`glyph ${reveal && odd ? 'glyph--odd' : ''}`}>
            <b>{ch}</b>
            {reveal && <small>U+{ch.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}</small>}
          </span>
        );
      })}
    </div>
  );
  return (
    <div className="d-panel" style={{ marginTop: 16 }}>
      <span className="d-label">Illusion: are these two addresses the same?</span>
      <div className="d-grid">
        <div>
          <span className="d-note">Link A</span>
          {row(real)}
        </div>
        <div>
          <span className="d-note">Link B</span>
          {row(fake)}
        </div>
      </div>
      <div className="d-row" style={{ marginTop: 12 }}>
        <button
          type="button"
          className="btn btn--sm"
          onClick={() => {
            if (!reveal && award('demo:homoglyph', 40, 'Illusion broken')) badge('illusionist');
            setReveal(r => !r);
          }}
        >
          {reveal ? 'Hide the trick' : '🔍 Reveal the illusion'}
        </button>
        {reveal && (
          <span className="d-note" style={{ margin: 0 }}>
            The second “a” is the <strong>Cyrillic letter а (U+0430)</strong>, not the English a (U+0061). Your eyes see the same
            word; the computer sees a different website. This is a <strong>homoglyph attack</strong>.
          </span>
        )}
      </div>
    </div>
  );
}

export default function PhishSpotter() {
  const [found, setFound] = useState(() => new Set());
  const [lens, setLens] = useState(false);
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const burst = useSpark();
  const stage = useRef(null);
  useEffect(() => {
    if (found.size === 6 && award('demo:phish', 120, 'All 6 red flags found')) badge('phish-slayer');
  }, [found]);
  const onFind = (id, el) => {
    if (found.has(id)) return;
    setFound(new Set(found).add(id));
    burst(el);
  };
  const move = e => {
    const r = stage.current.getBoundingClientRect();
    const p = e.touches?.[0] || e;
    setPos({ x: p.clientX - r.left, y: p.clientY - r.top });
  };
  return (
    <div>
      <div className="d-row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
        <span className="badge" style={{ color: found.size === 6 ? 'var(--ok)' : 'var(--spark)' }}>
          🚩 Red flags found: {found.size} / 6
        </span>
        <div className="seg">
          <button type="button" aria-pressed={!lens} onClick={() => setLens(false)}>
            Hunt mode
          </button>
          <button type="button" aria-pressed={lens} onClick={() => setLens(true)}>
            🩻 X-ray lens
          </button>
        </div>
      </div>
      <div ref={stage} className={`phish-stage ${lens ? 'has-lens' : ''}`} onMouseMove={lens ? move : undefined} onTouchMove={lens ? move : undefined} style={{ '--lx': `${pos.x}px`, '--ly': `${pos.y}px` }}>
        <Email found={found} onFind={onFind} />
        {lens && (
          <div className="phish-xray" aria-hidden="true">
            <Email xray />
          </div>
        )}
        {lens && <div className="phish-lens-ring" aria-hidden="true" />}
      </div>
      <p className="d-note">{lens ? 'Move the lens over the email to see what is really underneath.' : 'Click (or tap) anything that looks suspicious.'}</p>
      {found.size > 0 && (
        <div className="d-grid" style={{ marginTop: 12 }}>
          {Object.entries(FLAGS)
            .filter(([k]) => found.has(k))
            .map(([k, [t, d]]) => (
              <div key={k} className="d-panel" style={{ borderColor: 'rgba(255,77,109,.35)' }}>
                <strong className="d-bad">🚩 {t}</strong>
                <p className="d-note" style={{ marginTop: 6 }}>{d}</p>
              </div>
            ))}
        </div>
      )}
      <Homoglyph />
    </div>
  );
}
