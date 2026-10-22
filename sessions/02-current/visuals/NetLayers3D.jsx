import { useEffect, useState } from 'react';
import Scene3D from '../../../src/components/Scene3D.jsx';
import { award } from '../../../src/lib/game.js';

// The TCP/IP layers on both machines. A message goes DOWN your laptop's
// stack (each layer wraps it in its own header), across the network, and
// UP the server's stack (each layer unwraps its header). Then back again.
const PROTOS = {
  https: { app: 'HTTPS', t: 'TCP', port: 443, ask: 'GET /results', reply: '200 OK + the page' },
  dns: { app: 'DNS', t: 'UDP', port: 53, ask: 'where is college.ac.in?', reply: '203.0.113.10' },
  ssh: { app: 'SSH', t: 'TCP', port: 22, ask: 'ls -l', reply: 'your file list' }
};
const ME = '49.36.12.88';
const SRV = '13.233.10.7';

const stack = p => [
  { label: 'Link · Wi-Fi / Ethernet', owner: 'net' },
  { label: 'Internet · IP address', owner: 'cloud' },
  { label: `Transport · ${p.t} port ${p.port}`, owner: 'shared' },
  { label: `Application · ${p.app}`, owner: 'you' }
];

const STEPS = [
  ['Application', 'writes the message'],
  ['Transport', 'adds the port number (which program?)'],
  ['Internet', 'adds the IP addresses (which computer?)'],
  ['Link', 'puts it in a Wi-Fi / Ethernet frame and sends it']
];

export default function NetLayers3D() {
  const [proto, setProto] = useState('https');
  const [flow, setFlow] = useState(null);
  const [sent, setSent] = useState(() => new Set());
  const p = PROTOS[proto];
  useEffect(() => {
    if (sent.size >= 3) award('demo:netlayers', 60, 'Sent a message through every layer');
  }, [sent]);
  const send = back => {
    const down = (from, to, msg) => [
      msg,
      `+ ${p.t} header · port ${p.port}`,
      `+ IP header · ${from} → ${to}`,
      '+ Wi-Fi frame · off it goes'
    ];
    const tags = back
      ? [...down(SRV, ME, p.reply), 'frame arrives · strip it', `IP ${ME}: that’s me · strip it`, `${p.t} port → your ${p.app} app`, `${p.reply} ✓`]
      : [...down(ME, SRV, p.ask), 'frame arrives · strip it', `IP ${SRV}: that’s me · strip it`, `${p.t} port ${p.port} → ${p.app} server`, `${p.app} server reads: ${p.ask} ✓`];
    const from = back ? 1 : 0;
    const to = 1 - from;
    setFlow({ key: Date.now(), path: [`c:${from}:3`, `c:${from}:2`, `c:${from}:1`, `c:${from}:0`, `c:${to}:0`, `c:${to}:1`, `c:${to}:2`, `c:${to}:3`], tags, color: back ? '#3ef09a' : '#ffdf20' });
    setSent(s => new Set(s).add(`${proto}:${back ? 'r' : 's'}`));
  };
  const params = { columns: [{ title: 'Your laptop', layers: stack(p) }, { title: 'Cloud server', layers: stack(p) }], flow };
  return (
    <div>
      <div className="d-row" style={{ marginBottom: 12 }}>
        <div className="seg">
          {Object.entries(PROTOS).map(([k, v]) => (
            <button key={k} type="button" aria-pressed={proto === k} onClick={() => (setProto(k), setFlow(null))}>{v.app} · {v.t} {v.port}</button>
          ))}
        </div>
        <button type="button" className="btn btn--sm btn--primary" onClick={() => send(false)}>▶ Send request</button>
        <button type="button" className="btn btn--sm" onClick={() => send(true)}>◀ Send reply</button>
      </div>
      <div className="layer-demo">
        <Scene3D name="layers" params={params} className="layer-demo__scene" label={`Two network stacks, your laptop and a cloud server, each with link, internet, transport (${p.t} port ${p.port}) and application (${p.app}) layers.`} />
        <div className="d-panel layer-demo__panel">
          <span className="d-label">Going down (sending)</span>
          <ol className="missions">{STEPS.map(([l, d]) => <li key={l}><span>↓</span><span><strong>{l}</strong> {d}</span></li>)}</ol>
          <span className="d-label" style={{ marginTop: 12 }}>Going up (receiving)</span>
          <p className="d-note" style={{ marginTop: 0 }}>Each layer on the other side removes <em>its own</em> header and passes the rest up, until the app gets the original message.</p>
          <p className="d-note">{p.t === 'UDP' ? 'UDP just fires the packet: no handshake, no delivery check. Perfect for quick DNS lookups.' : 'TCP checks every piece arrives, in order. That’s why web pages and SSH use it.'}</p>
        </div>
      </div>
    </div>
  );
}
