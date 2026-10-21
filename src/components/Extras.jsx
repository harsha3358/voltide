import { useEffect, useState } from 'react';
import { scrollToTop } from '../lib/motion.js';

// Small quality-of-life pieces: scroll progress, back-to-top, copy-link.
export function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setP(max > 0 ? window.scrollY / max : 0);
      });
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
    };
  }, []);
  return <div className="scroll-progress" style={{ transform: `scaleX(${p})` }} aria-hidden="true" />;
}

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 1.2);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  if (!show) return null;
  return (
    <button type="button" className="to-top" onClick={() => scrollToTop(false)} aria-label="Back to top" title="Back to top">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}

export function CopyLink({ hash }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    const url = `${window.location.origin}${window.location.pathname}${hash}`;
    try {
      await navigator.clipboard.writeText(url);
      setDone(true);
      setTimeout(() => setDone(false), 1500);
    } catch {
      window.location.hash = hash;
    }
  };
  return (
    <button type="button" className="btn btn--sm btn--ghost" onClick={copy} title="Copy a link to this mission">
      {done ? 'Link copied ✓' : 'Copy mission link'}
    </button>
  );
}

const LAST = 'voltide:last';
export const rememberTopic = (session, topic, title) => {
  try {
    localStorage.setItem(LAST, JSON.stringify({ session, topic, title }));
  } catch {}
};
export const lastTopic = () => {
  try {
    return JSON.parse(localStorage.getItem(LAST) || 'null');
  } catch {
    return null;
  }
};
