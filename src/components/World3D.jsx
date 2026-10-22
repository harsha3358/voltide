import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { onTint } from '../lib/missionThemes.js';

// VOLTIDE WORLD: the 3D motion background.
// A night ocean made of glowing data points, lightning that strikes the water
// and sends ripple rings across it, a floating wireframe crystal (the
// villain's core) and sparks drifting up. The camera drifts, follows the pointer and
// dives toward the water as the page scrolls.
const MOODS = {
  spark: { bolts: 1.0, waves: 1.0, core: 1.0 },
  current: { bolts: 0.7, waves: 0.8, core: 0.8 },
  tide: { bolts: 0.35, waves: 1.35, core: 0.6 },
  surge: { bolts: 1.3, waves: 1.1, core: 1.3 }
};

const OCEAN_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uWaves;
  uniform vec3 uStrike;      // x, z, start time
  varying float vHeight;
  varying float vRing;
  varying float vDist;
  float wave(vec2 p, vec2 d, float f, float s, float a) { return sin(dot(p, d) * f + uTime * s) * a; }
  void main() {
    vec3 p = position;
    float h = 0.0;
    h += wave(p.xz, normalize(vec2(1.0, 0.3)), 0.35, 0.9, 0.55);
    h += wave(p.xz, normalize(vec2(-0.4, 1.0)), 0.6, 1.3, 0.28);
    h += wave(p.xz, normalize(vec2(0.8, -0.7)), 1.1, 1.9, 0.12);
    h *= uWaves;
    float age = uTime - uStrike.z;
    float d = distance(p.xz, uStrike.xy);
    float ring = exp(-pow((d - age * 9.0) * 0.9, 2.0)) * exp(-age * 0.9) * step(0.0, age);
    h += ring * 0.9;
    p.y += h;
    vHeight = h;
    vRing = ring;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vDist = -mv.z;
    gl_PointSize = (1.6 + ring * 4.0 + max(h, 0.0) * 1.5) * (38.0 / vDist);
    gl_Position = projectionMatrix * mv;
  }
`;

const OCEAN_FRAG = /* glsl */ `
  uniform vec3 uDeep;
  uniform vec3 uCrest;
  uniform vec3 uFlash;
  varying float vHeight;
  varying float vRing;
  varying float vDist;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float a = smoothstep(0.5, 0.0, length(c));
    vec3 col = mix(uDeep, uCrest, smoothstep(-0.6, 0.9, vHeight));
    col = mix(col, uFlash, clamp(vRing * 1.6, 0.0, 1.0));
    float fog = smoothstep(70.0, 12.0, vDist);
    gl_FragColor = vec4(col, a * fog * (0.55 + vRing));
  }
