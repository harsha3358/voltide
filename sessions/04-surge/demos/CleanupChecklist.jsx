import { useEffect, useState } from 'react';
import { award, badge } from '../../../src/lib/game.js';
import { useSpark } from '../../../src/components/Spark.jsx';

// Stop what you start. Every resource from the workshop, with a link to the
// exact console page where you delete it.
const ITEMS = [
  ['Terminate the EC2 instance', 'EC2 → Instances → select → Instance state → Terminate.', 'https://console.aws.amazon.com/ec2/home#Instances:'],
  ['Release any Elastic IP', 'An Elastic IP that isn’t attached to a running instance is billed.', 'https://console.aws.amazon.com/ec2/home#Addresses:'],
  ['Delete leftover EBS volumes and snapshots', 'Volumes in the “available” state are still billed.', 'https://console.aws.amazon.com/ec2/home#Volumes:'],
  ['Empty and delete S3 buckets', 'Buckets → Empty → Delete.', 'https://console.aws.amazon.com/s3/'],
  ['Delete Lambda test functions', 'Lambda → Functions → Actions → Delete.', 'https://console.aws.amazon.com/lambda/'],
  ['Disable App Engine or shut down the GCP project', 'App Engine → Settings → Disable application.', 'https://console.cloud.google.com/appengine/settings'],
  ['Check the billing dashboard shows ₹0 forecast', 'Look at “Month-to-date” and “Forecasted” cost.', 'https://console.aws.amazon.com/billing/home'],
  ['Delete the key pair and the .pem file', 'EC2 → Key pairs → Delete. Then delete the file from your laptop.', 'https://console.aws.amazon.com/ec2/home#KeyPairs:']
];

export default function CleanupChecklist() {
  const [on, setOn] = useState(() => new Set());
  const burst = useSpark();
  const all = on.size === ITEMS.length;
  useEffect(() => {
    if (all && award('demo:cleanup', 120, 'Stopped what you started')) badge('clean-sweep');
  }, [all]);
  return (
    <div>
      <div className="meter" style={{ marginBottom: 12 }}><i style={{ width: `${(on.size / ITEMS.length) * 100}%` }} /></div>
      <div style={{ display: 'grid', gap: 8 }}>
        {ITEMS.map(([t, how, url], i) => (
          <label key={i} className={`hyg ${on.has(i) ? 'on' : ''}`}>
            <input
              type="checkbox"
              checked={on.has(i)}
              onChange={e => {
                const n = new Set(on);
                n.has(i) ? n.delete(i) : (n.add(i), burst?.(e.currentTarget));
                setOn(n);
              }}
            />
            <span>
              <span style={{ fontSize: 15 }}>{t}</span>
              <br />
              <span className="d-note" style={{ margin: 0, fontSize: 13 }}>
                {how}{' '}
                <a href={url} target="_blank" rel="noopener noreferrer" className="ext" onClick={e => e.stopPropagation()}>open console ↗</a>
              </span>
            </span>
          </label>
        ))}
      </div>
      <p className="d-note">{all ? '🧹 Clean sweep. Zero resources, zero surprise bills. LAGZILLA has nothing left to eat.' : `${on.size}/${ITEMS.length} cleaned up. Only tick what you actually deleted.`}</p>
    </div>
  );
}
