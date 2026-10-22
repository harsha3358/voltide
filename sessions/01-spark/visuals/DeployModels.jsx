import SpotlightCard from '../../../src/vendor/reactbits/SpotlightCard/SpotlightCard.jsx';
import { Icon } from '../../../src/components/Glyphs.jsx';

// Where does the cloud live, and who shares it?
const MODELS = [
  ['globe', 'Public cloud', 'Shared, pay-as-you-go infrastructure run by AWS, Azure or Google, open to anyone with a card.', 'A startup hosting its app on AWS.', '#53eafd'],
  ['building', 'Private cloud', 'Cloud-style infrastructure used by one organisation only, in its own or a rented data centre.', 'A bank keeping customer data in-house.', '#ffdf20'],
  ['layers', 'Hybrid cloud', 'Private for sensitive stuff, public for everything else or the busy days. Connected together.', 'College keeps exam data private, hosts the fest site on public cloud.', '#46ecd5'],
  ['cloud', 'Multi-cloud', 'Using more than one public provider at once, e.g. AWS for servers and Google for AI.', 'A company avoiding lock-in to one vendor.', '#8e51ff']
];

export default function DeployModels() {
  return (
    <div className="d-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 210px), 1fr))' }}>
      {MODELS.map(([icon, name, text, eg, color]) => (
        <SpotlightCard key={name} spotlightColor={color} intensity={0.2} style={{ padding: 20 }}>
          <Icon name={icon} size={30} color={color} />
          <h4 style={{ margin: '10px 0 6px', fontSize: '1.15rem' }}>{name}</h4>
          <p style={{ margin: '0 0 10px', fontSize: 14.5, color: 'var(--text-soft)' }}>{text}</p>
          <span className="badge" style={{ color }}>e.g. {eg}</span>
        </SpotlightCard>
      ))}
    </div>
  );
}
