// A different animated cartoon for every kind of error, so a failed login or
// a missing page feels like a joke, not a disaster. Animations live in
// src/styles/toons.css and switch off in lite mode.
const INK = '#0b1220';

function Ground({ w = 120 }) {
  return <ellipse cx="120" cy="186" rx={w / 2} ry="7" fill="#000" opacity="0.35" />;
}

// 400 · a confused robot
function Robot() {
  return (
    <svg viewBox="0 0 240 200" className="toon toon--robot">
      <Ground w={110} />
      <g className="t-q">
        <text x="168" y="70" fontSize="30" fontWeight="800" fill="#ffdf20">?</text>
        <text x="188" y="98" fontSize="22" fontWeight="800" fill="#53eafd">?</text>
        <text x="52" y="84" fontSize="26" fontWeight="800" fill="#ff8904">?</text>
      </g>
      <rect x="82" y="118" width="76" height="62" rx="14" fill="#53eafd" stroke={INK} strokeWidth="4" />
      <rect x="104" y="134" width="32" height="14" rx="4" fill={INK} />
      <circle cx="112" cy="141" r="3" fill="#3ef09a" className="t-blink" />
      <circle cx="128" cy="141" r="3" fill="#ff4d6d" className="t-blink t-d2" />
      <g className="t-tilt">
        <line x1="120" y1="46" x2="120" y2="64" stroke={INK} strokeWidth="4" />
        <circle cx="120" cy="42" r="7" fill="#ff4d6d" stroke={INK} strokeWidth="3" className="t-blink" />
        <rect x="72" y="62" width="96" height="62" rx="18" fill="#e2e8f0" stroke={INK} strokeWidth="4" />
        <g className="t-scan">
          <circle cx="100" cy="90" r="10" fill={INK} />
          <circle cx="140" cy="90" r="10" fill={INK} />
          <circle cx="103" cy="87" r="3" fill="#fff" />
          <circle cx="143" cy="87" r="3" fill="#fff" />
        </g>
        <path d="M100 110 q6 -6 12 0 t12 0 t12 0" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// 401 · a cat guarding the door
function Cat() {
  return (
    <svg viewBox="0 0 240 200" className="toon toon--cat">
      <Ground w={140} />
      <rect x="52" y="30" width="104" height="156" rx="8" fill="#7c4a2d" stroke={INK} strokeWidth="4" />
      <rect x="64" y="42" width="80" height="60" rx="4" fill="#94603d" />
      <g className="t-swing">
        <path d="M142 112 v-12 a10 10 0 0 1 20 0 v12" fill="none" stroke="#ffdf20" strokeWidth="5" />
        <rect x="136" y="110" width="32" height="26" rx="5" fill="#ffdf20" stroke={INK} strokeWidth="3" />
      </g>
      <g className="t-shake">
        <path d="M150 74 l10 -26 l14 22 z M196 74 l10 -26 l-24 22 z" fill="#f8a03c" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <circle cx="178" cy="92" r="30" fill="#f8a03c" stroke={INK} strokeWidth="4" />
        <path d="M164 88 q4 -5 8 0 M184 88 q4 -5 8 0" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M172 102 q6 5 12 0" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M150 98 h-18 M150 104 l-16 5 M206 98 h18 M206 104 l16 5" stroke={INK} strokeWidth="2.5" />
      </g>
      <g className="t-bob">
        <rect x="164" y="126" width="60" height="34" rx="6" fill="#fff" stroke={INK} strokeWidth="4" />
        <text x="194" y="150" textAnchor="middle" fontSize="17" fontWeight="900" fill="#ff4d6d">NOPE</text>
        <circle cx="166" cy="160" r="9" fill="#f8a03c" stroke={INK} strokeWidth="3" />
      </g>
    </svg>
  );
}

// 403 · a penguin bouncer
function Penguin() {
  return (
    <svg viewBox="0 0 240 200" className="toon toon--penguin">
      <Ground w={150} />
      <rect x="30" y="112" width="10" height="72" rx="4" fill="#d4af37" stroke={INK} strokeWidth="3" />
      <rect x="200" y="112" width="10" height="72" rx="4" fill="#d4af37" stroke={INK} strokeWidth="3" />
      <path className="t-rope" d="M38 122 Q120 168 202 122" fill="none" stroke="#c0263a" strokeWidth="7" strokeLinecap="round" />
      <g className="t-groove">
        <ellipse cx="120" cy="116" rx="44" ry="62" fill={INK} />
        <ellipse cx="120" cy="128" rx="30" ry="46" fill="#f1f5f9" />
        <rect x="96" y="70" width="20" height="12" rx="4" fill={INK} stroke="#53eafd" strokeWidth="2" />
        <rect x="124" y="70" width="20" height="12" rx="4" fill={INK} stroke="#53eafd" strokeWidth="2" />
        <line x1="116" y1="76" x2="124" y2="76" stroke="#53eafd" strokeWidth="2" />
        <path d="M112 90 l8 8 l8 -8 z" fill="#ff8904" stroke={INK} strokeWidth="2" />
        <path d="M82 120 q38 26 76 0" fill="none" stroke={INK} strokeWidth="14" strokeLinecap="round" />
        <ellipse cx="104" cy="180" rx="14" ry="6" fill="#ff8904" />
        <ellipse cx="136" cy="180" rx="14" ry="6" fill="#ff8904" />
      </g>
      <g className="t-bob">
        <rect x="150" y="22" width="62" height="28" rx="6" fill="#ffdf20" stroke={INK} strokeWidth="3" />
        <text x="181" y="42" textAnchor="middle" fontSize="15" fontWeight="900" fill={INK}>VIP ONLY</text>
      </g>
    </svg>
  );
}

// 404 · an astronaut lost in space
function Astronaut() {
  return (
    <svg viewBox="0 0 240 200" className="toon toon--astro">
      {[[28, 30], [208, 44], [46, 150], [196, 162], [120, 18], [222, 110]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 2 ? 2 : 3} fill="#fff" className={`t-twinkle t-d${i % 3}`} />
      ))}
      <g className="t-float">
        <path d="M60 170 C 40 120, 90 120, 82 90" fill="none" stroke="#94a3b8" strokeWidth="3" strokeDasharray="6 6" className="t-tether" />
        <rect x="96" y="96" width="56" height="64" rx="20" fill="#f1f5f9" stroke={INK} strokeWidth="4" />
        <rect x="108" y="112" width="32" height="18" rx="4" fill="#53eafd" stroke={INK} strokeWidth="3" />
        <rect x="80" y="104" width="22" height="16" rx="8" fill="#f1f5f9" stroke={INK} strokeWidth="4" transform="rotate(-30 91 112)" />
        <rect x="146" y="104" width="22" height="16" rx="8" fill="#f1f5f9" stroke={INK} strokeWidth="4" transform="rotate(30 157 112)" />
        <circle cx="124" cy="74" r="32" fill="#f1f5f9" stroke={INK} strokeWidth="4" />
        <ellipse cx="124" cy="76" rx="22" ry="18" fill="#1e3a8a" stroke={INK} strokeWidth="3" />
        <path d="M112 70 q6 -8 14 -4" fill="none" stroke="#93c5fd" strokeWidth="4" strokeLinecap="round" />
        <g transform="rotate(180 182 96)">
          <rect x="160" y="80" width="44" height="32" rx="3" fill="#fde68a" stroke={INK} strokeWidth="3" />
          <path d="M166 104 l8 -10 l8 6 l10 -12" fill="none" stroke="#ef4444" strokeWidth="2.5" />
          <text x="196" y="90" fontSize="10" fontWeight="900" fill={INK}>X</text>
        </g>
      </g>
    </svg>
  );
}