`;

function jaggedBolt(x, z, top = 26) {
  const pts = [];
  let px = x + (Math.random() - 0.5) * 8;
  let pz = z + (Math.random() - 0.5) * 4;
  const steps = 22;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    px += (Math.random() - 0.5) * 2.2;
    pz += (Math.random() - 0.5) * 1.2;
    const k = t * t;
    pts.push(new THREE.Vector3(px * (1 - k) + x * k, top * (1 - t), pz * (1 - k) + z * k));
  }
  return pts;
}

export default function World3D({ palette = {}, mood = 'spark', opacity = 1 }) {
  const mount = useRef(null);
  useEffect(() => {
    const el = mount.current;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const M = MOODS[mood] || MOODS.spark;
    const C = {
      deep: new THREE.Color(palette.deep || '#0b3a66'),
      crest: new THREE.Color(palette.crest || '#53eafd'),
      flash: new THREE.Color(palette.flash || '#ffdf20'),
      core: new THREE.Color(palette.core || '#8e51ff')
    };
    // Each mission can tint the ocean; the colours blend over about a second.
    const BASE = { deep: C.deep.clone(), crest: C.crest.clone(), flash: C.flash.clone() };
    const T = { deep: BASE.deep.clone(), crest: BASE.crest.clone(), flash: BASE.flash.clone() };
    const offTint = onTint(t => {
      T.deep.set(t?.deep || BASE.deep);
      T.crest.set(t?.crest || BASE.crest);
      T.flash.set(t?.flash || BASE.flash);
    });

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05080a, 0.028);
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);

    // Ocean of points
    const SEG = 158;
    const geo = new THREE.PlaneGeometry(90, 90, SEG, SEG);
    geo.rotateX(-Math.PI / 2);
    const oceanMat = new THREE.ShaderMaterial({
      vertexShader: OCEAN_VERT,
      fragmentShader: OCEAN_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uWaves: { value: M.waves },
        uStrike: { value: new THREE.Vector3(0, 0, -100) },
        uDeep: { value: C.deep },
        uCrest: { value: C.crest },
        uFlash: { value: C.flash }
      }
    });
    const ocean = new THREE.Points(geo, oceanMat);
    scene.add(ocean);

    // Villain core: nested wireframe crystals with a glowing heart
    const core = new THREE.Group();
    const outer = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(3.2, 1)),
      new THREE.LineBasicMaterial({ color: C.core, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending })
    );
    const inner = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.OctahedronGeometry(1.8, 0)),
      new THREE.LineBasicMaterial({ color: C.crest, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending })
    );
    const heart = new THREE.Mesh(
      new THREE.SphereGeometry(0.75, 24, 24),
      new THREE.MeshBasicMaterial({ color: C.flash, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending })
    );
    core.add(outer, inner, heart);
    core.position.set(-1, 12, -22);
    core.scale.setScalar(M.core);
    scene.add(core);

    // Sparks rising from the water
    const SPARKS = 420;
    const sparkPos = new Float32Array(SPARKS * 3);
    const sparkVel = new Float32Array(SPARKS);
    for (let i = 0; i < SPARKS; i++) {
      sparkPos[i * 3] = (Math.random() - 0.5) * 70;
      sparkPos[i * 3 + 1] = Math.random() * 18;
      sparkPos[i * 3 + 2] = (Math.random() - 0.5) * 70;
      sparkVel[i] = 0.6 + Math.random() * 1.6;
    }
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    const sparks = new THREE.Points(
      sparkGeo,
      new THREE.PointsMaterial({ color: C.flash, size: 0.09, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    scene.add(sparks);

    // Lightning: a pool of bolts re-shaped on every strike
    const bolts = Array.from({ length: 3 }, () => {
      const g = new THREE.BufferGeometry();
      const glow = new THREE.Line(g, new THREE.LineBasicMaterial({ color: C.flash, transparent: true, opacity: 0, blending: THREE.AdditiveBlending }));
      const coreLine = new THREE.Line(g, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending }));
      scene.add(glow, coreLine);
      return { g, glow, coreLine, life: 0 };
    });
    const flashLight = { v: 0 };

    let next = 1.2;
    const strike = t => {
      const b = bolts.find(x => x.life <= 0) || bolts[0];
      const x = (Math.random() - 0.5) * 34;
      const z = -6 - Math.random() * 22;
      b.g.setFromPoints(jaggedBolt(x, z));
      b.life = 1;
      oceanMat.uniforms.uStrike.value.set(x, z, t);
      flashLight.v = 1;
    };

    // Interaction
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = e => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onClick = () => strike(clock.getElapsedTime());
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onClick, { passive: true });

    const resize = () => {
      const w = el.clientWidth || window.innerWidth;
      const h = el.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const clock = new THREE.Clock();
    let raf = 0;
    let visible = true;
    const render = () => {
      const t = clock.getElapsedTime();
      oceanMat.uniforms.uTime.value = t;
      oceanMat.uniforms.uDeep.value.lerp(T.deep, 0.035);
      oceanMat.uniforms.uCrest.value.lerp(T.crest, 0.035);
      oceanMat.uniforms.uFlash.value.lerp(T.flash, 0.035);

      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;
      const scroll = Math.min(1, window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight));
      camera.position.set(Math.sin(t * 0.05) * 4 + pointer.x * 3, 6.5 - scroll * 3.2 - pointer.y * 1.2, 22 - scroll * 6);
      camera.lookAt(pointer.x * 2, 2.2 - scroll * 1.5, -10);

      core.rotation.x = t * 0.18;
      core.rotation.y = t * 0.27;
      inner.rotation.y = -t * 0.6;
      core.position.y = 12 + Math.sin(t * 0.7) * 0.8;
      heart.scale.setScalar(1 + Math.sin(t * 3) * 0.12 + flashLight.v * 0.6);

      const sp = sparkGeo.attributes.position.array;
      for (let i = 0; i < SPARKS; i++) {
        sp[i * 3 + 1] += sparkVel[i] * 0.016;
        sp[i * 3] += Math.sin(t + i) * 0.004;
        if (sp[i * 3 + 1] > 18) sp[i * 3 + 1] = 0;
      }
      sparkGeo.attributes.position.needsUpdate = true;

      if (!reduced && t > next) {
        strike(t);
        next = t + (2.4 + Math.random() * 3.6) / M.bolts;
      }
      bolts.forEach(b => {
        if (b.life <= 0) return;
        b.life -= 0.035;
        const flicker = b.life > 0.6 ? (Math.random() > 0.35 ? 1 : 0.25) : b.life;
        b.glow.material.opacity = flicker * 0.55;
        b.coreLine.material.opacity = flicker;
      });
      flashLight.v *= 0.9;
      scene.fog.color.setRGB(0.02 + flashLight.v * 0.12, 0.03 + flashLight.v * 0.1, 0.04 + flashLight.v * 0.05);

      renderer.render(scene, camera);
      if (!reduced && visible) raf = requestAnimationFrame(render);
    };
    render();

    const io = new IntersectionObserver(([e]) => {
      const was = visible;
      visible = e.isIntersecting && !document.hidden;
      if (visible && !was && !reduced) raf = requestAnimationFrame(render);
    });
    io.observe(el);
    const onVis = () => {
      const was = visible;
      visible = !document.hidden;
      if (visible && !was && !reduced) raf = requestAnimationFrame(render);
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(raf);
      offTint();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onClick);
      scene.traverse(o => {
        o.geometry?.dispose?.();
        o.material?.dispose?.();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [palette.deep, palette.crest, palette.flash, palette.core, mood]);

  return <div ref={mount} style={{ position: 'absolute', inset: 0, opacity }} aria-hidden="true" />;
}
