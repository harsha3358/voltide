import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../../src/lib/motion.js';
import { award, badge } from '../../../src/lib/game.js';

// Same app, two ways to put it online. IaaS: you do every step. PaaS (Google
// App Engine): you write one config file and run one command.
const IAAS = ['Launch a VM', 'Install Python', 'Copy your code', 'Install packages', 'Open port in firewall', 'Keep it running (systemd)', 'Set up auto-scaling', 'Patch the OS monthly'];
const PAAS = ['Write app.yaml', 'gcloud app deploy', 'Auto-scaling: built in'];

export default function DeployRace() {
  const ref = useRef(null);
  const [state, setState] = useState('ready');
  const { contextSafe } = useGSAP({ scope: ref });
  const go = contextSafe(() => {
    setState('racing');
    gsap.set('.dr-step', { opacity: 0.25 });
    const tl = gsap.timeline({ onComplete: () => { setState('done'); if (award('demo:race', 80, 'PaaS wins the deploy race')) badge('paas-pilot'); } });
    tl.to('.dr-paas .dr-step', { opacity: 1, stagger: 0.5, duration: 0.3 }, 0)
      .to('.dr-paas .dr-flag', { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(3)' }, 1.6)
      .to('.dr-iaas .dr-step', { opacity: 1, stagger: 0.55, duration: 0.3 }, 0)
      .to('.dr-iaas .dr-flag', { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(3)' }, 4.6);
  });
  const Lane = ({ cls, title, steps, color, note }) => (
    <div className={`d-panel ${cls}`} style={{ borderColor: color }}>
      <div className="d-row" style={{ justifyContent: 'space-between' }}>
        <span className="d-label" style={{ color, margin: 0 }}>{title}</span>
        <span className="dr-flag badge" style={{ color, opacity: 0, transform: 'scale(.6)' }}>🏁 deployed</span>
      </div>
      <ol className="missions" style={{ marginTop: 10 }}>
        {steps.map((s, i) => <li key={s} className="dr-step" style={{ opacity: 0.25 }}><span>{i + 1}.</span><span>{s}</span></li>)}
      </ol>
      <p className="d-note" style={{ marginBottom: 0 }}>{note}</p>
    </div>
  );
  return (
    <div ref={ref}>
      <button type="button" className="btn btn--primary" onClick={go} disabled={state === 'racing'}>{state === 'done' ? '↻ Race again' : '▶ Start the deploy race'}</button>
      <div className="d-grid" style={{ marginTop: 14 }}>
        <Lane cls="dr-iaas" title="IaaS · AWS EC2 (you manage it)" steps={IAAS} color="var(--warn)" note="Total control, total responsibility. Great for learning how servers work." />
        <Lane cls="dr-paas" title="PaaS · Google App Engine" steps={PAAS} color="var(--ok)" note="Less control, way less work. Google handles servers, scaling and patches." />
      </div>
    </div>
  );
}