// 408 · a snail delivering your request
function Snail() {
  return (
    <svg viewBox="0 0 240 200" className="toon toon--snail">
      <line x1="10" y1="182" x2="230" y2="182" stroke="#3ef09a" strokeWidth="3" strokeDasharray="4 10" opacity="0.6" />
      <g className="t-clock">
        <circle cx="200" cy="44" r="20" fill="#fff" stroke={INK} strokeWidth="4" />
        <line x1="200" y1="44" x2="200" y2="30" stroke={INK} strokeWidth="3" strokeLinecap="round" className="t-hand" />
        <line x1="200" y1="44" x2="210" y2="44" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      </g>
      <g className="t-crawl">
        <path d="M40 180 q0 -24 30 -24 h70 q16 0 16 16 v8 z" fill="#a3e635" stroke={INK} strokeWidth="4" />
        <circle cx="96" cy="132" r="34" fill="#ff8904" stroke={INK} strokeWidth="4" />
        <path d="M96 132 m-4 0 a4 4 0 1 1 8 0 a10 10 0 1 1 -18 0 a16 16 0 1 1 30 0" fill="none" stroke={INK} strokeWidth="3.5" />
        <line x1="150" y1="158" x2="160" y2="128" stroke={INK} strokeWidth="3.5" />
        <line x1="140" y1="158" x2="144" y2="130" stroke={INK} strokeWidth="3.5" />
        <circle cx="160" cy="126" r="6" fill="#fff" stroke={INK} strokeWidth="3" />
        <circle cx="144" cy="128" r="6" fill="#fff" stroke={INK} strokeWidth="3" />
        <g transform="rotate(-12 96 92)">
          <rect x="72" y="80" width="48" height="30" rx="3" fill="#fff" stroke={INK} strokeWidth="3" />
          <path d="M72 82 l24 16 l24 -16" fill="none" stroke={INK} strokeWidth="3" />
        </g>
      </g>
    </svg>
  );
}

