// A small line-icon set drawn for VOLTIDE, used inside SVG diagrams and demo
// cards instead of emoji (consistent stroke, colour and size on every OS).
const P = {
  laptop: 'M4 6h16v10H4zM2 19h20',
  phone: 'M8 2h8a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM11 18h2',
  printer: 'M7 9V3h10v6M5 9h14a2 2 0 0 1 2 2v5h-4M3 16v-5a2 2 0 0 1 2-2M7 14h10v7H7z',
  switch: 'M3 8h18v8H3zM7 12h.01M11 12h.01M15 12h.01M7 8V5M17 8V5',
  router: 'M3 14h18v6H3zM7 17h.01M11 17h.01M8 14l-2-8M16 14l2-8M9.5 4.5a4 4 0 0 1 5 0',
  modem: 'M5 4h14v16H5zM9 8h6M9 12h6M9 16h2',
  globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18',
  server: 'M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01',
  building: 'M5 21V4h10v17M15 9h4v12M8 8h2M8 12h2M8 16h2',
  wifi: 'M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0M12 19.5h.01',
  terminal: 'M3 4h18v16H3zM7 9l3 3-3 3M12 15h5',
  target: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
  shield: 'M12 2.5 4 5.5v6c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10v-6z',
  bug: 'M9 7a3 3 0 0 1 6 0M8 9h8v6a4 4 0 0 1-8 0zM4 12h4M16 12h4M5 7l3 2M19 7l-3 2M5 18l3-2M19 18l-3-2',
  worm: 'M3 15c2-4 4-4 6 0s4 4 6 0 4-4 6 0M19 13h.01',
  gift: 'M3 9h18v4H3zM5 13h14v8H5zM12 9v12M12 9c-2-4-6-3-5 0M12 9c2-4 6-3 5 0',
  lock: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4',
  eye: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  keyboard: 'M2 6h20v12H2zM6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10',
  bot: 'M5 8h14v11H5zM12 4v4M9 13h.01M15 13h.01M9 16h6M2 12v3M22 12v3',
  megaphone: 'M3 10v4l12 5V5zM15 9a3 3 0 0 1 0 6M6 14.5 7.5 20',
  user: 'M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 21a8 8 0 0 1 16 0',
  coin: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM15 8h-4.5a2 2 0 0 0 0 4h3a2 2 0 0 1 0 4H9M12 6v2M12 16v2',
  flag: 'M5 21V4M5 4h11l-2 4 2 4H5',
  ban: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM5.6 5.6l12.8 12.8',
  mail: 'M3 5h18v14H3zM3 6l9 7 9-7',
  key: 'M8 10a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM11 13h10M17 13v3M20 13v2',
  database: 'M4 6c0-2 16-2 16 0v12c0 2-16 2-16 0zM4 6c0 2 16 2 16 0M4 12c0 2 16 2 16 0',
  cloud: 'M7 18a5 5 0 0 1-.6-10A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9z',
  alert: 'M12 3 2 20.5h20zM12 10v4.5M12 17.6v.1',
  fire: 'M12 2s5 5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-5 1-8.5z',
  hat: 'M3 16h18M6 16l1.5-9h9L18 16M8 11h8',
  mask: 'M3 8c3-2 15-2 18 0v4c0 4-4 7-9 7s-9-3-9-7zM8 12h.01M16 12h.01',
  scale: 'M12 3v18M7 21h10M5 7h14M5 7l-3 6a3 3 0 0 0 6 0zM19 7l-3 6a3 3 0 0 0 6 0z',
  incognito: 'M3 11h18M6 11l2-6h8l2 6M7 16a2.5 2.5 0 1 0 0 .01M17 16a2.5 2.5 0 1 0 0 .01M9.5 16h5',
  ghost: 'M5 21V10a7 7 0 0 1 14 0v11l-2.5-2-2.5 2-2-2-2 2-2.5-2zM9.5 10h.01M14.5 10h.01',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4',
  file: 'M6 2h8l4 4v16H6zM14 2v4h4',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 3',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  bolt: 'M13 2 4 14h7l-1 8 9-12h-7l1-8z',
  drop: 'M12 2.7S5 10.4 5 15a7 7 0 0 0 14 0c0-4.6-7-12.3-7-12.3z',
  users: 'M9 4a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM2.5 20a6.5 6.5 0 0 1 13 0M17 6a2.5 2.5 0 1 1 0 5M16 14.2a5 5 0 0 1 5.5 5.8',
  check: 'M4.5 12.5l5 5 10-11',
  layers: 'M12 3 2 8l10 5 10-5zM2 13l10 5 10-5M2 17.5l10 5 10-5'
};

export const GLYPHS = Object.keys(P);

// Inside an <svg>: <Glyph name="router" x={10} y={10} size={32} />
export function Glyph({ name, x = 0, y = 0, size = 24, color = 'currentColor', width = 1.7 }) {
  return (
    <svg className="glyph" x={x} y={y} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" overflow="visible">
      <path d={P[name] || P.alert} />
    </svg>
  );
}

// In HTML: <Icon name="bug" size={28} />
export function Icon({ name, size = 24, color = 'currentColor', style, className }) {
  return (
    <svg className={`icon${className ? ` ${className}` : ''}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={style}>
      <path d={P[name] || P.alert} />
    </svg>
  );
}
