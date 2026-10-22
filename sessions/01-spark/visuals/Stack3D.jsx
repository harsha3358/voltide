import { useEffect, useState } from 'react';
import Scene3D from '../../../src/components/Scene3D.jsx';
import Legend from '../../../src/components/LayerLegend.jsx';
import { award } from '../../../src/lib/game.js';
import { ANALOGIES, MODEL_KEYS, MODEL_TAGS, QUIZ, layersFor, ownerOf } from '../../../src/lib/serviceAnalogies.js';

// IaaS, PaaS and SaaS as layers, explained four ways (real tech, pizza,
// getting around, a place to live). Each style has its own colours, layers,
// brands and events. View one model at a time or all four side by side, throw
// an event at the stack to see whose job it is, then try the quick-fire round.
export default function Stack3D() {
  const [style, setStyle] = useState('tech');
  const [model, setModel] = useState('iaas');
  const [view, setView] = useState('one');
  const [hit, setHit] = useState(null);
  const [styles, setStyles] = useState(() => new Set(['tech']));
  const a = ANALOGIES[style];
  const m = a.models[model];
  const event = hit && a.events.find(e => e.id === hit.id);

  useEffect(() => {
    if (styles.size === 4) award('demo:analogies', 80, 'Saw IaaS, PaaS and SaaS four different ways');
  }, [styles]);

  const pick = s => {
    setStyle(s);
    setHit(null);
    setStyles(x => new Set(x).add(s));
  };
  const refsFor = (prefix, e) => (e.id === 'traffic' && style === 'tech' ? [`${prefix}2`, `${prefix}3`] : [`${prefix}${e.layer}`]);
  const kindFor = mk => (ownerOf(style, mk, event) === 'cloud' ? 'cloud' : 'bad');

  const params =
    view === 'one'
      ? {
          base: layersFor(style, model),
          pulse: event ? { key: hit.key, refs: refsFor('b:', event).map(r => [r, kindFor(model)]) } : undefined
        }
      : {
          columns: MODEL_KEYS.map(k => ({ title: MODEL_TAGS[k], layers: layersFor(style, k) })),
          pulse: event ? { key: hit.key, refs: MODEL_KEYS.flatMap((k, j) => refsFor(`c:${j}:`, event).map(r => [r, kindFor(k)])) } : undefined
        };

  const mine = a.layers.slice(m.managed);
  const theirs = a.layers.slice(0, m.managed);

  return (
    <div className={`svc svc--${style}`} style={{ '--an-cloud': a.colors.cloud, '--an-you': a.colors.you }}>
      <span className="d-label">Explain it with</span>
      <div className="svc__styles">
        {Object.entries(ANALOGIES).map(([k, v]) => (
          <button key={k} type="button" className={`svc__style ${style === k ? 'is-on' : ''}`} onClick={() => pick(k)}>
            <span aria-hidden="true">{v.icon}</span>
            {v.name}
          </button>
        ))}
      </div>

      <div className="svc__models">
        {MODEL_KEYS.map(k => (
          <button key={k} type="button" className={`svc__model ${model === k ? 'is-on' : ''}`} onClick={() => (setModel(k), setHit(null))}>
            <small>{MODEL_TAGS[k]}</small>
            {a.models[k].title}
          </button>
        ))}
      </div>

      <div className="seg" style={{ margin: '4px 0 12px' }}>
        <button type="button" aria-pressed={view === 'one'} onClick={() => setView('one')}>One at a time</button>
        <button type="button" aria-pressed={view === 'all'} onClick={() => setView('all')}>All four side by side</button>
      </div>

      <div className={`layer-demo ${view === 'all' ? 'layer-demo--wide' : ''}`}>
        <Scene3D
          name="layers"
          params={params}
          className="layer-demo__scene"
          label={view === 'one' ? `${a.name}: ${m.title} (${MODEL_TAGS[model]}). The ${a.provider.toLowerCase()} runs ${m.managed} of ${a.layers.length} layers.` : `${a.name}: on-premises, IaaS, PaaS and SaaS stacks side by side.`}
        />
        <div className="d-panel layer-demo__panel svc__card">
          <div className="svc__badge">{a.icon} {MODEL_TAGS[model]}</div>
          <div className="d-big" style={{ fontSize: 26, marginTop: 8 }}>{m.title}</div>
          <p style={{ margin: '8px 0 10px' }}>{m.line}</p>
          <div className="svc__chips">
            {m.brands.map(b =>
              b.url ? (
                <a key={b.name} href={b.url} target="_blank" rel="noopener noreferrer" className="svc__chip">{b.name} ↗</a>
              ) : (
                <span key={b.name} className="svc__chip">{b.name}</span>
              )
            )}
          </div>
          <div className="svc__split">
            <div>
              <span className="d-label" style={{ color: 'var(--an-cloud)' }}>{a.provider} does</span>
              <ul className="missions">{theirs.length ? theirs.map(l => <li key={l}><span>✓</span><span>{l}</span></li>) : <li><span>–</span><span>Nothing. It’s all you.</span></li>}</ul>
            </div>
            <div>
              <span className="d-label" style={{ color: 'var(--an-you)' }}>You do</span>
              <ul className="missions">{mine.length ? mine.map(l => <li key={l}><span>•</span><span>{l}</span></li>) : <li><span>😎</span><span>Nothing but enjoy it.</span></li>}</ul>
            </div>
          </div>
        </div>
      </div>

      <span className="d-label" style={{ marginTop: 14 }}>Something happens. Whose problem is it?</span>
      <div className="d-row" style={{ gap: 6 }}>
        {a.events.map(e => (
          <button key={e.id} type="button" className={`btn btn--sm ${hit?.id === e.id ? 'btn--primary' : ''}`} onClick={() => setHit({ id: e.id, key: Date.now() })}>{e.name}</button>
        ))}
      </div>
      {event &&
        (view === 'one' ? (
          <p className={`layer-demo__verdict ${kindFor(model) === 'cloud' ? 'is-cloud' : 'is-you'}`} role="status">
            {kindFor(model) === 'cloud' ? <><strong>{a.provider} handles it.</strong> You probably won’t even notice. That’s what you’re paying for.</> : <><strong>That’s on you.</strong> {event.you}</>}
          </p>
        ) : (
          <div className="svc__verdicts" role="status">
            {MODEL_KEYS.map(k => (
              <div key={k} className={`layer-demo__verdict ${kindFor(k) === 'cloud' ? 'is-cloud' : 'is-you'}`}>
                <strong>{MODEL_TAGS[k]}</strong>
                <span>{kindFor(k) === 'cloud' ? `${a.provider} handles it` : 'Your problem'}</span>
              </div>
            ))}
          </div>
        ))}
      <Legend items={[['cloud', `Run by the ${a.provider.toLowerCase()}`, a.colors.cloud], ['you', 'Your job', a.colors.you]]} />

      <QuickFire />
    </div>
  );
}

