import { missionTheme } from '../lib/missionThemes.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../lib/motion.js';
import { href } from '../lib/router.js';

// The session map: topics sit on a snaking circuit. An electron (with a water
// droplet trail) travels the whole route; the wire draws itself as you scroll.
// Every node is an internal link that jumps straight to its topic.
export default function SessionCircuit({ session, topics, isDone }) {
  const box = useRef(null);
  const [cols, setCols] = useState(5);
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setCols(e.contentRect.width < 560 ? 2 : e.contentRect.width < 860 ? 3 : 5));
    ro.observe(box.current);
    return () => ro.disconnect();
  }, []);

  const W = 1000;
  const rowH = cols === 2 ? 210 : 170;
  const { nodes, d, H } = useMemo(() => {
    const pad = cols === 2 ? 150 : 90;
    const step = cols > 1 ? (W - pad * 2) / (cols - 1) : 0;
    const pts = topics.map((t, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const x = pad + (row % 2 ? cols - 1 - col : col) * step;
      return { ...t, x, y: 70 + row * rowH, i };
    });
    let path = `M ${pts[0].x - 60} ${pts[0].y} L ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1];
      const b = pts[i];
      if (a.y === b.y) path += ` L ${b.x} ${b.y}`;
      else {
        const dir = a.x > W / 2 ? 1 : -1;
        const bulge = a.x + dir * 70;
        path += ` C ${bulge} ${a.y}, ${bulge} ${b.y}, ${b.x} ${b.y}`;
      }
    }
    const last = pts[pts.length - 1];
    path += ` L ${last.x + (Math.floor(last.i / cols) % 2 ? -60 : 60)} ${last.y}`;
    return { nodes: pts, d: path, H: 70 + (Math.ceil(topics.length / cols) - 1) * rowH + 90 };
  }, [topics, cols, rowH]);

  useGSAP(
    () => {
      gsap.fromTo(
        '.sc-wire-lit',
        { drawSVG: '0%' },
        { drawSVG: '100%', ease: 'none', scrollTrigger: { trigger: box.current, start: 'top 75%', end: 'bottom 45%', scrub: 0.6 } }
      );
      const tl = gsap.timeline({ repeat: -1 });
      tl.to('.sc-electron', { motionPath: { path: '.sc-wire', align: '.sc-wire', alignOrigin: [0.5, 0.5] }, duration: topics.length * 1.1, ease: 'none' });
      gsap.to('.sc-node-ring', { attr: { r: 30 }, opacity: 0, duration: 1.8, repeat: -1, stagger: { each: 0.35, repeat: -1 }, ease: 'power1.out' });
    },
    { scope: box, dependencies: [d], revertOnUpdate: true }
  );

  return (
    <div ref={box} className="visual" style={{ padding: '10px 6px' }}>
      <svg viewBox={`0 0 ${W} ${H}`} role="navigation" aria-label="Session map">
        <defs>
          <linearGradient id="sc-g" x1="0" x2="1">
            <stop offset="0" stopColor="var(--accent)" />
            <stop offset="1" stopColor="var(--accent-2)" />
          </linearGradient>
          <radialGradient id="sc-e">
            <stop offset="0" stopColor="#fff" />
            <stop offset=".35" stopColor="var(--accent)" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path className="sc-wire" d={d} fill="none" stroke="var(--line-strong)" strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" />
        <path className="sc-wire-lit" d={d} fill="none" stroke="url(#sc-g)" strokeWidth="3.5" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 6px var(--accent))' }} />
        {nodes.map(n => {
          const done = isDone?.(session.number, n.id);
          return (
            <a key={n.id} href={href.topic(session.number, n.id)} aria-label={`Topic ${n.i + 1}: ${n.title}`}>
              <g style={{ cursor: 'pointer', '--accent': missionTheme(session.number, n.i, topics[n.i]?.theme).a }}>
                <circle className="sc-node-ring" cx={n.x} cy={n.y} r="18" fill="none" stroke={done ? 'var(--ok)' : 'var(--accent)'} strokeWidth="1.5" />
                <circle cx={n.x} cy={n.y} r="20" fill="#050d1d" stroke={done ? 'var(--ok)' : 'var(--accent)'} strokeWidth="2.5" />
                <text x={n.x} y={n.y + 5} textAnchor="middle" fontFamily="JetBrains Mono" fontSize="14" fill={done ? 'var(--ok)' : '#fff'}>
                  {done ? '✓' : String(n.i + 1).padStart(2, '0')}
                </text>
                <foreignObject x={n.x - 90} y={n.y + 28} width="180" height="70">
                  <div style={{ textAlign: 'center', fontSize: cols === 2 ? 22 : 15, lineHeight: 1.25, color: 'var(--text-soft)', fontFamily: 'Space Grotesk' }}>{n.short || n.title}</div>
                </foreignObject>
              </g>
            </a>
          );
        })}
        <circle className="sc-electron" r="12" fill="url(#sc-e)" />
      </svg>
    </div>
  );
}
