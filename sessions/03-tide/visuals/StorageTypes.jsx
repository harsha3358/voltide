import SpotlightCard from '../../../src/vendor/reactbits/SpotlightCard/SpotlightCard.jsx';
import { Icon } from '../../../src/components/Glyphs.jsx';

const TYPES = [
  ['database', 'Block storage · EBS', 'The VM’s hard disk. Attached to one instance; holds the OS and your app.', 'Like your laptop’s SSD.', '#53eafd', 'https://aws.amazon.com/ebs/'],
  ['cloud', 'Object storage · S3', 'Store any file (photos, PDFs, backups) and get a URL. Practically unlimited.', 'Like Google Drive for apps.', '#ffdf20', 'https://aws.amazon.com/s3/'],
  ['layers', 'File storage · EFS', 'A shared folder many VMs can use at once.', 'Like a shared network drive in a lab.', '#46ecd5', 'https://aws.amazon.com/efs/']
];

export default function StorageTypes() {
  return (
    <div className="d-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))' }}>
      {TYPES.map(([icon, name, text, eg, color, url]) => (
        <SpotlightCard key={name} spotlightColor={color} intensity={0.2} style={{ padding: 20 }}>
          <Icon name={icon} size={30} color={color} />
          <h4 style={{ margin: '10px 0 6px', fontSize: '1.12rem' }}>{name}</h4>
          <p style={{ margin: '0 0 10px', fontSize: 14.5, color: 'var(--text-soft)' }}>{text}</p>
          <span className="badge" style={{ color }}>{eg}</span>
          <p style={{ margin: '10px 0 0', fontSize: 13 }}><a href={url} target="_blank" rel="noopener noreferrer" className="ext">Official page</a></p>
        </SpotlightCard>
      ))}
    </div>
  );
}
