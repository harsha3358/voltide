import { useEffect, useRef, useState } from 'react';
import { award, badge } from '../../../src/lib/game.js';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../../src/lib/motion.js';

// Who manages what? Pick a model and the provider's "water level" rises up the
// stack. Everything above the waterline is still YOUR job to secure.
const LAYERS = ['Applications', 'Data', 'Runtime', 'Middleware', 'Operating system', 'Virtualisation', 'Servers', 'Storage', 'Networking'];
const MODELS = {
  onprem: { name: 'On-premises', provider: 0, eg: 'The college’s own server room', you: 'Everything: power, hardware, patches, backups, apps and data.', water: 'Digging your own well: you own and maintain every pipe.' },
  iaas: { name: 'IaaS', provider: 4, eg: 'AWS EC2, Azure Virtual Machines, Google Compute Engine', you: 'The OS and everything above it: updates, firewall rules, apps, user accounts and data.', water: 'Renting a water tank: the supplier fills it; you plumb and clean your side.' },
  paas: { name: 'PaaS', provider: 7, eg: 'Google App Engine, Azure App Service, Heroku', you: 'Your code and your data: secure coding, access control, secrets.', water: 'Piped water to a tap: you just decide what to do with it.' },
  saas: { name: 'SaaS', provider: 8, eg: 'Gmail, Google Docs, Zoom, MS Teams', you: 'Your account and your data: strong password, MFA, sharing settings.', water: 'Bottled water: ready to drink, you only choose who you share it with.' }
};

export default function ServiceModels() {
  const [m, setM] = useState('iaas');
  const [seen, setSeen] = useState(() => new Set(['iaas']));
  useEffect(() => {
    setSeen(prev => new Set(prev).add(m));
  }, [m]);
  useEffect(() => {
    if (seen.size === 4 && award('demo:cloud', 60, 'All four cloud models explored')) badge('cloud-walker');
  }, [seen]);
  const ref = useRef(null);
  const model = MODELS[m];
  const ROW = 34;
  const H = LAYERS.length * ROW;
  useGSAP(() => {
    gsap.to('.sm-water', { attr: { y: H - model.provider * ROW, height: model.provider * ROW }, duration: 0.9, ease: 'power3.out' });
  }, { scope: ref, dependencies: [m] });
  return (
    <div ref={ref}>
      <div className="seg" style={{ marginBottom: 14 }}>
        {Object.entries(MODELS).map(([k, v]) => (
          <button key={k} type="button" aria-pressed={m === k} onClick={() => setM(k)}>
            {v.name}
          </button>
        ))}
      </div>
      <div className="split-stack">
        <svg viewBox={`0 0 320 ${H + 10}`} role="img" aria-label={`${model.name}: provider manages the bottom ${model.provider} of ${LAYERS.length} layers`}>
          <defs>
            <clipPath id="sm-clip">
              <rect x="0" y="0" width="320" height={H} rx="14" />
            </clipPath>
          </defs>
          <g clipPath="url(#sm-clip)">
            <rect x="0" y="0" width="320" height={H} fill="rgba(255,210,63,.10)" />
            <rect className="sm-water" x="0" y={H} width="320" height="0" fill="rgba(46,230,197,.28)" />
          </g>
          {LAYERS.map((l, i) => {
            const provider = i >= LAYERS.length - model.provider;
            return (
              <g key={l}>
                <rect x="6" y={i * ROW + 4} width="308" height={ROW - 6} rx="8" fill="none" stroke={provider ? 'var(--tide)' : 'var(--spark)'} strokeOpacity=".55" />
                <text x="20" y={i * ROW + 23} fontFamily="Space Grotesk" fontSize="14" fill="var(--text)">{l}</text>
                <text x="300" y={i * ROW + 23} textAnchor="end" fontFamily="Inter" fontSize="12" fill={provider ? 'var(--tide)' : 'var(--spark)'}>
                  {provider ? 'provider' : 'you'}
                </text>
              </g>
            );
          })}
        </svg>
        <div>
          <div className="d-panel" aria-live="polite">
            <span className="d-label">{model.name}</span>
            <p style={{ margin: '0 0 10px' }}><strong>Examples:</strong> {model.eg}</p>
            <p style={{ margin: '0 0 10px' }}><strong style={{ color: 'var(--spark)' }}>Your job:</strong> {model.you}</p>
            <p style={{ margin: 0, color: 'var(--text-soft)' }}><strong style={{ color: 'var(--tide)' }}>Water analogy:</strong> {model.water}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
