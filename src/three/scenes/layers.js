import { glowTexture, label } from '../engine.js';

// The layered 3D demonstration used across the course. It draws stacks of
// slabs (shared "base" layers plus side-by-side "columns"), colours each slab
// by who owns it, and can:
//   · flash layers to show who handles an event   (params.pulse)
//   · send a packet along a path of layers, with a tag that changes at each
//     layer, optionally stopping at a failing layer (params.flow)
// Layer refs: 'b:i' = base layer i (bottom up), 'c:j:i' = column j, layer i.
//
// params = {
//   base:    [{ label, owner, color?, h? }],
//   columns: [{ title, layers: [{ label, owner, color?, h? }] }],
//   pulse:   { key, refs: ['b:2'] or [['b:2', 'bad'], ...], kind: 'you' | 'cloud' | 'bad' | 'ok' },
//   flow:    { key, path: ['c:0:3', ...], tags: ['GET /', ...], stop: null | n },
//   stagger: seconds between slabs appearing (slow = VMs, fast = containers)
// }
const OWNER = { you: '#ffdf20', cloud: '#53eafd', shared: '#c4b5fd', net: '#2b7fff', app: '#ff8904', off: '#3a4652' };
const KIND = { you: '#ffdf20', cloud: '#53eafd', bad: '#ff4d6d', ok: '#3ef09a' };
const SW = 3.4; // slab width in a single stack
const D = 2.2; // depth
const H = 0.42; // base slab height
const GAP = 0.16;
const CGAP = 1.2;

