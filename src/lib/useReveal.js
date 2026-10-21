import { useLayoutEffect } from 'react';
import { gsap } from './motion.js';

// Fades and lifts every [data-reveal] child of `scope` as it scrolls into view.
// Positions are read live on each (rAF-throttled) scroll, so demos above can
// change height freely, and anything already above the fold, including
// content jumped past by a deep link, is revealed at once and never stays hidden.
export function useReveal(scope, deps = []) {
  useLayoutEffect(() => {
    const root = scope.current;
    if (!root) return;
    let pending = [...root.querySelectorAll('[data-reveal]')];
    if (!pending.length) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    gsap.set(pending, { autoAlpha: 0, y: 26 });
    let frame = 0;
    const check = () => {
      frame = 0;
      const limit = window.innerHeight * 0.94;
      const show = [];
      const passed = [];
      pending = pending.filter(el => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0) passed.push(el);
        else if (r.top < limit) show.push(el);
        else return true;
        return false;
      });
      // Jumped past (deep link, fast scroll): appear instantly instead of queueing.
      if (passed.length) gsap.set(passed, { autoAlpha: 1, y: 0, overwrite: true });
      if (show.length)
        gsap.to(show, { autoAlpha: 1, y: 0, duration: 0.75, ease: 'power3.out', stagger: { amount: Math.min(0.45, show.length * 0.07) }, overwrite: true });
      if (!pending.length) stop();
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    const stop = () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      stop();
      cancelAnimationFrame(frame);
      gsap.set(root.querySelectorAll('[data-reveal]'), { clearProps: 'opacity,visibility,transform' });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
