# Facilitator

> Keep this folder to yourself. It contains the unlock codes.

**Live site for students:** [voltide.vercel.app](https://voltide.vercel.app/). Share this link in class, then give the password below when you open each episode.

## Unlock password

All locked episodes (02 · CURRENT, 03 · TIDE, 04 · SURGE) open with the same password:

| Episodes | Password |
|---|---|
| 02, 03, 04 | `Next@123` |

Type it on a locked episode's page to open it in **that browser** (it is remembered in local storage). Letter case doesn't matter.

The same `Next@123` is the suggested password for the student account on the workshop's Ubuntu lab VM (Episode 01 lab), so everyone in the room uses one password.

## Three ways to release a session
1. **In class, per device:** read the code aloud or write it on the board.
2. **For everyone, at build time:** `VITE_UNLOCKED_SESSIONS=1,2 npm run build`, then redeploy `dist/`.
3. **Permanently:** set `locked: false` for that session in `sessions/index.js`.

## Change the password
```bash
npm run facilitator:hash -- NEW-PASSWORD
```
Paste the printed `unlockHash` into each locked episode in `sessions/index.js`.

> This lock is a classroom gate, not real security: the content ships to the browser. That's a good teaching moment in Episode 04 ("protect credentials"), because anything shipped to the browser is public.

See [`guide.md`](guide.md) for teaching notes. The original **Cloud Computing Workshop** plan these episodes follow is in [`reference/Cloud_Computing_Workshop.pdf`](reference/Cloud_Computing_Workshop.pdf); `PLAN.md` maps each of its sessions to an episode.