export default function build({ THREE, scene, camera }, initial) {
  const world = new THREE.Group();
  scene.add(world);
  const box = new THREE.BoxGeometry(1, 1, 1);
  const edges = new THREE.EdgesGeometry(box);
  const glow = glowTexture(THREE);

  let slabs = new Map();
  let titles = [];
  let sig = '';
  let size = { w: 4, h: 4 };
  let aspect = 1.6;
  let now = 0;
  let stagger = 0.06;
  let ncols = 0;
  let last = { flow: null, pulse: null };

  // The travelling packet and its changing tag.
  const packet = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: '#ffffff', transparent: true, depthTest: false, blending: THREE.AdditiveBlending }));
  packet.scale.setScalar(0.9);
  packet.visible = false;
  packet.renderOrder = 10;
  world.add(packet);
  let tag = null;
  let flow = null;

  const setTag = text => {
    if (tag) {
      world.remove(tag);
      tag.material.map.dispose();
      tag.material.dispose();
      tag = null;
    }
    if (!text) return;
    tag = label(THREE, text, { color: '#ffffff', size: 0.34 });
    tag.material.depthTest = false;
    tag.renderOrder = 11;
    world.add(tag);
  };

  const colourOf = l => new THREE.Color(l.color || OWNER[l.owner] || OWNER.off);

  function layout(p) {
    const base = p.base || [];
    const cols = p.columns || [];
    const n = Math.max(1, cols.length);
    const cw = cols.length > 2 ? 2.6 : SW;
    const gap = cols.length > 2 ? CGAP * 0.6 : CGAP;
    const totalW = cols.length ? n * cw + (n - 1) * gap : SW;
    const items = [];
    let y = 0;
    base.forEach((l, i) => {
      const h = H * (l.h || 1);
      items.push({ ref: `b:${i}`, l, x: 0, y: y + h / 2, w: totalW, h });
      y += h + GAP;
    });
    let top = y;
    cols.forEach((c, j) => {
      let cy = y;
      const x = -totalW / 2 + cw / 2 + j * (cw + gap);
      c.layers.forEach((l, i) => {
        const h = H * (l.h || 1);
        items.push({ ref: `c:${j}:${i}`, l, x, y: cy + h / 2, w: cw, h, col: j });
        cy += h + GAP;
      });
      top = Math.max(top, cy);
      c._x = x;
      c._top = cy;
    });
    return { items, totalW, totalH: top, cols };
  }

  function clear() {
    slabs.forEach(s => {
      world.remove(s.group);
      s.fill.dispose();
      s.line.dispose();
      s.label.material.map.dispose();
      s.label.material.dispose();
    });
    titles.forEach(t => {
      world.remove(t);
      t.material.map.dispose();
      t.material.dispose();
    });
    slabs = new Map();
    titles = [];
  }

  function rebuild(p) {
    // Layers that already exist (same place, same label) stay put; only new
    // ones drop in. So starting one more app only animates that app.
    const kept = new Map([...slabs].map(([ref, s]) => [`${ref}|${s.text}`, s.born]));
    clear();
    let order = 0;
    const { items, totalW, totalH, cols } = layout(p);
    const off = -totalH / 2;
    const small = (p.columns || []).length > 2;
    items.forEach(it => {
      const group = new THREE.Group();
      const c = colourOf(it.l);
      const fill = new THREE.MeshBasicMaterial({ color: c.clone(), transparent: true, opacity: 0, depthWrite: false });
      const line = new THREE.LineBasicMaterial({ color: c.clone(), transparent: true, opacity: 0 });
      const mesh = new THREE.Mesh(box, fill);
      const lines = new THREE.LineSegments(edges, line);
      mesh.scale.set(it.w, it.h, D);
      lines.scale.set(it.w, it.h, D);
      const lab = label(THREE, it.l.label, { size: small ? 0.24 : 0.3, color: '#f2f6f8' });
      lab.position.set(0, 0, D / 2 + 0.02);
      lab.material.opacity = 0;
      group.add(mesh, lines, lab);
      group.position.set(it.x, it.y + off, 0);
      world.add(group);
      const was = kept.get(`${it.ref}|${it.l.label}`);
      const born = was !== undefined ? Math.min(was, now - 1) : now + order++ * stagger;
      slabs.set(it.ref, { group, fill, line, label: lab, text: it.l.label, base: c.clone(), target: c.clone(), y: it.y + off, born, pulse: -9, pulseColor: new THREE.Color(), shake: false });
    });
    cols.forEach(c => {
      if (!c.title) return;
      const t = label(THREE, c.title, { size: small ? 0.28 : 0.34, color: '#ffffff', weight: 700 });
      t.position.set(c._x, c._top + off + 0.45, 0);
      world.add(t);
      titles.push(t);
    });
    size = { w: totalW, h: totalH + 1.2 };
    ncols = cols.length;
  }

  function retarget(p) {
    const { items } = layout(p);
    items.forEach(it => {
      const s = slabs.get(it.ref);
      if (s) s.target = colourOf(it.l);
    });
  }

  const point = ref => {
    const s = slabs.get(ref);
    return s ? new THREE.Vector3(s.group.position.x, s.y, D / 2 + 0.55) : null;
  };

  function startFlow(f) {
    const pts = f.path.map(point).filter(Boolean);
    if (pts.length < 2) return;
    flow = { pts, tags: f.tags || [], stop: f.stop ?? null, refs: f.path, s: 0, idx: -1, end: null, color: new THREE.Color(f.color || '#ffffff') };
    packet.material.color.copy(flow.color);
    packet.material.opacity = 1;
    packet.visible = true;
  }

  // refs may be plain refs (all get `kind`) or [ref, kind] pairs.
  function pulse(refs, kind) {
    refs.forEach(item => {
      const [r, k] = Array.isArray(item) ? item : [item, kind];
      const s = slabs.get(r);
      if (!s) return;
      s.pulse = now;
      s.pulseColor.set(KIND[k] || k);
      s.shake = k === 'bad';
    });
  }

  function set(p) {
    stagger = p.stagger ?? 0.06;
    const nextSig = JSON.stringify([(p.base || []).map(l => [l.label, l.h]), (p.columns || []).map(c => [c.title, c.layers.map(l => [l.label, l.h])])]);
    if (nextSig !== sig) {
      sig = nextSig;
      rebuild(p);
      flow = null;
      packet.visible = false;
      setTag(null);
    } else retarget(p);
    if (p.pulse && p.pulse.key !== last.pulse) {
      last.pulse = p.pulse.key;
      pulse(p.pulse.refs, p.pulse.kind);
    }
    if (p.flow && p.flow.key !== last.flow) {
      last.flow = p.flow.key;
      if (p.flow.key) startFlow(p.flow);
    }
  }

  // First paint: don't replay a pulse/flow that was already in the params.
  last = { flow: initial.flow?.key, pulse: initial.pulse?.key };
  set(initial);

  return {
    set,
    update(t, dt) {
      now = t;
      slabs.forEach(s => {
        const a = Math.min(1, Math.max(0, (t - s.born) / 0.5));
        const e = 1 - Math.pow(1 - a, 3);
        s.base.lerp(s.target, Math.min(1, dt * 6));
        const k = Math.max(0, 1 - (t - s.pulse) / 1.4);
        const c = s.base.clone().lerp(s.pulseColor, k);
        s.fill.color.copy(c);
        s.line.color.copy(c);
        s.fill.opacity = (0.16 + k * 0.35) * e;
        s.line.opacity = e;
        s.label.material.opacity = e;
        s.group.position.y = s.y + (1 - e) * 2.2;
        s.group.position.x = (s.group.userData.x ??= s.group.position.x) + (s.shake ? Math.sin(t * 70) * 0.06 * k : 0);
        s.group.scale.setScalar(1 + k * 0.05);
      });
      if (flow) {
        const end = flow.pts.length - 1;
        const limit = flow.stop ?? end;
        flow.s = Math.min(limit, flow.s + dt * 1.25);
        const i = Math.min(end - 1, Math.floor(flow.s));
        const pos = flow.s >= limit ? flow.pts[limit].clone() : flow.pts[i].clone().lerp(flow.pts[i + 1], flow.s - i);
        packet.position.copy(pos);
        const reached = Math.floor(flow.s + 0.001);
        if (reached !== flow.idx) {
          flow.idx = reached;
          setTag(flow.tags[reached] || null);
        }
        if (tag) tag.position.copy(pos).add(new THREE.Vector3(0, 0.62, 0.2));
        packet.scale.setScalar(0.8 + Math.sin(t * 8) * 0.08);
        if (flow.s >= limit && flow.end === null) {
          flow.end = t;
          pulse([flow.refs[limit]], flow.stop !== null ? 'bad' : 'ok');
        }
        if (flow.end !== null && t - flow.end > 2.4) {
          const fade = Math.max(0, 1 - (t - flow.end - 2.4) * 2);
          packet.material.opacity = fade;
          if (tag) tag.material.opacity = fade;
          if (fade === 0) {
            packet.visible = false;
            setTag(null);
            flow = null;
          }
        }
      }
    },
    resize(w, h) {
      aspect = w / h;
    },
    tick(p) {
      const fov = (camera.fov * Math.PI) / 180;
      const needH = size.h * 1.18;
      const needW = (size.w + (ncols > 2 ? 0.6 : 2.4)) * 1.04;
      const dist = Math.max(needH / (2 * Math.tan(fov / 2)), needW / (2 * Math.tan(fov / 2) * aspect)) + D;
      // Wide rows of stacks are viewed more head-on so they don't overlap.
      const az = (ncols > 2 ? 0.1 : 0.42) + p.x * (ncols > 2 ? 0.12 : 0.25) + Math.sin(now * 0.25) * (ncols > 2 ? 0.04 : 0.08);
      camera.position.set(Math.sin(az) * dist, size.h * 0.22 + p.y * 1.2, Math.cos(az) * dist);
      camera.lookAt(0, 0, 0);
    }
  };
}
