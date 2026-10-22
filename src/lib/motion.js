import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, DrawSVGPlugin);

let lenis = null;
const tick = time => lenis?.raf(time * 1000);

export function startSmoothScroll() {
  if (lenis) return;
  lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
}

export function stopSmoothScroll() {
  if (!lenis) return;
  gsap.ticker.remove(tick);
  lenis.destroy();
  lenis = null;
}

export function scrollToElement(el, offset = -96) {
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.2 });
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: 'smooth' });
}

// Instant version, used to correct a deep-link scroll after late layout shifts.
export function jumpToElement(el, offset = -96) {
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  if (lenis) lenis.scrollTo(top, { immediate: true });
  else window.scrollTo(0, top);
}

export function scrollToTop(immediate = true) {
  if (lenis) lenis.scrollTo(0, { immediate });
  else window.scrollTo(0, 0);
}

export { gsap, ScrollTrigger };