// 409 · two clones bump into each other
function Clones() {
  const blob = (cls, fill) => (
    <g className={cls}>
      <path d="M-34 0 q0 -46 34 -46 q34 0 34 46 q0 20 -34 20 q-34 0 -34 -20 z" fill={fill} stroke={INK} strokeWidth="4" />
      <circle cx="-12" cy="-16" r="6" fill={INK} />
      <circle cx="12" cy="-16" r="6" fill={INK} />
      <path d="M-10 2 q10 8 20 0" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
    </g>
  );
  return (
    <svg viewBox="0 0 240 200" className="toon toon--clones">
      <Ground w={170} />
      <g transform="translate(76 160)">{blob('t-left', '#c4b5fd')}</g>
      <g transform="translate(164 160)">{blob('t-right', '#c4b5fd')}</g>
      <g className="t-pop">
        <path d="M120 70 l6 -18 l6 18 l18 6 l-18 6 l-6 18 l-6 -18 l-18 -6 z" fill="#ffdf20" stroke={INK} strokeWidth="3" />
      </g>
    </svg>
  );
}

// 410 · a melting OTP ice cream
function IceCream() {
  return (
    <svg viewBox="0 0 240 200" className="toon toon--ice">
      <g className="t-sun">
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i} x1="200" y1="40" x2={200 + Math.cos((i * Math.PI) / 4) * 30} y2={40 + Math.sin((i * Math.PI) / 4) * 30} stroke="#ffb900" strokeWidth="4" strokeLinecap="round" />
        ))}
        <circle cx="200" cy="40" r="14" fill="#ffdf20" />
      </g>
      <ellipse cx="120" cy="186" rx="44" ry="8" fill="#f9a8d4" opacity="0.8" className="t-puddle" />
      <path d="M92 104 l28 76 l28 -76 z" fill="#f4c27a" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M100 116 l40 0 M104 130 l32 0 M110 146 l20 0" stroke="#c98b3a" strokeWidth="3" />
      <g className="t-melt">
        <path d="M84 106 q-4 -44 36 -48 q40 4 36 48 q-8 8 -14 0 q-6 10 -12 0 q-6 12 -12 0 q-8 8 -14 0 q-6 8 -20 0 z" fill="#f9a8d4" stroke={INK} strokeWidth="4" />
        <text x="120" y="92" textAnchor="middle" fontSize="16" fontWeight="900" fill="#be185d">OTP</text>
        <circle cx="106" cy="74" r="3" fill={INK} />
        <circle cx="134" cy="74" r="3" fill={INK} />
        <path d="M112 82 q8 -5 16 0" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      </g>
      <ellipse cx="96" cy="120" rx="4" ry="6" fill="#f9a8d4" className="t-drip" />
      <ellipse cx="146" cy="118" rx="4" ry="6" fill="#f9a8d4" className="t-drip t-d2" />
    </svg>
  );
}

