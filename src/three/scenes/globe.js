import { cometLine, glowTexture, label } from '../engine.js';

// HOME: a planet of data points with real cloud regions. Packets arc between
// them non-stop, because somewhere, someone is always uploading a reel.
// Tap the globe to send a burst from Mumbai.
const CITIES = [
  ['Mumbai', 19.07, 72.88],
  ['Singapore', 1.35, 103.82],
  ['Frankfurt', 50.11, 8.68],
  ['N. Virginia', 38.9, -77.4],
  ['Tokyo', 35.68, 139.69],
  ['São Paulo', -23.55, -46.63],
  ['Sydney', -33.87, 151.21],
  ['London', 51.5, -0.12]
];
const LINKS = [[0, 1], [0, 2], [0, 3], [0, 4], [1, 6], [2, 7], [3, 5], [3, 7], [4, 6], [2, 3], [1, 4]];

export default function build({ THREE, scene, camera }, { accent = '#53eafd', accent2 = '#ffdf20' }) {
  const R = 3;
  const A = new THREE.Color(accent);
  const B = new THREE.Color(accent2);
  camera.position.set(0, 0.6, 13);
  const globe = new THREE.Group();
  globe.rotation.x = 0.35;
  scene.add(globe);
  const ll = (lat, lon, r = R) => {
    const phi = ((90 - lat) * Math.PI) / 180;
    const th = ((lon + 180) * Math.PI) / 180;
    return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
  };

  // Occluder so the far side of the dots is hidden, and a dark planet body.
  globe.add(new THREE.Mesh(new THREE.SphereGeometry(R * 0.985, 48, 32), new THREE.MeshBasicMaterial({ color: 0x03080e })));

  // Fibonacci dots, a little brighter near the "equator of data".
  const N = 5200;
  const pos = [];
  const rnd = [];
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = i * 2.399963;
    pos.push(Math.cos(th) * r * R, y * R, Math.sin(th) * r * R);
    rnd.push(Math.random());
  }
  const dotGeo = new THREE.BufferGeometry();
  dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  dotGeo.setAttribute('aR', new THREE.Float32BufferAttribute(rnd, 1));
  const dotMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uA: { value: A } },
    vertexShader: `attribute float aR; uniform float uTime; varying float vA;
      void main(){ vA = 0.35 + 0.65*pow(0.5+0.5*sin(uTime*1.3 + aR*40.0), 6.0);
        vec4 mv = modelViewMatrix*vec4(position,1.0); gl_PointSize = 3.0*(12.0/-mv.z); gl_Position = projectionMatrix*mv; }`,
    fragmentShader: `uniform vec3 uA; varying float vA;
      void main(){ float d = length(gl_PointCoord-0.5); if (d > 0.5) discard; gl_FragColor = vec4(mix(uA, vec3(1.0), vA*0.35), 0.25 + vA*0.75); }`,
    transparent: true,
    depthWrite: false
  });
  globe.add(new THREE.Points(dotGeo, dotMat));

  // Atmosphere: a fresnel glow on the back faces of a slightly bigger sphere.
  scene.add(
    new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.18, 48, 32),
      new THREE.ShaderMaterial({
        uniforms: { uA: { value: A } },
        vertexShader: `varying vec3 vN; void main(){ vN = normalize(normalMatrix*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
        fragmentShader: `uniform vec3 uA; varying vec3 vN; void main(){ float f = pow(clamp(-vN.z, 0.0, 1.0), 2.2); gl_FragColor = vec4(uA, f*0.9); }`,
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    )
  );

  // City markers, pulsing rings and labels for the regions.
  const tex = glowTexture(THREE);
  const rings = [];
  CITIES.forEach(([name, lat, lon], i) => {
    const p = ll(lat, lon, R * 1.01);
    const dot = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color: i === 0 ? B : A, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    dot.scale.setScalar(i === 0 ? 0.55 : 0.38);
    dot.position.copy(p);
    globe.add(dot);
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.1, 0.13, 40), new THREE.MeshBasicMaterial({ color: i === 0 ? B : A, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
    ring.position.copy(p);
    ring.lookAt(p.clone().multiplyScalar(2));
    ring.userData.phase = Math.random();
    globe.add(ring);
    rings.push(ring);
    if (i < 4) {
      const tag = label(THREE, i === 0 ? 'Mumbai · ap-south-1' : name, { color: i === 0 ? accent2 : '#e6f1ff', size: 0.3 });
      tag.position.copy(ll(lat, lon, R * 1.32));
      globe.add(tag);
    }
  });

  // Arcs with travelling packets.
  const arc = (a, b, lift) => {
    const pa = ll(CITIES[a][1], CITIES[a][2], R * 1.01);
    const pb = ll(CITIES[b][1], CITIES[b][2], R * 1.01);
    const mid = pa.clone().add(pb).multiplyScalar(0.5);
    mid.setLength(R + lift * pa.distanceTo(pb));
    return new THREE.QuadraticBezierCurve3(pa, mid, pb);
  };
  const comets = LINKS.map(([a, b], i) => {
    const line = cometLine(THREE, arc(a, b, 0.32), i % 3 === 0 ? accent2 : accent, { speed: 0.22 + Math.random() * 0.25, phase: Math.random(), base: 0.08 });
    globe.add(line);
    return line;
  });
  const bursts = [];
  const burst = () => {
    LINKS.filter(([a]) => a === 0).forEach(([, b]) => {
      const line = cometLine(THREE, arc(0, b, 0.5), accent2, { speed: 0.9, phase: 0, base: 0 });
      line.userData.born = clock;
      globe.add(line);
      bursts.push(line);
    });
  };
  let clock = 0;

  return {
    click: burst,
    update(t, dt) {
      clock = t;
      dotMat.uniforms.uTime.value = t;
      comets.forEach(c => (c.material.uniforms.uTime.value = t));
      for (let i = bursts.length - 1; i >= 0; i--) {
        const c = bursts[i];
        const age = t - c.userData.born;
        c.material.uniforms.uTime.value = age;
        if (age > 1.1) {
          globe.remove(c);
          c.geometry.dispose();
          c.material.dispose();
          bursts.splice(i, 1);
        }
      }
      rings.forEach(r => {
        const k = (t * 0.6 + r.userData.phase) % 1;
        r.scale.setScalar(1 + k * 3.2);
        r.material.opacity = (1 - k) * 0.8;
      });
      globe.rotation.y = t * 0.08 - 1.6;
    },
    resize(w, h) {
      camera.position.z = w / h < 0.9 ? 16 : 13;
    },
    tick(p) {
      camera.position.x = p.x * 1.2;
      camera.position.y = 0.6 + p.y * 0.9;
      camera.lookAt(0, 0, 0);
    }
  };
}
