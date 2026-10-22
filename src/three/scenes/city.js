import { cometLine, label } from '../engine.js';

// EPISODE 04: deploy day. A server tower in the middle of a night city sends
// out a wave; every building it reaches lights up its windows (that's people
// opening your site). Tap to deploy again.
const VERT = /* glsl */ `
  uniform float uRadius;
  varying vec3 vW;
  varying float vLit;
  varying float vRoof;
  void main() {
    vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.0);
    vW = w.xyz;
    vec3 c = (modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    float d = length(c.xz);
    vLit = smoothstep(d + 0.8, d - 0.2, uRadius);
    vRoof = step(0.5, normal.y);
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;
const FRAG = /* glsl */ `
  uniform vec3 uWin;
  uniform vec3 uEdge;
  varying vec3 vW;
  varying float vLit;
  varying float vRoof;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5); }
  void main() {
    vec3 base = vec3(0.012, 0.02, 0.035);
    vec2 cell = vec2(floor((vW.x + vW.z) * 4.0), floor(vW.y * 4.5));
    vec2 f = vec2(fract((vW.x + vW.z) * 4.0), fract(vW.y * 4.5));
    float win = step(0.3, f.x) * step(f.x, 0.7) * step(0.35, f.y) * step(f.y, 0.7) * (1.0 - vRoof);
    float on = step(0.62, hash(cell));
    vec3 col = base + uWin * win * on * vLit * 0.85 + uEdge * win * 0.05;
    col += uEdge * vRoof * (0.04 + 0.16 * vLit);
    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function build({ THREE, scene, camera }, { accent = '#8e51ff', accent2 = '#e12afb' }) {
  const A = new THREE.Color(accent);
  const B = new THREE.Color(accent2);
  camera.position.set(0, 12, 22);
  const world = new THREE.Group();
  scene.add(world);

  // Buildings: one instanced mesh, heights fall off toward the edge.
  const spots = [];
  for (let x = -9; x <= 9; x++)
    for (let z = -9; z <= 9; z++) {
      const d = Math.hypot(x, z);
      if (d < 1.6 || d > 9.5 || Math.random() < 0.18) continue;
      spots.push([x, z, d]);
    }
  const geo = new THREE.BoxGeometry(1, 1, 1);
  geo.translate(0, 0.5, 0);
  const uniforms = { uRadius: { value: 0 }, uWin: { value: new THREE.Color('#ffd88a') }, uEdge: { value: A } };
  const mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms });
  const city = new THREE.InstancedMesh(geo, mat, spots.length);
  const m = new THREE.Matrix4();
  spots.forEach(([x, z, d], i) => {
    const h = 0.4 + Math.random() * (5.5 - d * 0.45) * (Math.random() < 0.15 ? 1.6 : 1);
    m.compose(new THREE.Vector3(x * 1.05, 0, z * 1.05), new THREE.Quaternion(), new THREE.Vector3(0.75, Math.max(0.3, h), 0.75));
    city.setMatrixAt(i, m);
  });
  world.add(city);

  // The server tower.
  const towerGeo = new THREE.BoxGeometry(1.3, 6, 1.3);
  towerGeo.translate(0, 3, 0);
  const tower = new THREE.Group();
  tower.add(new THREE.Mesh(towerGeo, new THREE.MeshBasicMaterial({ color: 0x07040f })), new THREE.LineSegments(new THREE.EdgesGeometry(towerGeo), new THREE.LineBasicMaterial({ color: B })));
  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 12), new THREE.MeshBasicMaterial({ color: B }));
  beacon.position.y = 6.4;
  tower.add(beacon);
  world.add(tower);
  const tag = label(THREE, 'your site · live', { color: accent2, size: 0.62 });
  tag.position.set(0, 7.3, 0);
  world.add(tag);

  // Ground grid and the expanding deploy wave.
  const grid = new THREE.GridHelper(24, 24, A, A);
  grid.material.transparent = true;
  grid.material.opacity = 0.12;
  world.add(grid);
  const wave = new THREE.Mesh(new THREE.RingGeometry(0.96, 1, 96), new THREE.MeshBasicMaterial({ color: B, transparent: true, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
  wave.rotation.x = -Math.PI / 2;
  wave.position.y = 0.05;
  world.add(wave);

  // Requests: arcs from random buildings up to the tower.
  const arcs = Array.from({ length: 14 }, (_, i) => {
    const [x, z] = spots[Math.floor(Math.random() * spots.length)];
    const a = new THREE.Vector3(x * 1.05, 1.2, z * 1.05);
    const b = new THREE.Vector3(0, 5.6, 0);
    const mid = a.clone().add(b).multiplyScalar(0.5).add(new THREE.Vector3(0, 3, 0));
    const line = cometLine(THREE, new THREE.QuadraticBezierCurve3(a, mid, b), i % 2 ? accent : accent2, { speed: 0.3 + Math.random() * 0.4, phase: Math.random(), base: 0 });
    line.visible = false;
    world.add(line);
    return line;
  });

  let start = 0.3;
  let clock = 0;
  const deploy = () => {
    start = clock;
  };

  return {
    click: deploy,
    update(t) {
      clock = t;
      const age = t - start;
      const r = age * 4.2;
      uniforms.uRadius.value = r;
      wave.scale.setScalar(Math.max(0.01, r));
      wave.material.opacity = Math.max(0, 1 - r / 13);
      beacon.scale.setScalar(0.7 + Math.max(0, 1 - age * 2) * 1.2);
      arcs.forEach(a => {
        a.visible = r > 6;
        a.material.uniforms.uTime.value = t;
      });
      if (age > 9) start = t;
      world.rotation.y = t * 0.06;
    },
    resize(w, h) {
      camera.position.z = w / h < 1 ? 30 : 22;
      camera.position.y = w / h < 1 ? 15 : 12;
    },
    tick(p) {
      camera.position.x = p.x * 2;
      camera.lookAt(0, 1.6 + p.y * 0.6, 0);
    }
  };
}
