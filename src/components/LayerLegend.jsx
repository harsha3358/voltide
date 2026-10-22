// Colour key under the layered 3D demos. items: [key, text, colour?]
export default function LayerLegend({ items = [['cloud', 'Run by the cloud provider'], ['you', 'Your job']] }) {
  return (
    <p className="layer-legend">
      {items.map(([k, t, c]) => (
        <span key={k}>
          <i style={{ background: c || `var(--l-${k})` }} />
          {t}
        </span>
      ))}
    </p>
  );
}
