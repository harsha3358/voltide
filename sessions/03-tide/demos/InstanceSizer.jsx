import { useState } from 'react';

// Pick what you're running; see a sensible machine size. Like choosing RAM and
// CPUs in VirtualBox, but in the cloud.
const WORKLOADS = [
  ['Personal portfolio page', 't3.micro', 2, 1, 'Free tier', 'A static page barely uses the CPU. Smallest size wins.'],
  ['Club website + small database', 't3.small', 2, 2, '≈ ₹1.5/hr (example)', 'A bit more RAM for the database.'],
  ['College fest site on results day', '4 × t3.medium + load balancer', 8, 16, '≈ ₹15/hr while busy (example)', 'Better: several small servers that auto-scale, not one giant one.'],
  ['Training an AI model', 'g5.xlarge (GPU)', 4, 16, '≈ ₹90/hr (example)', 'Needs a GPU. Run it for a few hours, then stop it!'],
  ['Big-data crunching with Hadoop', 'cluster of m5.xlarge', 16, 64, '≈ ₹40/hr (example)', 'Many machines working together (more in the serverless & Hadoop mission).']
];

export default function InstanceSizer() {
  const [i, setI] = useState(0);
  const [name, type, cpu, ram, cost, why] = WORKLOADS[i];
  return (
    <div className="split-1-2" style={{ gridTemplateColumns: 'minmax(220px, 1fr) minmax(0, 1.4fr)' }}>
      <div style={{ display: 'grid', gap: 8 }}>
        {WORKLOADS.map(([n], k) => (
          <button key={n} type="button" className={`btn btn--sm ${i === k ? 'btn--primary' : ''}`} style={{ justifyContent: 'flex-start' }} onClick={() => setI(k)}>{n}</button>
        ))}
      </div>
      <div className="d-panel">
        <span className="d-label">{name}</span>
        <p className="d-big" style={{ fontSize: '1.6rem', color: 'var(--accent)', margin: '4px 0 12px' }}>{type}</p>
        <div className="d-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
          <div><span className="d-label">vCPUs</span><div className="d-big">{cpu}</div></div>
          <div><span className="d-label">RAM</span><div className="d-big">{ram} GB</div></div>
          <div><span className="d-label">Cost</span><div style={{ fontWeight: 700 }}>{cost}</div></div>
        </div>
        <div className="meter" style={{ margin: '14px 0 6px' }}><i style={{ width: `${Math.min(100, (cpu / 16) * 100)}%`, '--meter-full': `${(100 / Math.max(1, (cpu / 16) * 100)) * 100}%` }} /></div>
        <p className="d-note" style={{ margin: 0 }}>{why}</p>
      </div>
    </div>
  );
}
