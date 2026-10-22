import { useEffect, useState } from 'react';
import { award, badge } from '../../../src/lib/game.js';
import { useSpark } from '../../../src/components/Spark.jsx';

// A practice version of the AWS "Launch an instance" page. Pick sensible
// options, press Launch, and get a (pretend) running server. No bill.
const AMIS = ['Ubuntu Server 24.04 LTS', 'Amazon Linux 2023', 'Windows Server 2022'];
const TYPES = [
  ['t3.micro', '2 vCPU · 1 GB', true],
  ['t3.small', '2 vCPU · 2 GB', false],
  ['m5.4xlarge', '16 vCPU · 64 GB', false]
];

export default function LaunchWizard() {
  const [name, setName] = useState('');
  const [ami, setAmi] = useState(AMIS[0]);
  const [type, setType] = useState('t3.micro');
  const [key, setKey] = useState(false);
  const [ssh, setSsh] = useState('myip');
  const [http, setHttp] = useState(true);
  const [disk, setDisk] = useState(8);
  const [launched, setLaunched] = useState(null);
  const burst = useSpark();

  const issues = [];
  if (!name.trim()) issues.push('Give it a name tag (e.g. ravi-web-1) so you can find it later.');
  if (!TYPES.find(t => t[0] === type)[2]) issues.push(`${type} is not free-tier. For practice, pick t3.micro.`);
  if (!key) issues.push('Create or choose a key pair, or you can’t SSH in.');
  if (ssh === 'anywhere') issues.push('SSH from anywhere (0.0.0.0/0) invites every bot on the internet. Use My IP.');
  if (!http) issues.push('Allow HTTP (80) so people can see your website.');
  if (disk > 30) issues.push('Free tier covers up to 30 GB of disk. 8 GB is plenty.');
  const perfect = issues.length === 0;

  const launch = e => {
    setLaunched({ id: `i-0${Math.random().toString(16).slice(2, 10)}`, ip: `13.233.${10 + Math.floor(Math.random() * 200)}.${2 + Math.floor(Math.random() * 250)}`, perfect });
    burst(e.currentTarget);
  };
  useEffect(() => {
    if (launched?.perfect && award('demo:launch', 150, 'Perfect EC2 launch')) badge('launcher');
  }, [launched]);

  return (
    <div className="split-2-1">
      <form className="d-panel" onSubmit={e => e.preventDefault()} style={{ display: 'grid', gap: 12 }}>
        <span className="d-label">EC2 · Launch an instance (practice) · region ap-south-1 (Mumbai)</span>
        <label className="d-note" style={{ margin: 0 }} htmlFor="lw-name">1 · Name</label>
        <input id="lw-name" className="input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. ravi-web-1" />
        <label className="d-note" style={{ margin: 0 }} htmlFor="lw-ami">2 · Operating system image (AMI)</label>
        <select id="lw-ami" className="input" value={ami} onChange={e => setAmi(e.target.value)}>{AMIS.map(a => <option key={a}>{a}</option>)}</select>
        <span className="d-note" style={{ margin: 0 }}>3 · Instance type</span>
        <div className="seg">
          {TYPES.map(([t, spec, free]) => (
            <button key={t} type="button" aria-pressed={type === t} onClick={() => setType(t)}>
              {t} <small style={{ opacity: 0.75 }}>({spec}){free ? ' · free tier' : ''}</small>
            </button>
          ))}
        </div>
        <label className="hyg" style={{ cursor: 'pointer' }}>
          <input type="checkbox" checked={key} onChange={e => setKey(e.target.checked)} />
          <span>4 · Create key pair <code>ravi-key.pem</code> (downloaded once, keep it secret)</span>
        </label>
        <span className="d-note" style={{ margin: 0 }}>5 · Network settings (security group)</span>
        <div className="seg">
          <button type="button" aria-pressed={ssh === 'myip'} className="is-safe" onClick={() => setSsh('myip')}>SSH from My IP</button>
          <button type="button" aria-pressed={ssh === 'anywhere'} className="is-danger" onClick={() => setSsh('anywhere')}>SSH from Anywhere</button>
        </div>
        <label className="hyg" style={{ cursor: 'pointer' }}>
          <input type="checkbox" checked={http} onChange={e => setHttp(e.target.checked)} />
          <span>Allow HTTP traffic from the internet (port 80)</span>
        </label>
        <label className="d-note" style={{ margin: 0 }} htmlFor="lw-disk">6 · Storage: {disk} GB gp3</label>
        <input id="lw-disk" className="range" type="range" min="8" max="100" value={disk} onChange={e => setDisk(+e.target.value)} />
        <button type="button" className="btn btn--primary" onClick={launch}>🚀 Launch instance</button>
      </form>
      <div className="d-panel" style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
        <span className="d-label">Pre-flight check · {perfect ? '✅ all good' : `${issues.length} to fix`}</span>
        {issues.length ? (
          <ul className="points" style={{ margin: 0 }}>{issues.map(t => <li key={t}>{t}</li>)}</ul>
        ) : (
          <p className="d-note d-good" style={{ margin: 0 }}>Free tier, key pair, SSH locked to your IP, website open. Chef’s kiss.</p>
        )}
        {launched && (
          <div className="d-panel" style={{ borderColor: launched.perfect ? 'var(--ok)' : 'var(--warn)' }}>
            <span className="d-label">Instance state: <span className="d-good">● Running</span></span>
            <p className="d-mono" style={{ margin: '4px 0' }}>{launched.id} · {type} · {ami}</p>
            <p className="d-mono" style={{ margin: '4px 0' }}>Public IPv4: {launched.ip}</p>
            <pre className="code-view" style={{ marginTop: 8 }}>{`chmod 400 ravi-key.pem
ssh -i ravi-key.pem ubuntu@${launched.ip}`}</pre>
            {!launched.perfect && <p className="d-note d-warn">It launched, but fix the warnings before doing this for real.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
