import { createContext, useCallback, useContext, useRef } from 'react';
import ClickSpark from '../vendor/reactbits/ClickSpark/ClickSpark.jsx';

const SparkContext = createContext(() => {});

// Wraps the app in React Bits ClickSpark (every click throws electric sparks)
// and exposes `burst(element)` for celebrating a right answer or solved flag.
export function SparkProvider({ children }) {
  const ref = useRef(null);
  const burst = useCallback(el => {
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    ref.current?.spark(x, y);
    setTimeout(() => ref.current?.spark(x - 30, y - 10), 120);
    setTimeout(() => ref.current?.spark(x + 30, y + 6), 220);
  }, []);
  return (
    <ClickSpark ref={ref} sparkColor={['#7df9ff', '#ffd23f', '#2ee6c5']} sparkCount={10} sparkRadius={34} sparkSize={12} glow={0.6} shape="streak" duration={520}>
      <SparkContext.Provider value={burst}>{children}</SparkContext.Provider>
    </ClickSpark>
  );
}

export const useSpark = () => useContext(SparkContext);
