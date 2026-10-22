// Every mission gets its own look: a colour pair (from the shadcn / Tailwind
// colour scales) plus an animated background pattern. The pairing walks two
// lists of different lengths, so all 38 missions get a unique combination
// and neighbouring missions never share a colour or a pattern.
const PALETTES = [
  ['#ffdf20', '#53eafd'], // volt
  ['#2b7fff', '#8ec5ff'], // ocean
  ['#46ecd5', '#a3e635'], // mint
  ['#8e51ff', '#e12afb'], // ultraviolet
  ['#ff8904', '#ff637e'], // sunset
  ['#9ae600', '#00d492'], // lime
  ['#ff2056', '#fda5d5'], // rose
  ['#00bcff', '#a2f4fd'], // sky
  ['#ffb900', '#ff6900'], // amber
  ['#00d492', '#5ee9b5'], // emerald
  ['#e12afb', '#f4a8ff'], // fuchsia
  ['#615fff', '#a3b3ff'], // indigo
  ['#ff6467', '#ffd230'] // coral
];

export const MOTIFS = ['circuit', 'waves', 'hex', 'rain', 'topo', 'dots', 'bolts', 'grid', 'bubbles', 'chevrons', 'stars', 'plus'];

// Missions before each episode, so numbering runs 0–37 across the workshop.
const OFFSET = { 1: 0, 2: 13, 3: 22, 4: 30 };

function mix(hex, toward, k) {
  const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const [a, b] = [p(hex), p(toward)];
  return `#${a.map((v, i) => Math.round(v + (b[i] - v) * k).toString(16).padStart(2, '0')).join('')}`;
}

export function missionTheme(session, index, override) {
  const g = (OFFSET[session] ?? 0) + index;
  const [a, b] = PALETTES[(g * 5) % PALETTES.length];
  return {
    a,
    b,
    deep: mix(b, '#04101c', 0.72),
    motif: MOTIFS[g % MOTIFS.length],
    ...override
  };
}

// The 3D ocean behind the page listens for this and blends toward the colours.
let tint = null;
const subs = new Set();
export function setTint(t) {
  if (JSON.stringify(t) === JSON.stringify(tint)) return;
  tint = t;
  subs.forEach(f => f(t));
}
export function onTint(f) {
  subs.add(f);
  f(tint);
  return () => subs.delete(f);
}
