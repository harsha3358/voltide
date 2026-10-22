# VOLTIDE · Cloud Computing Walkthrough for B.Tech Freshers

An animated, gamified, project-based walkthrough of the **Cloud Computing Workshop** in four episodes. It starts from absolute zero ("what even is the cloud?") and ends with every team deploying a real website to the cloud. Theme: **⚡ electricity** (power, signals, speed) × **🌊 water** (data flowing, clouds, scaling floods).

| # | Session | Status | Folder |
|---|---|---|---|
| 01 | **SPARK**: Cloud from Zero + Setup | 🔓 Open | [`sessions/01-spark`](sessions/01-spark/README.md) |
| 02 | **CURRENT**: Computer Networks | 🔒 Locked | [`sessions/02-current`](sessions/02-current/README.md) |
| 03 | **TIDE**: Cloud Lab Practicals | 🔒 Locked | [`sessions/03-tide`](sessions/03-tide/README.md) |
| 04 | **SURGE**: Cloud Deployment Challenge | 🔒 Locked | [`sessions/04-surge`](sessions/04-surge/README.md) |

See [`PLAN.md`](PLAN.md) for the finalised topics of every episode, mapped one-to-one to the **Cloud Computing Workshop** plan.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173  (also on your LAN IP for a classroom)
npm run build      # static site in dist/, which runs from any folder, USB stick or web host
npm run preview    # serve the built dist/
```

Node 20+ is required. Fonts are bundled, so the built site works **offline** in labs without internet.

## Deploy: GitHub → Vercel

```bash
git init && git add -A && git commit -m "VOLTIDE cloud computing walkthrough"   # already done for you
git branch -M main
git remote add origin https://github.com/<you>/voltide.git
git push -u origin main
```

Then on [vercel.com/new](https://vercel.com/new), import the repo. `vercel.json` already sets **Vite**, `npm run build` and the `dist` output, so just press **Deploy**. Every push to `main` redeploys automatically.

- Routing is hash-based (`#/session/1`), so deep links work on Vercel with no rewrite rules.
- To release locked episodes for everyone, add the env var `VITE_UNLOCKED_SESSIONS=1,2` in Vercel → Settings → Environment Variables, then redeploy (see `.env.example`).
- Keep the repo **private** if students must not see `facilitator/` (it contains the unlock codes), or change the password first with `npm run facilitator:hash -- NEW-PASSWORD`.

## Project structure

```
voltide/
├── README.md            ← you are here
├── guide.md             ← handbook: how to navigate (also shown in-app at #/handbook)
├── PLAN.md              ← finalised topics per session
├── facilitator/         ← unlock codes, teaching notes, code-hash tool
├── sessions/
│   ├── index.js         ← the 4 sessions: names, colours, lock state, codes
│   ├── 01-spark/        ← README.md · guide.md · content.jsx · demos/ · visuals/
│   ├── 02-current/
│   ├── 03-tide/
│   └── 04-surge/
└── src/                 ← shared engine (router, lock, effects, components)
    └── vendor/reactbits/  ← React Bits components (see their LICENSE.md)
```

Each session folder is self-contained: **`README.md`** (overview and objectives), **`guide.md`** (step-by-step field guide, also rendered in-app) and **`content.jsx`** (the topics: plain words, analogies, jargon, demos, labs and checkpoints).

## Internal links

| Link | Opens |
|---|---|
| `#/session/1` | Session page |
| `#/session/1/topic/service-models` | Jump straight to a mission |
| `#/session/1/guide` | That session's field guide |
| `#/glossary` | Jargon buster |
| `#/handbook` | This project's handbook |

## External links & photos

Wherever a topic mentions a tool, site or law, the text links straight to it: e.g. VirtualBox → its download page, AWS → the AWS console, App Engine → Google's App Engine page. Links open in a new tab and are marked ↗. Photos load from **Wikimedia Commons** (free-licensed). Click a photo or its caption for the author and licence. Offline, a "View on Commons" link is shown instead.

## Effects & credits

- [React Bits](https://github.com/DavidHDev/react-bits) (MIT + Commons Clause): Lightning, LiquidEther, Threads, LiquidChrome, FaultyTerminal, ElectricBorder, ClickSpark, DecryptedText, GlitchText, ShinyText, TextType, CountUp, SpotlightCard. Used inside this application, not redistributed as components.
- [GSAP](https://gsap.com) with ScrollTrigger, MotionPath and DrawSVG drives the custom animated SVGs. [Lenis](https://lenis.darkroom.engineering) provides smooth scrolling.
- Design checks informed by `taste-skill` and `ui-ux-pro-max-skill` (see `PLAN.md` → Design notes).

The **⚡ button** in the top bar switches to *lite mode* (no WebGL) for older lab PCs. It is turned on automatically for `prefers-reduced-motion`.
