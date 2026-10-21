import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const KEY = 'voltide:lite';
const EffectsContext = createContext({ lite: false, setLite: () => {} });

// "Lite" swaps WebGL backgrounds for CSS gradients and turns off smooth scrolling,
// for older lab PCs, projectors over HDMI splitters and reduced-motion users.
function initialLite() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved !== null) return saved === '1';
  } catch {}
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const weak = (navigator.hardwareConcurrency || 8) <= 2;
  return Boolean(reduced || weak);
}

export function EffectsProvider({ children }) {
  const [lite, setLite] = useState(initialLite);
  useEffect(() => {
    document.documentElement.dataset.lite = lite ? '1' : '0';
    try {
      localStorage.setItem(KEY, lite ? '1' : '0');
    } catch {}
  }, [lite]);
  const value = useMemo(() => ({ lite, setLite }), [lite]);
  return <EffectsContext.Provider value={value}>{children}</EffectsContext.Provider>;
}

export const useEffects = () => useContext(EffectsContext);
