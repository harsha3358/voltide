import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../../src/lib/motion.js';

// Serverless: no server waiting around. An event (a photo upload) wakes a
// function, it runs for a few milliseconds, you pay for exactly that.
export default function ServerlessTrigger() {
  const ref = useRef(null);
  const [runs, setRuns] = useState([]);
  const { contextSafe } = useGSAP({ scope: ref });
  const upload = contextSafe(() => {
    const ms = 80 + Math.floor(Math.random() * 120);
    gsap.timeline()
      .fromTo('.sv-file', { x: 0, opacity: 1 }, { x: 250, duration: 0.6, ease: 'power2.in' })
      .to('.sv-fn', { scale: 1.15, transformOrigin: 'center', yoyo: true, repeat: 1, duration: 0.15 })
      .fromTo('.sv-thumb', { x: 250, opacity: 0 }, { x: 500, opacity: 1, duration: 0.6, ease: 'power2.out' })
      .call(() => setRuns(r => [{ ms, at: new Date().toLocaleTimeString() }, ...r].slice(0, 5)));
  });
  const total = runs.reduce((n, r) => n + r.ms, 0);
  return (
    <div ref={ref}>
      <svg viewBox="0 0 640 140">
        <text x="40" y="128" fontFamily="Space Grotesk" fontSize="13" fill="var(--text-soft)">S3 bucket: uploads/</text>
        <text x="270" y="128" fontFamily="Space Grotesk" fontSize="13" fill="var(--text-soft)">λ make-thumbnail</text>
        <text x="520" y="128" fontFamily="Space Grotesk" fontSize="13" fill="var(--text-soft)">thumbnails/</text>
        <rect x="20" y="30" width="120" height="76" rx="14" fill="#0b1820" stroke="var(--line-strong)" />
        <rect x="500" y="30" width="120" height="76" rx="14" fill="#0b1820" stroke="var(--line-strong)" />
        <g className="sv-fn"><circle cx="320" cy="68" r="38" fill="#1a1204" stroke="var(--spark)" strokeWidth="2.5" /><text x="320" y="79" textAnchor="middle" fontSize="30" fill="var(--spark)">λ</text></g>
        <g className="sv-file" opacity="0"><rect x="50" y="48" width="60" height="40" rx="6" fill="var(--accent)" /><text x="80" y="73" textAnchor="middle" fontSize="12" fontFamily="JetBrains Mono" fill="#04101f">fest.jpg</text></g>
        <g className="sv-thumb" opacity="0"><rect x="30" y="54" width="40" height="28" rx="5" fill="var(--ok)" /><text x="50" y="72" textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill="#04101f">thumb</text></g>
      </svg>
      <div className="d-row">
        <button type="button" className="btn btn--sm btn--primary" onClick={upload}>📤 Upload a photo</button>
        <span className="d-note" style={{ margin: 0 }}>Function ran {runs.length} times · billed {total} ms total · idle cost: ₹0</span>
      </div>
      {runs.length > 0 && <pre className="code-view" style={{ marginTop: 10 }}>{runs.map(r => `${r.at}  START  make-thumbnail  Duration: ${r.ms} ms  Billed: ${r.ms} ms`).join('\n')}</pre>}
    </div>
  );
}
