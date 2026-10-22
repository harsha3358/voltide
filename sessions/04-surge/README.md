# Episode 04 · SURGE: Cloud Deployment Challenge 🔒

> One squad. One server. One real website on the internet. Then delete it all.
> *(Cloud Computing Workshop · Day 2 · Session 04: Cloud Deployment Challenge)*

**Open in the app:** `#/session/4` · **Field guide:** [`guide.md`](guide.md) (or `#/session/4/guide`)

Locked until the facilitator shares the code (see [`facilitator/README.md`](../../facilitator/README.md)).

## By the end, teams can
- Work in a squad with clear roles
- Build a simple webpage and deploy it on a cloud VM with nginx
- Make the site publicly reachable and test it from a phone
- Review and tighten a deployment's security
- Troubleshoot with `systemctl`, nginx logs and `journalctl`
- Present a working cloud deployment in a 3-minute live demo
- Shut down and delete every resource they created

## Missions
| # | Mission | Demo / lab | Deep link |
|---|---|---|---|
| 01 | Form your squad | Squad builder | `#/session/4/topic/teams` |
| 02 | Build the page | Page builder with live preview + download | `#/session/4/topic/build-page` |
| 03 | Deploy with nginx | Deploy pipeline + **Lab:** EC2 + nginx + scp | `#/session/4/topic/deploy` |
| 04 | Test public access | **3D layers: follow the request, break a layer** + "Why can't my friend open it?" tree + **Lab** | `#/session/4/topic/test-access` |
| 05 | Secure it | Security review + **Lab:** ufw, updates, budget | `#/session/4/topic/secure-it` |
| 06 | Logs & troubleshooting | Log detective + **Lab:** live logs | `#/session/4/topic/logs-troubleshoot` |
| 07 | Live demo | Rubric + 3-minute demo timer | `#/session/4/topic/live-demo` |
| 08 | Clean up | Clean sweep checklist (linked to each console page) | `#/session/4/topic/cleanup` |

Ends with the **FINAL FORM boss fight**. Beating all four bosses and decoding all four transmissions unlocks the **Workshop Graduate** certificate on the profile page. Badges: Squad Up, Page Maker, Fixer, Log Detective, Demo Day, Clean Sweep, plus the boss and decoder badges.

## Files
- `content.jsx`: all mission text, checkpoints, labs, rubric and boss questions
- `demos/`: interactive pieces · `visuals/`: animated diagrams
- `lab-files/index.html`: a ready-made team page, if a team has no time to build one

## Before class
Each team needs one AWS account (or IAM user) and one laptop with SSH. See *Before class* in the [field guide](guide.md#before-class).