function QuickFire() {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(null);
  const [score, setScore] = useState(0);
  const done = i >= QUIZ.length;
  useEffect(() => {
    if (done && score >= QUIZ.length - 1) award('demo:quickfire', 80, 'Quick-fire round: service models nailed');
  }, [done, score]);
  if (done)
    return (
      <div className="svc__quiz">
        <span className="d-label">Quick-fire round</span>
        <div className="d-big" style={{ fontSize: 26 }}>{score}/{QUIZ.length} {score === QUIZ.length ? '🏆' : score >= 5 ? '🔥' : '💪'}</div>
        <p style={{ margin: '6px 0 10px' }}>{score === QUIZ.length ? 'Flawless. You could teach this.' : 'Run it again until it’s automatic.'}</p>
        <button type="button" className="btn btn--sm" onClick={() => (setI(0), setScore(0), setPick(null))}>↺ Play again</button>
      </div>
    );
  const [q, ans, why] = QUIZ[i];
  return (
    <div className="svc__quiz">
      <span className="d-label">Quick-fire round · {i + 1}/{QUIZ.length}</span>
      <p style={{ margin: '0 0 10px', fontSize: 18, fontWeight: 600 }}>{q} is most like…</p>
      <div className="d-row" style={{ gap: 6 }}>
        {MODEL_KEYS.map(k => (
          <button
            key={k}
            type="button"
            className={`btn btn--sm ${pick === null ? '' : k === ans ? 'is-right' : k === pick ? 'is-wrong' : ''}`}
            disabled={pick !== null}
            onClick={() => {
              setPick(k);
              if (k === ans) setScore(s => s + 1);
            }}
          >
            {MODEL_TAGS[k]}
          </button>
        ))}
      </div>
      {pick !== null && (
        <p className="d-note">
          {pick === ans ? '✓ ' : '✗ '}
          {why}{' '}
          <button type="button" className="btn btn--sm btn--primary" style={{ marginLeft: 6 }} onClick={() => (setI(i + 1), setPick(null))}>Next →</button>
        </p>
      )}
    </div>
  );
}
