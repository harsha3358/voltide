import { useState } from 'react';
import Scene3D from '../../../src/components/Scene3D.jsx';

// The service-model stack as a 3D motion graphic. Same idea as the diagram
// above: cyan layers are the provider's job, yellow layers are yours.
const MODELS = [
  ['onprem', 'On-premises', 'You run all five layers. Including the AC in the server room.'],
  ['iaas', 'IaaS', 'The provider runs the hardware and virtualisation. You get a VM (e.g. EC2).'],
  ['paas', 'PaaS', 'Everything up to the runtime is handled. You just push code (e.g. App Engine).'],
  ['saas', 'SaaS', 'All five layers are theirs. You just log in (e.g. Gmail).']
];

export default function Stack3D() {
  const [model, setModel] = useState('iaas');
  const info = MODELS.find(m => m[0] === model);
  return (
    <div>
      <div className="seg" style={{ marginBottom: 12 }}>
        {MODELS.map(([k, l]) => (
          <button key={k} type="button" aria-pressed={model === k} onClick={() => setModel(k)}>{l}</button>
        ))}
      </div>
      <Scene3D name="stack" params={{ model }} label={`3D stack of five computing layers. ${info[1]}: ${info[2]}`} className="stack3d" />
      <p className="d-note">
        <strong style={{ color: '#53eafd' }}>Cyan = provider’s job</strong> · <strong style={{ color: '#ffdf20' }}>yellow = your job</strong>. {info[2]}
      </p>
    </div>
  );
}
