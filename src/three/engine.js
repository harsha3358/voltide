import * as THREE from 'three';

// Tiny runtime for the hero and in-mission 3D scenes. It owns the renderer,
// sizing, pointer parallax and the render loop, which stops whenever the
// canvas is off-screen or the tab is hidden, so lab PCs aren't cooking.
export function mountScene(canvas, build, params = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 300);
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const api = build({ THREE, scene, camera, renderer, pointer, canvas }, params) || {};

  const host = canvas.parentElement;
  const resize = () => {
    const r = host.getBoundingClientRect();
    const w = Math.max(1, r.width);
    const h = Math.max(1, r.height);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    api.resize?.(w, h);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  const clock = new THREE.Clock();
  let raf = 0;
  let t = 0;
  let visible = true;
  const loop = () => {
    if (!visible || document.hidden) {
      raf = 0;
      return;
    }
    raf = requestAnimationFrame(loop);
    const dt = Math.min(clock.getDelta(), 0.05);
    t += dt;
    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;
    api.update?.(t, dt);
    api.tick?.(pointer);
    renderer.render(scene, camera);
  };
  const resume = () => {
    if (raf || !visible || document.hidden) return;
    clock.getDelta();
    loop();
  };
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    resume();
  }, { rootMargin: '120px' });
  io.observe(canvas);
  const onMove = e => {
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.ty = -((e.clientY / window.innerHeight) * 2 - 1);
  };
  window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('visibilitychange', resume);
  const onClick = e => {
    const r = canvas.getBoundingClientRect();
    api.click?.(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
  };
  canvas.addEventListener('pointerdown', onClick);
  loop();

  return {
    api,
    dispose() {
      cancelAnimationFrame(raf);
      raf = 0;
      visible = false;
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', resume);
      canvas.removeEventListener('pointerdown', onClick);
      scene.traverse(o => {
        o.geometry?.dispose();
        [].concat(o.material || []).forEach(m => {
          Object.values(m).forEach(v => v?.isTexture && v.dispose());
          if (m.uniforms) Object.values(m.uniforms).forEach(u => u.value?.isTexture && u.value.dispose());
          m.dispose();
        });
      });
      renderer.dispose();
    }
  };
}

// A soft round dot, used for glows and particle sprites.
export function glowTexture(THREE_, size = 64) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.25, 'rgba(255,255,255,0.55)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, size, size);
  const tex = new THREE_.CanvasTexture(c);
  tex.colorSpace = THREE_.SRGBColorSpace;
  return tex;
}

// A text label that always faces the camera.
export function label(THREE_, text, { color = '#e6f1ff', size = 0.32, weight = 600 } = {}) {
  const c = document.createElement('canvas');
  const g = c.getContext('2d');
  const font = `${weight} 48px "Space Grotesk", "Inter", system-ui, sans-serif`;
  g.font = font;
  const w = Math.ceil(g.measureText(text).width) + 36;
  c.width = w;
  c.height = 72;
  g.font = font;
  g.fillStyle = 'rgba(5,10,16,0.72)';
  const r = 18;
  g.beginPath();
  g.roundRect?.(0, 6, w, 60, r);
  if (!g.roundRect) g.rect(0, 6, w, 60);
  g.fill();
  g.fillStyle = color;
  g.textBaseline = 'middle';
  g.fillText(text, 18, 38);
  const tex = new THREE_.CanvasTexture(c);
  tex.colorSpace = THREE_.SRGBColorSpace;
  tex.anisotropy = 4;
  const s = new THREE_.Sprite(new THREE_.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
  s.scale.set((w / 72) * size, size, 1);
  return s;
}

// Points along a curve with a bright comet travelling down it.
export const COMET_VERT = /* glsl */ `
  attribute float aU;
  varying float vU;
  void main() {
    vU = aU;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
export const COMET_FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uPhase;
  uniform vec3 uColor;
  uniform float uBase;
  varying float vU;
  void main() {
    float head = fract(uTime * uSpeed + uPhase);
    float d = head - vU;
    float tail = d >= 0.0 ? exp(-d * 14.0) : 0.0;
    gl_FragColor = vec4(uColor, uBase + tail);
  }
`;

export function cometLine(THREE_, curve, color, { segments = 64, speed = 0.35, phase = 0, base = 0.12 } = {}) {
  const pts = curve.getPoints(segments);
  const geo = new THREE_.BufferGeometry().setFromPoints(pts);
  geo.setAttribute('aU', new THREE_.Float32BufferAttribute(pts.map((_, i) => i / segments), 1));
  const mat = new THREE_.ShaderMaterial({
    vertexShader: COMET_VERT,
    fragmentShader: COMET_FRAG,
    uniforms: { uTime: { value: 0 }, uSpeed: { value: speed }, uPhase: { value: phase }, uColor: { value: new THREE_.Color(color) }, uBase: { value: base } },
    transparent: true,
    depthWrite: false,
    blending: THREE_.AdditiveBlending
  });
  return new THREE_.Line(geo, mat);
}
