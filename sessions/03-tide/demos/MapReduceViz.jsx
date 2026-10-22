import { useEffect, useMemo, useState } from 'react';
import { award, badge } from '../../../src/lib/game.js';

// Hadoop's big idea, MapReduce, on a tiny scale: split the text across
// "machines", count words in parallel (map), group them (shuffle), add up (reduce).
const DEFAULT = 'cloud is fast\ncloud is cheap\nfast cloud wins\ncheap is good';
const STAGES = ['Input split', 'Map', 'Shuffle', 'Reduce'];

export default function MapReduceViz() {
  const [text, setText] = useState(DEFAULT);
  const [stage, setStage] = useState(0);
  const lines = text.split('\n').map(l => l.trim().toLowerCase()).filter(Boolean).slice(0, 6);
  const mapped = useMemo(() => lines.map(l => l.split(/\s+/).map(w => [w.replace(/[^a-z0-9]/g, ''), 1]).filter(([w]) => w)), [text]);
  const shuffled = useMemo(() => {
    const g = {};
    mapped.flat().forEach(([w]) => (g[w] = (g[w] || 0) + 1));
    return Object.entries(g).sort((a, b) => b[1] - a[1]);
  }, [mapped]);
  useEffect(() => {
    if (stage === 3 && award('demo:mapreduce', 80, 'MapReduce word count done')) badge('big-data');
  }, [stage]);
  return (
    <div>
      <div className="d-row" style={{ marginBottom: 12 }}>
        {STAGES.map((s, i) => (
          <button key={s} type="button" className={`btn btn--sm ${stage === i ? 'btn--primary' : ''}`} onClick={() => setStage(i)}>{i + 1}. {s}</button>
        ))}
        <button type="button" className="btn btn--sm btn--ghost" disabled={stage === 3} onClick={() => setStage(stage + 1)}>Next →</button>
      </div>
      <div className="split-1-2" style={{ gridTemplateColumns: 'minmax(200px, 0.8fr) minmax(0, 1.6fr)' }}>
        <div>
          <label className="d-label" htmlFor="mr-text">Input (one line per document)</label>
          <textarea id="mr-text" className="input" style={{ width: '100%', minHeight: 150, fontFamily: 'var(--font-mono)' }} value={text} onChange={e => { setText(e.target.value); setStage(0); }} />
        </div>
        <div className="d-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', alignContent: 'start' }}>
          {stage < 2 &&
            lines.map((l, i) => (
              <div key={i} className="d-panel" style={{ borderColor: 'var(--accent)' }}>
                <span className="d-label">Machine {i + 1}</span>
                {stage === 0 ? <div className="d-mono">{l}</div> : mapped[i].map(([w], k) => <div key={k} className="d-mono">({w}, 1)</div>)}
              </div>
            ))}
          {stage >= 2 &&
            shuffled.map(([w, n]) => (
              <div key={w} className="d-panel" style={{ borderColor: stage === 3 ? 'var(--ok)' : 'var(--warn)' }}>
                <span className="d-label">{stage === 2 ? 'Group' : 'Reducer'}: {w}</span>
                <div className="d-mono">{stage === 2 ? `(${w}, [${Array(n).fill(1).join(', ')}])` : <strong style={{ fontSize: 20 }}>{w} = {n}</strong>}</div>
              </div>
            ))}
        </div>
      </div>
      <p className="d-note">Real Hadoop does exactly this over thousands of machines and terabytes of logs. Edit the text and run it again.</p>
    </div>
  );
}