// 429 · a hamster on a wheel
function Hamster() {
  return (
    <svg viewBox="0 0 240 200" className="toon toon--hamster">
      <path d="M78 184 l42 -48 l42 48" fill="none" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
      <g className="t-spin">
        <circle cx="120" cy="104" r="70" fill="none" stroke="#e2e8f0" strokeWidth="8" />
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i} x1="120" y1="104" x2={120 + Math.cos((i * Math.PI) / 4) * 68} y2={104 + Math.sin((i * Math.PI) / 4) * 68} stroke="#cbd5e1" strokeWidth="3" />
        ))}
      </g>
      <g className="t-run">
        <ellipse cx="120" cy="150" rx="30" ry="20" fill="#e8a76b" stroke={INK} strokeWidth="4" />
        <circle cx="144" cy="140" r="14" fill="#e8a76b" stroke={INK} strokeWidth="4" />
        <circle cx="140" cy="128" r="5" fill="#f9a8d4" stroke={INK} strokeWidth="2.5" />
        <circle cx="149" cy="138" r="3" fill={INK} />
        <circle cx="157" cy="144" r="2.5" fill="#ff4d6d" />
        <path d="M104 168 l-6 6 M136 168 l6 6" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      </g>
      <path className="t-sweat" d="M166 120 q4 -8 8 0 a4 4 0 0 1 -8 0 z" fill="#53eafd" />
      <path className="t-sweat t-d2" d="M160 108 q3 -6 6 0 a3 3 0 0 1 -6 0 z" fill="#53eafd" />
    </svg>
  );
}

// 500 · LAGZILLA chewing a cable
function Dino() {
  return (
    <svg viewBox="0 0 240 200" className="toon toon--dino">
      <Ground w={170} />
      <g>
        <rect x="168" y="96" width="50" height="86" rx="6" fill="#334155" stroke={INK} strokeWidth="4" />
        {[110, 132, 154].map(y => <rect key={y} x="176" y={y} width="34" height="12" rx="2" fill="#1e293b" />)}
        <circle cx="204" cy="116" r="3" fill="#ff4d6d" className="t-blink" />
        <circle className="t-smoke" cx="186" cy="84" r="10" fill="#94a3b8" opacity="0.6" />
        <circle className="t-smoke t-d2" cx="200" cy="80" r="8" fill="#94a3b8" opacity="0.5" />
      </g>
      <path d="M168 150 C 140 150, 140 120, 112 122" fill="none" stroke="#ffdf20" strokeWidth="6" strokeLinecap="round" />
      <g className="t-spark">
        <path d="M150 118 l6 -10 l2 8 l8 -4 l-6 10 l-2 -8 z" fill="#ffdf20" />
      </g>
      <path d="M22 168 q-14 -6 -4 -20 q16 6 30 2" fill="#3ef09a" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <ellipse cx="74" cy="148" rx="42" ry="32" fill="#3ef09a" stroke={INK} strokeWidth="4" />
      <path d="M58 176 v8 M90 176 v8" stroke={INK} strokeWidth="8" strokeLinecap="round" />
      <path d="M50 120 l6 -12 l6 12 M66 116 l6 -12 l6 12" fill="#22c55e" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <g className="t-chomp">
        <path d="M86 100 q30 -10 40 14 l-36 6 z" fill="#3ef09a" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <circle cx="104" cy="104" r="4" fill={INK} />
      </g>
      <path d="M90 122 l34 0 q-2 14 -30 10 z" fill="#3ef09a" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    </svg>
  );
}

