import { useEffect, useState } from 'react';
import Scene3D from '../../../src/components/Scene3D.jsx';
import { award } from '../../../src/lib/game.js';
import { EVENTS, ownerFor, stackLayers } from '../../../src/lib/stackModel.js';
import Legend from '../../../src/components/LayerLegend.jsx';

// The same nine layers for EC2 (IaaS) and App Engine (PaaS), side by side.
// Throw an event at both and see who handles it on each platform.
const SIDES = [
  ['iaas', 'EC2 · IaaS', 'AWS'],
  ['paas', 'App Engine · PaaS', 'Google']
];

export default function WhoDoesWhat3D() {
  const [hit, setHit] = useState(null);
  const [tried, setTried] = useState(() => new Set());
  const event = hit && EVENTS.find(e => e.id === hit.id);
  useEffect(() => {
    if (tried.size >= 4) award('demo:whodoes', 60, 'Compared IaaS and PaaS under pressure');
  }, [tried]);
  const refsFor = (j, e) => (e.id === 'traffic' ? [`c:${j}:2`, `c:${j}:3`] : [`c:${j}:${e.layer}`]);
  const owners = event ? SIDES.map(([m]) => ownerFor(m, event)) : [];
  const params = {
    columns: SIDES.map(([m, title]) => ({ title, layers: stackLayers(m) })),
    // Each side flashes cyan if the provider handles it, red if it's on you.
    pulse: event ? { key: hit.key, refs: SIDES.flatMap((_, j) => refsFor(j, event).map(r => [r, owners[j] === 'cloud' ? 'cloud' : 'bad'])) } : undefined
  };
  return (
    <div>
      <div className="d-row" style={{ marginBottom: 12, gap: 6 }}>
        {EVENTS.map(e => (
          <button key={e.id} type="button" className={`btn btn--sm ${hit?.id === e.id ? 'btn--primary' : ''}`} onClick={() => (setHit({ id: e.id, key: Date.now() }), setTried(t => new Set(t).add(e.id)))}>{e.name}</button>
        ))}
      </div>
      <div className="layer-demo">
        <Scene3D name="layers" params={params} className="layer-demo__scene" label="Two nine-layer stacks side by side: EC2, where AWS runs 4 layers, and App Engine, where Google runs 7." />
        <div className="d-panel layer-demo__panel">
          <span className="d-label">{event ? event.name : 'Pick an event above'}</span>
          {event ? (
            SIDES.map(([m, title, who], j) => (
              <div key={m} className={`layer-demo__verdict ${owners[j] === 'cloud' ? 'is-cloud' : 'is-you'}`} style={{ marginTop: j ? 8 : 4 }}>
                <strong>{title}:</strong> {owners[j] === 'cloud' ? `${who} handles it.` : `you handle it. ${event.you}`}
              </div>
            ))
          ) : (
            <p style={{ margin: 0 }}>Same app, two platforms. On <strong>EC2</strong> AWS runs the bottom 4 layers. On <strong>App Engine</strong> Google runs 7. Fire an event and compare who gets the 2 AM phone call.</p>
          )}
          <p className="d-note">Rule of thumb: the more layers the provider runs, the less you can customise, and the less can go wrong on your side.</p>
        </div>
      </div>
      <Legend />
    </div>
  );
}
