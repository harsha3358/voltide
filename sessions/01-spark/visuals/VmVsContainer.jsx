// Two stacks side by side: every VM carries a whole guest OS; containers share
// the host's kernel, so they are lighter and start in seconds.
const VM = [['App A', '#ffd23f'], ['Guest OS', '#4d8bff'], ['App B', '#ffd23f'], ['Guest OS', '#4d8bff']];
const CT = [['App A', '#ffd23f'], ['App B', '#ffd23f'], ['App C', '#ffd23f']];

function Base({ x, rows }) {
  return rows.map(([label, color], i) => (
    <g key={label}>
      <rect x={x} y={250 - i * 44} width="300" height="38" rx="9" fill="#061428" stroke={color} strokeWidth="2" />
      <text x={x + 150} y={274 - i * 44} textAnchor="middle" fontFamily="Space Grotesk" fontSize="14" fill="var(--text)">{label}</text>
    </g>
  ));
}

export default function VmVsContainer() {
  return (
    <svg viewBox="0 0 720 320" role="img" aria-label="Virtual machines each include a guest operating system; containers share the host operating system">
      <text x="160" y="22" textAnchor="middle" fontFamily="Space Grotesk" fontWeight="700" fontSize="18" fill="var(--text)">Virtual machines</text>
      <text x="560" y="22" textAnchor="middle" fontFamily="Space Grotesk" fontWeight="700" fontSize="18" fill="var(--text)">Containers</text>
      <Base x={10} rows={[['Hardware', '#7f93b2'], ['Host OS', '#4d8bff'], ['Hypervisor (VirtualBox)', '#b56cff']]} />
      {[0, 1].map(k => (
        <g key={k}>
          {VM.slice(k * 2, k * 2 + 2).reverse().map(([label, color], i) => (
            <g key={i}>
              <rect x={10 + k * 155} y={118 - i * 44} width="145" height="38" rx="9" fill="#061428" stroke={color} strokeWidth="2" />
              <text x={82 + k * 155} y={142 - i * 44} textAnchor="middle" fontFamily="Space Grotesk" fontSize="13" fill="var(--text)">{label}</text>
            </g>
          ))}
        </g>
      ))}
      <Base x={410} rows={[['Hardware', '#7f93b2'], ['Host OS (shared kernel)', '#4d8bff'], ['Container engine (Docker)', '#2ee6c5']]} />
      {CT.map(([label, color], i) => (
        <g key={label}>
          <rect x={410 + i * 102} y="118" width="96" height="38" rx="9" fill="#061428" stroke={color} strokeWidth="2" />
          <text x={458 + i * 102} y="142" textAnchor="middle" fontFamily="Space Grotesk" fontSize="13" fill="var(--text)">{label}</text>
        </g>
      ))}
      <text x="160" y="312" textAnchor="middle" fontFamily="Inter" fontSize="13" fill="var(--text-soft)">Heavier · strong isolation · minutes to boot</text>
      <text x="560" y="312" textAnchor="middle" fontFamily="Inter" fontSize="13" fill="var(--text-soft)">Lighter · shared kernel · seconds to start</text>
    </svg>
  );
}