// 503 · a sleepy cloud
function Sleepy() {
  return (
    <svg viewBox="0 0 240 200" className="toon toon--sleepy">
      <g className="t-z">
        <text x="170" y="70" fontSize="26" fontWeight="900" fill="#a3b3ff">Z</text>
        <text x="190" y="46" fontSize="20" fontWeight="900" fill="#a3b3ff">z</text>
        <text x="206" y="28" fontSize="14" fontWeight="900" fill="#a3b3ff">z</text>
      </g>
      <g className="t-breathe">
        <path d="M52 150 q-28 0 -26 -26 q2 -24 30 -22 q4 -34 40 -32 q26 -24 56 -2 q36 -6 40 30 q28 6 22 34 q-6 20 -30 18 z" fill="#e2e8f0" stroke={INK} strokeWidth="4" />
        <path d="M92 116 q8 6 16 0 M134 116 q8 6 16 0" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="122" cy="132" rx="7" ry="4" fill={INK} />
        <circle cx="86" cy="128" r="6" fill="#f9a8d4" opacity="0.7" />
        <circle cx="158" cy="128" r="6" fill="#f9a8d4" opacity="0.7" />
      </g>
      <path d="M78 168 q42 16 84 0" fill="none" stroke="#a3b3ff" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

// offline · a plug looking for its socket
function Plug() {
  return (
    <svg viewBox="0 0 240 200" className="toon toon--plug">
      <Ground w={120} />
      <rect x="192" y="80" width="36" height="56" rx="8" fill="#e2e8f0" stroke={INK} strokeWidth="4" />
      <rect x="203" y="96" width="5" height="12" rx="2" fill={INK} />
      <rect x="213" y="96" width="5" height="12" rx="2" fill={INK} />
      <g transform="translate(36 24)">
        {[0, 1, 2].map(i => (
          <path key={i} className={`t-wifi t-d${i}`} d={`M${20 - i * 10} ${30 - i * 8} q${10 + i * 10} -${10 + i * 6} ${20 + i * 20} 0`} fill="none" stroke="#53eafd" strokeWidth="5" strokeLinecap="round" />
        ))}
        <circle cx="30" cy="38" r="4" fill="#53eafd" />
        <line x1="6" y1="6" x2="54" y2="48" stroke="#ff4d6d" strokeWidth="5" strokeLinecap="round" />
      </g>
      <path d="M40 176 C 70 186, 80 150, 104 154" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      <g className="t-walk">
        <rect x="100" y="120" width="58" height="56" rx="12" fill="#ffdf20" stroke={INK} strokeWidth="4" />
        <rect x="158" y="132" width="16" height="8" rx="2" fill="#94a3b8" stroke={INK} strokeWidth="3" />
        <rect x="158" y="152" width="16" height="8" rx="2" fill="#94a3b8" stroke={INK} strokeWidth="3" />
        <circle cx="118" cy="142" r="4" fill={INK} />
        <circle cx="140" cy="142" r="4" fill={INK} />
        <path d="M118 162 q11 -8 22 0" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M114 176 v8 M144 176 v8" stroke={INK} strokeWidth="5" strokeLinecap="round" className="t-legs" />
      </g>
    </svg>
  );
}

export const TOONS = {
  400: [Robot, 'Beep boop?', 'I didn’t understand that request. Check the form and try again.'],
  401: [Cat, 'Nope.', 'That’s not the right password or code. Caps Lock on, maybe?'],
  403: [Penguin, 'Not on the list (yet)', 'You can’t get in here yet. Ask your facilitator for the code.'],
  404: [Astronaut, 'Lost in space', 'This page drifted off into space. Even the astronaut can’t find it.'],
  408: [Snail, 'Sloooow…', 'Your request took the scenic route and timed out. Try again?'],
  409: [Clones, 'Plot twist: you already exist', 'That account is already registered. Try logging in instead.'],
  410: [IceCream, 'That code melted', 'Your OTP expired. Codes only last 10 minutes, so grab a fresh one.'],
  429: [Hamster, 'Easy, speedrunner', 'Too many tries too fast. Take a breather and try again in a minute.'],
  500: [Dino, 'LAGZILLA chewed a cable', 'Something broke on our side. Not your fault. Try again in a bit.'],
  503: [Sleepy, 'The servers are napping', 'The server is busy right now. Give it a few seconds and retry.'],
  0: [Plug, 'No internet', 'The cloud is… far away right now. Check your Wi-Fi or mobile data.']
};

export function toonFor(code) {
  if (TOONS[code]) return code;
  if (code >= 500) return 500;
  if (code >= 400) return 400;
  return 0;
}

export default function ErrorToon({ code = 500, message, compact = false, children }) {
  const key = toonFor(Number(code));
  const [Art, title, line] = TOONS[key];
  return (
    <div className={`toon-card ${compact ? 'toon-card--compact' : ''}`} role="alert">
      <div className="toon-card__art">
        <Art />
      </div>
      <div className="toon-card__text">
        <span className="toon-card__code">{key ? `ERROR ${key}` : 'OFFLINE'}</span>
        <strong>{title}</strong>
        <p>{line}</p>
        {message && message !== line && <p className="toon-card__detail">{message}</p>}
        {children && <div className="toon-card__actions">{children}</div>}
      </div>
    </div>
  );
}
