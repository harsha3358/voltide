import { glowTexture, label } from '../engine.js';

// EPISODE 02: the internet as a 3D mesh of routers. Packets hop node to node
// along a highlighted route: your laptop → gateway → ISP → … → the cloud
// server. Tap to fire a ping and watch it go out and come back.
export default function build({ THREE, scene, camera }, { accent = '#2b7fff', accent2 = '#8ec5ff' }) {
  const A = new THREE.Color(accent);
  const B = new THREE.Color(accent2);
  const GOLD = new THREE.Color('#ffdf20');
  camera.position.set(0, 1.5, 15);
  const world = new THREE.Group();
  scene.add(world);

  // Nodes: a loose cloud of routers, plus "you" on the left and the server on the right.
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const nodes = [new THREE.Vector3(-6.5, -0.6, 0.6)];
  for (let i = 0; i < 46; i++) nodes.push(new THREE.Vector3((rand() - 0.5) * 11, (rand() - 0.5) * 5.5, (rand() - 0.5) * 5));
  nodes.push(new THREE.Vector3(6.5, 0.4, -0.4));
  const YOU = 0;
  const SRV = nodes.length - 1;

  // Edges to the three nearest neighbours.
  const edges = new Set();
  const adj = nodes.map(() => []);
  nodes.forEach((p, i) => {
    nodes
      .map((q, j) => [j, p.distanceTo(q)])
      .filter(([j]) => j !== i)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 3)
      .forEach(([j]) => {
        const k = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!edges.has(k)) {
          edges.add(k);
          adj[i].push(j);
          adj[j].push(i);
        }
      });
  });
  const ep = [];
  edges.forEach(k => {
    const [i, j] = k.split('-').map(Number);
    ep.push(nodes[i].x, nodes[i].y, nodes[i].z, nodes[j].x, nodes[j].y, nodes[j].z);
  });
  const edgeGeo = new THREE.BufferGeometry();
  edgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(ep, 3));
  world.add(new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: A, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false })));

  // Router meshes: small wireframe octahedrons.
  const oct = new THREE.OctahedronGeometry(0.16);
  const octMat = new THREE.MeshBasicMaterial({ color: B, wireframe: true, transparent: true, opacity: 0.8 });
  const routers = nodes.map((p, i) => {
    const m = new THREE.Mesh(i === YOU || i === SRV ? new THREE.BoxGeometry(0.7, 0.5, 0.7) : oct, i === YOU || i === SRV ? new THREE.MeshBasicMaterial({ color: GOLD, wireframe: true }) : octMat);
    m.position.copy(p);
    world.add(m);
    return m;
  });
  const you = label(THREE, 'you', { color: '#ffdf20', size: 0.42 });
  you.position.copy(nodes[YOU]).add(new THREE.Vector3(0, 0.75, 0));
  const srv = label(THREE, 'cloud server', { color: '#ffdf20', size: 0.42 });
  srv.position.copy(nodes[SRV]).add(new THREE.Vector3(0, 0.75, 0));
  world.add(you, srv);

  // Shortest route you → server (breadth-first), drawn bright.
  const prev = new Array(nodes.length).fill(-1);
  const seen = new Set([YOU]);
  const q = [YOU];
  while (q.length) {
    const c = q.shift();
    for (const n of adj[c]) if (!seen.has(n)) (seen.add(n), (prev[n] = c), q.push(n));
  }
  let route = [];
  for (let c = SRV; c !== -1; c = prev[c]) route.unshift(c);
  if (route[0] !== YOU) route = [YOU, SRV];
  const routePts = route.map(i => nodes[i]);
  world.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(routePts), new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.55 })));
  const hops = route.slice(1, -1).map((i, k) => {
    const t = label(THREE, `hop ${k + 1}`, { color: '#8ec5ff', size: 0.24, weight: 500 });
    t.position.copy(nodes[i]).add(new THREE.Vector3(0, 0.42, 0));
    world.add(t);
    return t;
  });

  // Packets: random walkers on the mesh, plus pings on the route.
  const tex = glowTexture(THREE);
  const mk = (color, s) => {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    sp.scale.setScalar(s);
    world.add(sp);
    return sp;
  };
  const walkers = Array.from({ length: 22 }, () => {
    const a = Math.floor(rand() * nodes.length);
    return { sp: mk(B, 0.32), a, b: adj[a][0], k: rand(), v: 0.6 + rand() * 0.8 };
  });
  const pings = [];
  const ping = (back = false) => pings.push({ sp: mk(GOLD, 0.6), k: 0, back });
  const along = (pts, k) => {
    const seg = Math.min(pts.length - 2, Math.floor(k * (pts.length - 1)));
    const f = k * (pts.length - 1) - seg;
    return pts[seg].clone().lerp(pts[seg + 1], f);
  };
  let nextPing = 0.5;

  return {
    click: () => ping(),
    update(t, dt) {
      walkers.forEach(w => {
        w.k += dt * w.v;
        if (w.k >= 1) {
          w.k = 0;
          const n = adj[w.b];
          const nx = n[Math.floor(Math.random() * n.length)];
          w.a = w.b;
          w.b = nx === w.a ? n[0] : nx;
        }
        w.sp.position.copy(nodes[w.a]).lerp(nodes[w.b], w.k);
      });
      if (t > nextPing) {
        ping();
        nextPing = t + 2.6;
      }
      for (let i = pings.length - 1; i >= 0; i--) {
        const p = pings[i];
        p.k += dt * 0.42;
        if (p.k >= 1) {
          world.remove(p.sp);
          p.sp.material.dispose();
          pings.splice(i, 1);
          if (!p.back) ping(true);
          continue;
        }
        p.sp.position.copy(along(p.back ? [...routePts].reverse() : routePts, p.k));
      }
      routers.forEach((r, i) => (r.rotation.y = t * (i % 2 ? 0.6 : -0.5)));
      hops.forEach((h, i) => (h.material.opacity = 0.55 + 0.45 * Math.sin(t * 2 - i)));
      world.rotation.y = Math.sin(t * 0.15) * 0.35;
    },
    resize(w, h) {
      camera.position.z = w / h < 1 ? 24 : 18.5;
    },
    tick(p) {
      camera.position.x = p.x * 1.8;
      camera.position.y = 1.5 + p.y * 1.2;
      camera.lookAt(0, 0, 0);
    }
  };
}
