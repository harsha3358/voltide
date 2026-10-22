import { useEffect, useState } from 'react';
import Scene3D from '../../../src/components/Scene3D.jsx';
import { award } from '../../../src/lib/game.js';
import Legend from '../../../src/components/LayerLegend.jsx';

// VMs vs containers as stacked layers on one machine. Start apps and watch
// the difference: every VM drags a whole operating system along, every
// container shares the host's kernel and appears almost instantly.
const SPEC = {
  vm: {
    base: [
      { label: 'Hardware · CPU, RAM, disk', owner: 'net' },
      { label: 'Host OS · Windows / macOS / Linux', owner: 'shared' },
      { label: 'Hypervisor · VirtualBox / VMware', owner: 'cloud' }
    ],
    col: i => ({ title: `VM ${i + 1}`, layers: [{ label: 'Guest OS · full Ubuntu', owner: 'shared', h: 2.4 }, { label: 'Libraries', owner: 'app' }, { label: `App ${i + 1}`, owner: 'you' }] }),
    boot: 2600,
    size: 4.5,
    ram: 1.5,
    stagger: 0.42
  },
  container: {
    base: [
      { label: 'Hardware · CPU, RAM, disk', owner: 'net' },
      { label: 'Host OS · one shared Linux kernel', owner: 'shared' },
      { label: 'Container engine · Docker', owner: 'cloud' }
    ],
    col: i => ({ title: `Container ${i + 1}`, layers: [{ label: 'Libraries', owner: 'app' }, { label: `App ${i + 1}`, owner: 'you' }] }),
    boot: 300,
    size: 0.2,
    ram: 0.1,
    stagger: 0.04
  }
};

export default function VmContainer3D() {
  const [mode, setMode] = useState('vm');
  const [apps, setApps] = useState(2);
  const [booting, setBooting] = useState(false);
  const [tried, setTried] = useState(() => new Set(['vm']));
  const s = SPEC[mode];
  useEffect(() => {
    setBooting(true);
    const t = setTimeout(() => setBooting(false), s.boot);
    return () => clearTimeout(t);
  }, [mode, apps]);
  useEffect(() => {
    if (tried.size === 2) award('demo:vm3d', 40, 'Compared VMs and containers in 3D');
  }, [tried]);
  const params = { base: s.base, columns: Array.from({ length: apps }, (_, i) => s.col(i)), stagger: s.stagger };
  const fmt = n => (n >= 1 ? `${n.toFixed(1)} GB` : `${Math.round(n * 1000)} MB`);
  return (
    <div>
      <div className="d-row" style={{ marginBottom: 12 }}>
        <div className="seg">
          <button type="button" aria-pressed={mode === 'vm'} onClick={() => (setMode('vm'), setTried(t => new Set(t).add('vm')))}>Virtual machines</button>
          <button type="button" aria-pressed={mode === 'container'} onClick={() => (setMode('container'), setTried(t => new Set(t).add('container')))}>Containers</button>
        </div>
        <button type="button" className="btn btn--sm" disabled={apps >= 4} onClick={() => setApps(apps + 1)}>+ Start another app</button>
        <button type="button" className="btn btn--sm btn--ghost" disabled={apps <= 1} onClick={() => setApps(apps - 1)}>− Stop one</button>
      </div>
      <div className="layer-demo">
        <Scene3D name="layers" params={params} className="layer-demo__scene" label={`${apps} apps running as ${mode === 'vm' ? 'virtual machines, each with its own guest operating system' : 'containers sharing one operating system kernel'}.`} />
        <div className="d-panel layer-demo__panel">
          <span className="d-label">{apps} {mode === 'vm' ? 'VMs' : 'containers'} · {booting ? 'starting…' : 'running'}</span>
          <div className="d-big" style={{ fontSize: 28, color: booting ? 'var(--warn)' : 'var(--ok)' }}>{booting ? (mode === 'vm' ? 'Booting Ubuntu…' : 'Starting…') : 'All running ✓'}</div>
          <table className="table-sim" style={{ marginTop: 12, fontFamily: 'var(--font-body)' }}>
            <tbody>
              <tr><td>Start-up time (each)</td><td><strong>{mode === 'vm' ? '~1 minute' : '~1 second'}</strong></td></tr>
              <tr><td>Disk used (total)</td><td><strong>{fmt(apps * s.size)}</strong></td></tr>
              <tr><td>RAM used (total)</td><td><strong>{fmt(apps * s.ram)}</strong></td></tr>
              <tr><td>Fits on an 8 GB laptop</td><td><strong>{mode === 'vm' ? 'about 3–4' : 'dozens'}</strong></td></tr>
            </tbody>
          </table>
          <p className="d-note">{mode === 'vm' ? 'Each VM carries a whole operating system: strong isolation, but heavy. This is what an EC2 instance is.' : 'Containers share the host’s kernel, so they’re tiny and start almost instantly. This is how most cloud apps ship today.'}</p>
        </div>
      </div>
      <Legend items={[['net', 'Hardware'], ['shared', 'Operating system'], ['cloud', 'Virtualisation layer'], ['app', 'Libraries'], ['you', 'Your app']]} />
    </div>
  );
}
