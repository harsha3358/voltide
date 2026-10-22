import { useEffect, useRef, useState } from 'react';
import Scene3D from '../../../src/components/Scene3D.jsx';
import { award } from '../../../src/lib/game.js';
import Legend from '../../../src/components/LayerLegend.jsx';

// Every layer a request passes through, from your friend's phone down to
// index.html. Break one layer and send the request: it stops exactly there,
// and the "phone" shows the real error a browser would show.
const LAYERS = [
  { label: 'index.html · /var/www/html', owner: 'you' },
  { label: 'nginx · listening on port 80', owner: 'app' },
  { label: 'ufw firewall · inside the VM', owner: 'shared' },
  { label: 'EC2 instance · Ubuntu', owner: 'cloud' },
  { label: 'Security group · AWS firewall', owner: 'cloud' },
  { label: 'The internet', owner: 'net' },
  { label: 'Friend’s phone · browser', owner: 'you' }
];
// Request travels top → bottom: phone (6) down to the file (0).
const PATH = [6, 5, 4, 3, 2, 1, 0].map(i => `b:${i}`);
const OK_TAGS = ['GET http://13.233.10.7/', '→ 13.233.10.7 across the internet', 'Security group: port 80 allowed ✓', 'EC2: instance running ✓', 'ufw: port 80 allowed ✓', 'nginx: got it, fetching the file ✓', '200 OK · your page! ✓'];
const FAULTS = [
  { id: 'https', label: 'Friend typed https://', at: 2, tag: '✗ port 443 not open · dropped', screen: ['This site can’t be reached', 'ERR_CONNECTION_TIMED_OUT'], fix: 'Your site has no HTTPS certificate yet. Type http:// explicitly.' },
  { id: 'myip', label: 'HTTP rule allows only “My IP”', at: 2, tag: '✗ not your IP · dropped', screen: ['This site can’t be reached', 'ERR_CONNECTION_TIMED_OUT'], fix: 'Edit the inbound rule: HTTP (80) from Anywhere (0.0.0.0/0). Keep SSH on My IP.' },
  { id: 'stopped', label: 'Instance stopped', at: 3, tag: '✗ nothing running here', screen: ['This site can’t be reached', 'ERR_CONNECTION_TIMED_OUT'], fix: 'Start the instance. Its public IP probably changed, so copy the new one.' },
  { id: 'ufw', label: 'ufw blocks port 80', at: 4, tag: '✗ ufw dropped it', screen: ['This site can’t be reached', 'ERR_CONNECTION_TIMED_OUT'], fix: "Run sudo ufw allow 'Nginx Full'." },
  { id: 'nginx', label: 'nginx not running', at: 5, tag: '✗ nobody listening on 80', screen: ['This site can’t be reached', 'ERR_CONNECTION_REFUSED'], fix: 'Run sudo systemctl enable --now nginx (and sudo nginx -t if it fails).' },
  { id: 'file', label: 'index.html in the wrong folder', at: 6, tag: '✗ serving the default page', screen: ['Welcome to nginx!', 'If you see this page, the nginx web server is successfully installed…'], fix: 'Move it: sudo mv ~/index.html /var/www/html/index.html' }
];

export default function RequestPath3D() {
  const [broken, setBroken] = useState(null);
  const [flow, setFlow] = useState(null);
  const [screen, setScreen] = useState(null);
  const [seen, setSeen] = useState(() => new Set());
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (seen.size >= FAULTS.length) award('demo:request', 80, 'Broke and fixed every layer');
  }, [seen]);
  const fault = FAULTS.find(f => f.id === broken);
  const send = () => {
    const stop = fault ? fault.at : null;
    const tags = OK_TAGS.map((t, i) => (fault && i === fault.at ? fault.tag : t));
    setFlow({ key: Date.now(), path: PATH, tags, stop, color: '#ffffff' });
    setScreen(null);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setScreen(fault ? { bad: true, lines: fault.screen } : { bad: false, lines: ['Team Nimbus', 'Our first website, deployed on a real cloud server.'] }), ((stop ?? PATH.length - 1) / 1.25) * 1000 + 200);
    if (fault) setSeen(s => new Set(s).add(fault.id));
  };
  return (
    <div>
      <span className="d-label">Break one layer (or none), then send the request</span>
      <div className="d-row" style={{ marginBottom: 12, gap: 6 }}>
        <button type="button" className={`btn btn--sm ${broken === null ? 'btn--primary' : 'btn--ghost'}`} onClick={() => (setBroken(null), setScreen(null))}>✓ Everything set up right</button>
        {FAULTS.map(f => (
          <button key={f.id} type="button" className={`btn btn--sm ${broken === f.id ? 'btn--primary' : 'btn--ghost'}`} onClick={() => (setBroken(f.id), setScreen(null))}>
            {seen.has(f.id) ? '✓ ' : ''}{f.label}
          </button>
        ))}
      </div>
      <div className="layer-demo">
        <Scene3D name="layers" params={{ base: LAYERS, flow }} className="layer-demo__scene" label="Seven layers a web request passes through, from a phone browser down to index.html on the server." />
        <div className="d-panel layer-demo__panel">
          <button type="button" className="btn btn--primary" onClick={send}>📱 Open the site on the phone</button>
          <div className={`phone-screen ${screen?.bad ? 'is-bad' : ''}`} aria-live="polite">
            <div className="phone-screen__bar">http://13.233.10.7/</div>
            {screen ? (
              <div className="phone-screen__body">
                <strong>{screen.lines[0]}</strong>
                <span>{screen.lines[1]}</span>
              </div>
            ) : (
              <div className="phone-screen__body phone-screen__body--wait">{flow ? 'Loading…' : 'Press the button to send the request'}</div>
            )}
          </div>
          {screen && (
            <p className={`layer-demo__verdict ${screen.bad ? 'is-you' : 'is-ok'}`}>
              {screen.bad ? <><strong>Fix:</strong> {fault.fix}</> : <><strong>It works.</strong> Every layer let the request through.</>}
            </p>
          )}
          <p className="d-note">Found {seen.size}/{FAULTS.length} ways to break it. A timeout means something dropped the request silently; “refused” means it reached the server but nothing was listening.</p>
        </div>
      </div>
      <Legend items={[['you', 'Your files and devices'], ['app', 'Web server'], ['shared', 'Firewall inside the VM'], ['cloud', 'AWS'], ['net', 'The internet']]} />
    </div>
  );
}
