import { lazy, Suspense } from 'react';
import { useEffects } from '../lib/effects.jsx';

// Full-viewport animated backgrounds from React Bits, loaded on demand so a
// session only downloads its own effect. Lite mode swaps in a CSS gradient.
const FX = {
  world: lazy(() => import('./World3D.jsx')),
  lightning: lazy(() => import('../vendor/reactbits/Lightning/Lightning.jsx')),
  ether: lazy(() => import('../vendor/reactbits/LiquidEther/LiquidEther.jsx')),
  threads: lazy(() => import('../vendor/reactbits/Threads/Threads.jsx')),
  chrome: lazy(() => import('../vendor/reactbits/LiquidChrome/LiquidChrome.jsx')),
  terminal: lazy(() => import('../vendor/reactbits/FaultyTerminal/FaultyTerminal.jsx'))
};

const PRESETS = {
  world: { palette: { deep: '#0b3a66', crest: '#53eafd', flash: '#ffdf20', core: '#8e51ff' }, mood: 'spark' },
  lightning: { color: '#7df9ff', bolts: 2, branches: 0.6, glow: 1.2, intensity: 0.9, speed: 0.7, flicker: 0.7, xOffset: 0.35, angle: -8, mouseStrength: 0.6 },
  ether: { colors: ['#0b3dff', '#2ee6c5', '#7df9ff'], intensity: 1.6, mouseForce: 18, cursorSize: 110, resolution: 0.45, autoDemo: true, autoSpeed: 0.45 },
  threads: { color: [0.3, 0.55, 1], accentColor: [0.49, 0.98, 1], amplitude: 1.4, lineCount: 70, speed: 0.45, brightness: 1.2, enableMouseInteraction: true },
  chrome: { color: '#1aa89a', speed: 0.14, amplitude: 0.28, roughness: 0.45, exposure: 0.75, interactive: true, depth: 1.1 },
  terminal: { tint: '#b56cff', glyphs: 'characters', scale: 1.4, timeScale: 0.25, brightness: 0.55, scanlineIntensity: 0.35, curvature: 0.12, glitchAmount: 0.8, mouseReact: true, vignette: 0.45 }
};

export default function Backdrop({ kind = 'world', opacity = 0.85, props }) {
  const { lite } = useEffects();
  const Fx = FX[kind];
  return (
    <div className="backdrop" aria-hidden="true" style={{ '--backdrop-opacity': opacity }}>
      {lite || !Fx ? (
        <div className="backdrop__lite" />
      ) : (
        <div className="backdrop__fx">
          <Suspense fallback={<div className="backdrop__lite" />}>
            <Fx {...PRESETS[kind]} {...props} />
          </Suspense>
        </div>
      )}
      <div className="backdrop__veil" />
    </div>
  );
}
