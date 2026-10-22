# VOLTIDE · Cloud Computing Walkthrough for B.Tech Freshers

### 🔗 Live site: **[voltide.vercel.app](https://voltide.vercel.app/)**

An animated, gamified walkthrough of the **Cloud Computing Workshop**, in four episodes. It starts from absolute zero ("what even is the cloud?") and ends with every team deploying a real website to the cloud and demoing it live.

| # | Episode | Status | Open | Folder |
|---|---|---|---|---|
| 01 | **SPARK**: Cloud from Zero + Setup | 🔓 Open | [live](https://voltide.vercel.app/#/session/1) | [`sessions/01-spark`](sessions/01-spark/README.md) |
| 02 | **CURRENT**: Computer Networks | 🔒 Locked | [live](https://voltide.vercel.app/#/session/2) | [`sessions/02-current`](sessions/02-current/README.md) |
| 03 | **TIDE**: Cloud Lab Practicals | 🔒 Locked | [live](https://voltide.vercel.app/#/session/3) | [`sessions/03-tide`](sessions/03-tide/README.md) |
| 04 | **SURGE**: Cloud Deployment Challenge | 🔒 Locked | [live](https://voltide.vercel.app/#/session/4) | [`sessions/04-surge`](sessions/04-surge/README.md) |

Episodes 02–04 unlock with a code the facilitator shares in class (see [`facilitator/README.md`](facilitator/README.md)). [`PLAN.md`](PLAN.md) lists every mission, mapped one-to-one to the workshop plan.

## What's inside

- **38 missions** across four episodes. Each has a hook, a one-line summary, an analogy, new words explained, an interactive demo, a hands-on lab with expected output, and a checkpoint question.
- **Game layer:** XP, ranks, combos, 33 badges, a secret message decrypted one mission at a time, a timed boss fight per episode, and certificates. Finishing all four episodes earns the **Workshop Graduate** certificate.
- **Mission flow:**
  - a *Learn → Try it → Lab → Check* step strip in every mission
  - *"I ran it"* ticks on lab steps
  - a *Done · Next* button at the end of each mission
  - a bottom navigation bar on phones
- **Looks:**
  - each mission has its own colours and animated background pattern
  - an interactive 3D scene in every episode hero (the home globe; then a cloud, a router mesh, a data-centre aisle and a deploy city)
  - a 3D ocean background that changes colour with each mission
- **Shared lab PCs:** the profile page has **Reset score** (XP and badges only) and **Reset everything** (all activity, ready for the next student).
- **Lite mode** (⚡ button): turns off WebGL and animations for older lab PCs. It switches on automatically for `prefers-reduced-motion`.

## Run it on your computer

Needs [Node.js](https://nodejs.org/) 20 or newer.

```bash
npm ci             # install (first time only)
npm run dev        # http://localhost:5173
npm run dev -- --host   # also share it on your Wi-Fi/LAN for a classroom
npm run build      # static site in dist/, works from any folder, USB stick or web host
npm run preview    # serve the built dist/
```

Fonts are bundled, so the built site works **offline** in labs without internet.

## Deploy: GitHub → Vercel

The live site at [voltide.vercel.app](https://voltide.vercel.app/) is deployed this way.

```bash
git branch -M main
git remote add origin https://github.com/<you>/voltide.git
git push -u origin main
```

Then import the repo on [vercel.com/new](https://vercel.com/new). `vercel.json` already sets **Vite**, `npm ci`, `npm run build` and the `dist` output, so just press **Deploy**. Every push to `main` redeploys automatically.

- Routing is hash-based (`#/session/1`), so deep links work on Vercel with no rewrite rules.
- To release locked episodes for everyone, add `VITE_UNLOCKED_SESSIONS=1,2` in Vercel → Settings → Environment Variables, then redeploy (see `.env.example`).
- Keep the repo **private** if students must not see `facilitator/` (it contains the unlock code), or change the code first with `npm run facilitator:hash -- NEW-CODE`.

## Project structure

```
voltide/
├── README.md            ← you are here
├── guide.md             ← student handbook (also in-app at #/handbook)
├── PLAN.md              ← every mission per episode + design notes
├── facilitator/         ← unlock code, teaching notes, workshop PDF, code-hash tool
├── sessions/
│   ├── index.js         ← the 4 episodes: names, colours, lock state, 3D scene
│   ├── 01-spark/        ← README.md · guide.md · content.jsx · demos/ · visuals/
│   ├── 02-current/
│   ├── 03-tide/         ← + lab-files/ (hello.c, app.py, App Engine app)
│   └── 04-surge/        ← + lab-files/ (index.html starter page)
└── src/
    ├── three/           ← 3D engine + hero scenes (globe, cloud, network, rack, city, stack)
    ├── lib/             ← router, lock, game/XP, mission themes, motion
    ├── components/      ← mission, labs, boss fight, nav, backgrounds
    ├── styles/          ← app, demos and per-mission theme CSS
    └── vendor/reactbits/  ← React Bits components (see their LICENSE.md)
```

Each episode folder is self-contained: **`README.md`** (overview and objectives), **`guide.md`** (step-by-step field guide, also shown in-app) and **`content.jsx`** (the missions, labs, checkpoints and boss questions). Edit `content.jsx` to change an episode.

## Links you can share

| Link | Opens |
|---|---|
| [voltide.vercel.app](https://voltide.vercel.app/) | Home |
| [`/#/session/1`](https://voltide.vercel.app/#/session/1) | An episode |
| [`/#/session/1/topic/service-models`](https://voltide.vercel.app/#/session/1/topic/service-models) | Straight to one mission |
| [`/#/session/1/guide`](https://voltide.vercel.app/#/session/1/guide) | That episode's field guide |
| [`/#/glossary`](https://voltide.vercel.app/#/glossary) | Jargon buster (106 terms) |
| [`/#/handbook`](https://voltide.vercel.app/#/handbook) | How VOLTIDE works |
| [`/#/profile`](https://voltide.vercel.app/#/profile) | XP, badges, certificates, reset |

Wherever a mission mentions a tool or site, the text links straight to it (VirtualBox → download page, AWS → console, App Engine → Google's docs). These links open in a new tab and are marked ↗. Photos come from **Wikimedia Commons** (free-licensed); click one for its author and licence.

## Effects & credits

- [three.js](https://threejs.org/) for the 3D ocean background and the hero scenes.
- [React Bits](https://github.com/DavidHDev/react-bits) (MIT + Commons Clause): Lightning, LiquidEther, Threads, LiquidChrome, FaultyTerminal, ElectricBorder, ClickSpark, DecryptedText, GlitchText, ShinyText, TextType, CountUp, SpotlightCard. Used inside this app, not redistributed as components.
- [GSAP](https://gsap.com) (ScrollTrigger, MotionPath, DrawSVG) for the animated SVGs; [Lenis](https://lenis.darkroom.engineering) for smooth scrolling.
- Colours from the [shadcn/ui](https://ui.shadcn.com/) palette.
