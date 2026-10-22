# Facilitator

> Keep this folder to yourself. It contains the unlock codes.

## Unlock codes

| Session | Code |
|---|---|
| 02 · CURRENT | `CURRENT-FLOWS` |
| 03 · TIDE | `TIDE-TURNS` |
| 04 · SURGE | `SURGE-READY` |

Codes are case-insensitive. Type one on a locked session's page to open it in **that browser** (it is remembered in local storage).

## Three ways to release a session
1. **In class, per device:** read the code aloud or write it on the board.
2. **For everyone, at build time:** `VITE_UNLOCKED_SESSIONS=1,2 npm run build`, then redeploy `dist/`.
3. **Permanently:** set `locked: false` for that session in `sessions/index.js`.

## Change a code
```bash
npm run facilitator:hash -- NEW-CODE
```
Paste the printed `unlockHash` into `sessions/index.js`.

> This lock is a classroom gate, not real security: the content ships to the browser. That's a good teaching moment in Episode 04 ("protect credentials"), because anything shipped to the browser is public.

See [`guide.md`](guide.md) for teaching notes. The original **Cloud Computing Workshop** plan these episodes follow is in [`reference/Cloud_Computing_Workshop.pdf`](reference/Cloud_Computing_Workshop.pdf); `PLAN.md` maps each of its sessions to an episode.
