import { label } from '../engine.js';

// EPISODE 03: a slow fly-through of a data-centre aisle. Racks hum, LEDs
// blink, and every few seconds a fresh VM (a glowing cube) boots out of a
// rack and floats up to join the fleet. Tap to launch one yourself.
export default function build({ THREE, scene, camera }, { accent = '#46ecd5', accent2 = '#53eafd' }) {
  const A = new THREE.Color(accent);
  const B = new THREE.Color(accent2);
  scene.fog = new THREE.Fog(0x02060a, 8, 30);
  const world = new THREE.Group();
  scene.add(world);

  const rackGeo = new THREE.BoxGeometry(1.1, 3.2, 1.3);
  const edges = new THREE.EdgesGeometry(rackGeo);
  const face = new THREE.MeshBasicMaterial({ color: 0x040a10 });
  const edgeMat = new THREE.LineBasicMaterial({ color: A, transparent: true, opacity: 0.55 });
  const slots = [];
  const ledPos = [];
  const ledPh = [];
  for (let side of [-1, 1])
    for (let i = 0; i < 12; i++) {
      const g = new THREE.Group();
      g.position.set(side * 2.1, 0, -i * 1.45);
      g.add(new THREE.Mesh(rackGeo, face), new THREE.LineSegments(edges, edgeMat));
      world.add(g);
      slots.push(g.position.clone());
      for (let r = 0; r < 9; r++)
        for (let c = 0; c < 3; c++) {
          ledPos.push(g.position.x - side * 0.56, -1.3 + r * 0.32, g.position.z - 0.35 + c * 0.35);
          ledPh.push(Math.random());
        }
    }
  const ledGeo = new THREE.BufferGeometry();
  ledGeo.setAttribute('position', new THREE.Float32BufferAttribute(ledPos, 3));
  ledGeo.setAttribute('aP', new THREE.Float32BufferAttribute(ledPh, 1));
  const ledMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uA: { value: A }, uB: { value: new THREE.Color('#3ef09a') } },
    vertexShader: `attribute float aP; uniform float uTime; varying float vOn; varying float vD;
      void main(){ vOn = step(0.45, fract(sin(floor(uTime*5.0*(0.4+aP)+aP*90.0)*12.9898+aP*7.0)*43758.5453));
        vec4 mv = modelViewMatrix*vec4(position,1.0); vD = -mv.z; gl_PointSize = 60.0/vD; gl_Position = projectionMatrix*mv; }`,
    fragmentShader: `uniform vec3 uA; uniform vec3 uB; varying float vOn; varying float vD;
      void main(){ float a = smoothstep(0.5,0.0,length(gl_PointCoord-0.5)); float fog = smoothstep(30.0, 6.0, vD);
        gl_FragColor = vec4(mix(uA*0.5,uB,vOn), a*fog*(0.2+0.8*vOn)); }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  world.add(new THREE.Points(ledGeo, ledMat));

  // Floor and ceiling light strips.
  const grid = new THREE.GridHelper(40, 40, A, A);
  grid.material.transparent = true;
  grid.material.opacity = 0.1;
  grid.position.set(0, -1.6, -10);
  world.add(grid);
  const stripMat = new THREE.MeshBasicMaterial({ color: B, transparent: true, opacity: 0.35 });
  for (let i = 0; i < 9; i++) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.03, 0.12), stripMat);
    s.position.set(0, 2.6, -i * 2.2);
    world.add(s);
  }

  // VMs: cubes that boot out of a rack and float into the "fleet" above.
  const cubeGeo = new THREE.BoxGeometry(0.42, 0.42, 0.42);
  const cubeEdges = new THREE.EdgesGeometry(cubeGeo);
  const vms = [];
  let count = 0;
  const tag = label(THREE, 'instances running: 0', { color: accent, size: 0.3 });
  scene.add(tag);
  const setTag = () => {
    const c = document.createElement('canvas');
    const g = c.getContext('2d');
    const text = `instances running: ${count}`;
    g.font = '600 48px "Space Grotesk", system-ui, sans-serif';
    c.width = Math.ceil(g.measureText(text).width) + 36;
    c.height = 72;
    g.font = '600 48px "Space Grotesk", system-ui, sans-serif';
    g.fillStyle = 'rgba(5,10,16,0.72)';
    g.fillRect(0, 6, c.width, 60);
    g.fillStyle = accent;
    g.textBaseline = 'middle';
    g.fillText(text, 18, 38);
    tag.material.map.dispose();
    tag.material.map = new THREE.CanvasTexture(c);
    tag.material.map.colorSpace = THREE.SRGBColorSpace;
    tag.scale.set((c.width / 72) * 0.3, 0.3, 1);
  };
  const launch = () => {
    const from = slots[Math.floor(Math.random() * 8)];
    const g = new THREE.Group();
    const mat = new THREE.MeshBasicMaterial({ color: A, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false });
    const lmat = new THREE.LineBasicMaterial({ color: B, transparent: true, opacity: 1 });
    g.add(new THREE.Mesh(cubeGeo, mat), new THREE.LineSegments(cubeEdges, lmat));
    g.position.copy(from).add(new THREE.Vector3(-Math.sign(from.x) * 0.7, 0, 0));
    g.userData = { k: 0, from: g.position.clone(), to: new THREE.Vector3((Math.random() - 0.5) * 2.4, 1.2 + Math.random() * 1.1, from.z - 1 - Math.random() * 2), mat, lmat, spin: Math.random() * 2 + 1 };
    world.add(g);
    vms.push(g);
    count += 1;
    setTag();
  };
  let next = 0.8;

  return {
    click: launch,
    update(t, dt) {
      ledMat.uniforms.uTime.value = t;
      if (t > next) {
        launch();
        next = t + 2.2 + Math.random() * 1.5;
      }
      for (let i = vms.length - 1; i >= 0; i--) {
        const v = vms[i];
        const u = v.userData;
        u.k += dt * 0.35;
        const e = 1 - Math.pow(1 - Math.min(u.k, 1), 3);
        v.position.lerpVectors(u.from, u.to, e);
        v.position.y += Math.sin(t * 2 + i) * 0.04;
        v.rotation.x += dt * u.spin;
        v.rotation.y += dt * u.spin * 0.7;
        const life = u.k > 3.2 ? Math.max(0, 1 - (u.k - 3.2) * 2) : 1;
        u.lmat.opacity = life;
        u.mat.opacity = 0.18 * life;
        if (life === 0) {
          world.remove(v);
          u.mat.dispose();
          u.lmat.dispose();
          vms.splice(i, 1);
        }
      }
      // Glide down the aisle and back.
      camera.position.z = 2 + 4 * Math.cos(t * 0.22);
      tag.position.set(0, 2.1, camera.position.z - 5);
    },
    resize(w, h) {
      camera.fov = w / h < 1 ? 62 : 48;
      camera.updateProjectionMatrix();
    },
    tick(p) {
      camera.position.x = p.x * 0.8;
      camera.position.y = 0.6 + p.y * 0.5;
      camera.lookAt(p.x * 0.4, 0.4, camera.position.z - 8);
    }
  };
}
