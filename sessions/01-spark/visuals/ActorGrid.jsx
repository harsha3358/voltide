import SpotlightCard from '../../../src/vendor/reactbits/SpotlightCard/SpotlightCard.jsx';

const ACTORS = [
  ['🧒', 'Script kiddie', 'Fun, showing off', 'Runs ready-made tools found online without really understanding them.', '#ffd23f'],
  ['💰', 'Cybercriminal', 'Money', 'Ransomware gangs, card fraud, fake loan apps, OTP scams. The most common attacker you will face.', '#ff4d6d'],
  ['📢', 'Hacktivist', 'A cause or protest', 'Defaces websites or leaks data to make a political or social point.', '#ff8a4d'],
  ['🧑‍💼', 'Insider', 'Revenge, money, mistakes', 'A current or former employee or student who misuses the access they already have. Sometimes it is just an honest mistake.', '#b56cff'],
  ['🏛️', 'Nation-state group', 'Spying, disruption', 'Well-funded teams working for governments, targeting power grids, defence, research and elections.', '#4d8bff'],
  ['🎩', 'Ethical hacker', 'Protection (with permission)', 'Security testers and bug bounty hunters who find weaknesses first and report them so they get fixed. That can be you.', '#3ef09a']
];

export default function ActorGrid() {
  return (
    <div className="d-grid">
      {ACTORS.map(([icon, name, motive, text, color]) => (
        <SpotlightCard key={name} spotlightColor={color} intensity={0.22} style={{ padding: 20 }}>
          <div style={{ fontSize: 30 }}>{icon}</div>
          <h4 style={{ margin: '8px 0 4px', fontSize: '1.15rem' }}>{name}</h4>
          <span className="badge" style={{ color }}>Motive: {motive}</span>
          <p style={{ margin: '10px 0 0', fontSize: 14.5, color: 'var(--text-soft)' }}>{text}</p>
        </SpotlightCard>
      ))}
    </div>
  );
}
