import { useEffect, useRef } from 'react';
import { useEffects } from '../lib/effects.jsx';

// Lazy-loads one of the 3D motion scenes in src/three/scenes and mounts it on
// a canvas. In lite mode (or with reduced motion) it renders a calm gradient
// instead, so slow lab PCs never touch WebGL for it.
const SCENES = {
  globe: () => import('../three/scenes/globe.js'),
  cloud: () => import('../three/scenes/cloud.js'),
  network: () => import('../three/scenes/network.js'),
  rack: () => import('../three/scenes/rack.js'),
  city: () => import('../three/scenes/city.js'),
  layers: () => import('../three/scenes/layers.js')
};

export default function Scene3D({ name, params = {}, className = '', label, hint }) {
  const { lite } = useEffects();
  const canvas = useRef(null);
  const inst = useRef(null);
  const latest = useRef(params);
  latest.current = params;
  const key = JSON.stringify(params);

  useEffect(() => {
    if (lite || !SCENES[name]) return;
    let dead = false;
    Promise.all([SCENES[name](), import('../three/engine.js')])
      .then(([mod, engine]) => {
        if (dead || !canvas.current) return;
        try {
          inst.current = engine.mountScene(canvas.current, mod.default, latest.current);
          canvas.current.classList.add('is-ready');
        } catch {
          // No WebGL on this machine: the gradient behind the canvas stays.
        }
      })
      .catch(() => {});
    return () => {
      dead = true;
      inst.current?.dispose();
      inst.current = null;
    };
  }, [name, lite]);

  useEffect(() => {
    inst.current?.api.set?.(latest.current);
  }, [key]);

  return (
    <div className={`scene3d ${lite ? 'scene3d--lite' : ''} ${className}`} role="img" aria-label={label}>
      {!lite && <canvas ref={canvas} />}
      {hint && !lite && <span className="scene3d__hint">{hint}</span>}
    </div>
  );
}
