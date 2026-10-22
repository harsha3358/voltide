import { label } from '../engine.js';

// EPISODE 01 · service models in 3D: the five layers of a computing stack.
// Pick a model and the provider's share of the stack gets wrapped in cloud
// (cyan); whatever stays yellow is still your job.
const LAYERS = ['Hardware & network', 'Virtualisation', 'Operating system', 'Runtime & data', 'Your app'];
export const MANAGED = { onprem: 0, iaas: 2, paas: 4, saas: 5 };

export default function build({ THREE, scene, camera }, { model = 'iaas', you = '#ffdf20', cloud = '#53eafd' }) {
  const YOU = new THREE.Color(you);
  const CLOUD = new THREE.Color(cloud);
  camera.position.set(6.5, 4.2, 9);
  camera.lookAt(0, 0.4, 0);
  const world = new THREE.Group();
  scene.add(world);

  const slabGeo = new THREE.BoxGeometry(4.4, 0.55, 3);
  const edgeGeo = new THREE.EdgesGeometry(slabGeo);
  const slabs = LAYERS.map((name, i) => {
    const g = new THREE.Group();
    const fill = new THREE.MeshBasicMaterial({ color: YOU.clone(), transparent: true, opacity: 0.16, depthWrite: false });
    const line = new THREE.LineBasicMaterial({ color: YOU.clone() });
    g.add(new THREE.Mesh(slabGeo, fill), new THREE.LineSegments(edgeGeo, line));
    const tag = label(THREE, name, { size: 0.34 });
    tag.position.set(-3.6, 0, 1.6);
    g.add(tag);
    g.position.y = i * 0.8 - 1.6;
    g.userData = { fill, line, y: g.position.y, mix: 0 };
    world.add(g);
    return g;
  });

  // The "cloud" shell that rises over the provider-managed layers.
  const shellGeo = new THREE.BoxGeometry(5, 1, 3.6);
  shellGeo.translate(0, 0.5, 0);
  const shell = new THREE.Group();
  const shellFill = new THREE.Mesh(shellGeo, new THREE.MeshBasicMaterial({ color: CLOUD, transparent: true, opacity: 0.06, depthWrite: false }));
  const shellEdge = new THREE.LineSegments(new THREE.EdgesGeometry(shellGeo), new THREE.LineDashedMaterial({ color: CLOUD, dashSize: 0.18, gapSize: 0.12, transparent: true, opacity: 0.9 }));
  shellEdge.computeLineDistances();
  shell.add(shellFill, shellEdge);
  shell.position.y = -2.05;
  world.add(shell);
  const shellTag = label(THREE, 'managed by the cloud provider', { color: cloud, size: 0.3 });
  world.add(shellTag);

  // Sparkles drifting inside the shell.
  const N = 500;
  const pp = [];
  for (let i = 0; i < N; i++) pp.push((Math.random() - 0.5) * 4.8, Math.random(), (Math.random() - 0.5) * 3.4);
  const pg = new THREE.BufferGeometry();
  pg.setAttribute('position', new THREE.Float32BufferAttribute(pp, 3));
  const pm = new THREE.PointsMaterial({ color: CLOUD, size: 0.05, transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending });
  const sparks = new THREE.Points(pg, pm);
  shell.add(sparks);

  let target = MANAGED[model] ?? 2;
  let height = target;
  let explode = 0;

  return {
    set({ model: m }) {
      if (MANAGED[m] === undefined || MANAGED[m] === target) return;
      target = MANAGED[m];
      explode = 1;
    },
    update(t, dt) {
      height += (target - height) * Math.min(1, dt * 4);
      explode = Math.max(0, explode - dt * 1.4);
      const gap = 0.8 + Math.sin(explode * Math.PI) * 0.45;
      slabs.forEach((s, i) => {
        const u = s.userData;
        const want = i < target ? 1 : 0;
        u.mix += (want - u.mix) * Math.min(1, dt * 5);
        u.fill.color.copy(YOU).lerp(CLOUD, u.mix);
        u.line.color.copy(YOU).lerp(CLOUD, u.mix);
        s.position.y = i * gap - 1.6 + Math.sin(t * 1.4 + i) * 0.03;
      });
      const h = Math.max(0.001, height * gap);
      shell.scale.y = h;
      shell.visible = height > 0.02;
      shellTag.position.set(2.2, -2.05 + h + 0.3, 1.8);
      shellTag.material.opacity = Math.min(1, height);
      pm.opacity = 0.7 * Math.min(1, height);
      world.rotation.y = Math.sin(t * 0.25) * 0.35;
    },
    resize(w, h) {
      camera.position.set(w / h < 1 ? 9 : 6.5, 4.2, w / h < 1 ? 13 : 9);
    },
    tick(p) {
      camera.position.x += (p.x * 1.2 + (camera.position.z > 10 ? 9 : 6.5) - camera.position.x) * 0.05;
      camera.lookAt(0, 0.4, 0);
    }
  };
}
