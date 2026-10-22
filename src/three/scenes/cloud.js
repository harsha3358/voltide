import { glowTexture, label } from '../engine.js';

// EPISODE 01: a cloud made of light hovering over a mini data centre. Data
// streams up from the racks into the cloud: "the cloud is just someone
// else's computer", in 3D. Tap to strike it with lightning.
export default function build({ THREE, scene, camera }, { accent = '#ffdf20', accent2 = '#53eafd' }) {
  const A = new THREE.Color(accent);
  const B = new THREE.Color(accent2);
  camera.position.set(0, 3.2, 13);
  const world = new THREE.Group();
  scene.add(world);

  // Racks: dark boxes with neon edges and blinking LEDs.
  const rackGeo = new THREE.BoxGeometry(0.9, 2, 0.9);
  const edgeGeo = new THREE.EdgesGeometry(rackGeo);
  const faceMat = new THREE.MeshBasicMaterial({ color: 0x050b12, transparent: true, opacity: 0.92 });
  const edgeMat = new THREE.LineBasicMaterial({ color: B, transparent: true, opacity: 0.7 });
  const leds = [];
  const racks = [];
  for (let x = -3; x <= 3; x++)
    for (let z = -1; z <= 1; z++) {
      if (Math.abs(x) === 3 && z !== 0) continue;
      const g = new THREE.Group();
      g.position.set(x * 1.35, -3.2, z * 1.6);
      g.add(new THREE.Mesh(rackGeo, faceMat), new THREE.LineSegments(edgeGeo, edgeMat));
      world.add(g);
      racks.push(g.position);
      for (let k = 0; k < 6; k++) leds.push(g.position.x - 0.25 + (k % 2) * 0.5, g.position.y - 0.7 + Math.floor(k / 2) * 0.55, g.position.z + 0.46, Math.random());
    }
  const ledGeo = new THREE.BufferGeometry();
  const lp = [];
  const lph = [];
  for (let i = 0; i < leds.length; i += 4) {
    lp.push(leds[i], leds[i + 1], leds[i + 2]);
    lph.push(leds[i + 3]);
  }
  ledGeo.setAttribute('position', new THREE.Float32BufferAttribute(lp, 3));
  ledGeo.setAttribute('aPhase', new THREE.Float32BufferAttribute(lph, 1));
  const ledMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uA: { value: A }, uB: { value: new THREE.Color('#3ef09a') } },
    vertexShader: `attribute float aPhase; varying float vOn; uniform float uTime;
      void main(){ vOn = step(0.35, fract(sin(floor(uTime*4.0 + aPhase*40.0)*12.9898 + aPhase*78.233)*43758.5453));
        vec4 mv = modelViewMatrix*vec4(position,1.0); gl_PointSize = 70.0/-mv.z; gl_Position = projectionMatrix*mv; }`,
    fragmentShader: `uniform vec3 uA; uniform vec3 uB; varying float vOn;
      void main(){ float d = length(gl_PointCoord-0.5); float a = smoothstep(0.5,0.0,d); gl_FragColor = vec4(mix(uA,uB,vOn), a*(0.25+0.75*vOn)); }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  world.add(new THREE.Points(ledGeo, ledMat));

  // The cloud: a few overlapping puffs filled with shimmering points.
  const puffs = [[0, 0, 0, 2.2], [-2.1, -0.4, 0.3, 1.6], [2.2, -0.3, -0.2, 1.7], [-0.9, 0.9, -0.3, 1.5], [1.1, 0.8, 0.4, 1.4], [3.6, -0.7, 0, 1.0], [-3.5, -0.8, 0, 1.0]];
  const cp = [];
  const cr = [];
  for (let i = 0; i < 4200; i++) {
    const [px, py, pz, pr] = puffs[i % puffs.length];
    const v = new THREE.Vector3().randomDirection().multiplyScalar(pr * Math.cbrt(Math.random()));
    cp.push(px + v.x, py + v.y * 0.72, pz + v.z * 0.8);
    cr.push(Math.random());
  }
  const cloudGeo = new THREE.BufferGeometry();
  cloudGeo.setAttribute('position', new THREE.Float32BufferAttribute(cp, 3));
  cloudGeo.setAttribute('aR', new THREE.Float32BufferAttribute(cr, 1));
  const cloudMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uA: { value: A }, uB: { value: B }, uFlash: { value: 0 }, uTex: { value: glowTexture(THREE) } },
    vertexShader: `attribute float aR; uniform float uTime; uniform float uFlash; varying float vR; varying float vY;
      void main(){ vec3 p = position; p += 0.08*vec3(sin(uTime*0.9+aR*30.0), cos(uTime*0.7+aR*20.0), sin(uTime*0.6+aR*10.0));
        vR = aR; vY = position.y; vec4 mv = modelViewMatrix*vec4(p,1.0);
        gl_PointSize = (1.5 + aR*2.2 + uFlash*3.0) * (24.0/-mv.z); gl_Position = projectionMatrix*mv; }`,
    fragmentShader: `uniform sampler2D uTex; uniform vec3 uA; uniform vec3 uB; uniform float uFlash; varying float vR; varying float vY;
      void main(){ vec4 t = texture2D(uTex, gl_PointCoord); vec3 c = mix(uB, vec3(1.0), smoothstep(-1.0,1.8,vY)*0.55);
        c = mix(c, uA, uFlash*vR); gl_FragColor = vec4(c, t.a*(0.16+0.16*vR+uFlash*0.35)); }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const cloud = new THREE.Points(cloudGeo, cloudMat);
  cloud.position.y = 2.2;
  world.add(cloud);

  // Data streams: packets rising from rack tops into the cloud.
  const sp = [];
  const so = [];
  for (let i = 0; i < 260; i++) {
    const r = racks[i % racks.length];
    sp.push(r.x + (Math.random() - 0.5) * 0.4, 0, r.z + (Math.random() - 0.5) * 0.4);
    so.push(Math.random());
  }
  const streamGeo = new THREE.BufferGeometry();
  streamGeo.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
  streamGeo.setAttribute('aO', new THREE.Float32BufferAttribute(so, 1));
  const streamMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uA: { value: A }, uB: { value: B } },
    vertexShader: `attribute float aO; uniform float uTime; varying float vK;
      void main(){ float k = fract(aO + uTime*(0.22+aO*0.18)); vK = k; vec3 p = position;
        p.y = mix(-2.1, 1.6, k); p.x *= mix(1.0, 0.45, k); p.z *= mix(1.0, 0.45, k);
        vec4 mv = modelViewMatrix*vec4(p,1.0); gl_PointSize = 3.0*(28.0/-mv.z); gl_Position = projectionMatrix*mv; }`,
    fragmentShader: `uniform vec3 uA; uniform vec3 uB; varying float vK;
      void main(){ float d = length(gl_PointCoord-0.5); float a = smoothstep(0.5,0.0,d)*sin(vK*3.1416);
        gl_FragColor = vec4(mix(uA,uB,vK), a); }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  world.add(new THREE.Points(streamGeo, streamMat));

  // Floor grid.
  const grid = new THREE.GridHelper(22, 22, B, B);
  grid.material.transparent = true;
  grid.material.opacity = 0.12;
  grid.position.y = -4.2;
  world.add(grid);

  const tag = label(THREE, 'someone else’s computer', { color: accent2, size: 0.42 });
  tag.position.set(0, -5.3, 1.4);
  world.add(tag);

  // Lightning bolt (rebuilt on every strike).
  const boltMat = new THREE.LineBasicMaterial({ color: A, transparent: true, opacity: 0, blending: THREE.AdditiveBlending });
  const bolt = new THREE.Line(new THREE.BufferGeometry(), boltMat);
  world.add(bolt);
  let flash = 0;
  const strike = () => {
    const pts = [];
    let p = new THREE.Vector3((Math.random() - 0.5) * 3, 1.4, 0.3);
    const target = racks[Math.floor(Math.random() * racks.length)];
    for (let i = 0; i <= 10; i++) {
      const k = i / 10;
      pts.push(new THREE.Vector3(THREE.MathUtils.lerp(p.x, target.x, k) + (i && i < 10 ? (Math.random() - 0.5) * 0.7 : 0), THREE.MathUtils.lerp(1.4, -2.2, k), THREE.MathUtils.lerp(p.z, target.z, k)));
    }
    bolt.geometry.dispose();
    bolt.geometry = new THREE.BufferGeometry().setFromPoints(pts);
    flash = 1;
  };
  let nextAuto = 3;

  return {
    click: strike,
    update(t, dt) {
      ledMat.uniforms.uTime.value = t;
      cloudMat.uniforms.uTime.value = t;
      streamMat.uniforms.uTime.value = t;
      if (t > nextAuto) {
        strike();
        nextAuto = t + 4 + Math.random() * 4;
      }
      flash = Math.max(0, flash - dt * 2.2);
      boltMat.opacity = flash > 0.6 ? 1 : flash * 1.2;
      cloudMat.uniforms.uFlash.value = flash;
      cloud.position.y = 2.2 + Math.sin(t * 0.6) * 0.18;
      world.rotation.y = Math.sin(t * 0.12) * 0.45;
    },
    resize(w, h) {
      camera.position.z = w / h < 1 ? 19 : 15.5;
    },
    tick(p) {
      camera.position.x = p.x * 1.6;
      camera.position.y = 3.2 + p.y * 0.8;
      camera.lookAt(0, -0.2, 0);
    }
  };
}
