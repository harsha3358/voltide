# VOLTIDE · Cloud Computing Walkthrough

### 🔗 Live site: **[voltide.vercel.app](https://voltide.vercel.app/)**

---

**To:** Workshop managers, facilitators and lab coordinators
**From:** The CEO
**Subject:** VOLTIDE: what it is, why we built it, and exactly how you run it

---

Team,

We are running the **Cloud Computing Workshop** for first-year B.Tech students. Most of them have never opened a terminal and couldn't tell you what a server is. By the end of the workshop, every one of them will have launched a real cloud server, deployed a website on it, shown it working live on a phone, and cleaned it all up afterwards.

**VOLTIDE** is the tool that gets them there. Please read this memo end to end before your first session. I've written it so that you don't have to guess anything. If something here is unclear, that's my mistake, so tell me and I'll fix it.

---

## 1. Why we built this

Three problems kept coming up in workshops like this one:

1. **Freshers switch off.** Slides full of jargon lose a Gen Z room in minutes.
2. **Practicals go wrong in the same places every time.** Wrong VM settings, SSH keys that won't work, firewall rules that block everything, and websites that open on the facilitator's laptop but not on anyone's phone.
3. **Cloud bills surprise people.** Students forget to stop servers, and someone gets charged.

VOLTIDE fixes all three. It teaches from absolute zero, in plain words, with a game layer that gives students a reason to stay. It shows the **expected output** for every command so students can check themselves. It drills in one rule from the first episode to the last: **stop what you start.**

---

## 2. What VOLTIDE is, in one paragraph

VOLTIDE is a website. Students open it in a browser, on a lab PC or their phone, and work through **four episodes** that follow the workshop plan exactly. Each episode is a series of short **missions**. A mission explains one idea in plain language, lets students play with an interactive demo, gives them real commands to type on their own machine, and ends with a quick question. Students earn XP and badges as they go, decode a secret message, and finish each episode by fighting a "boss" (a timed quiz). When it's connected to our Google Sheet, students **sign up and log in**, and every login and learning step is recorded in the sheet, so you can see exactly who did what (section 10). Without the sheet connected, it runs with no accounts and saves progress only in the browser.

---

## 3. What success looks like

By the end of **Day 1**, every student:
- understands what cloud computing is and why companies use it
- has a working Ubuntu virtual machine on their computer
- can explain how a browser reaches a server on the internet

By the end of **Day 2**, every team:
- has launched a real cloud server on AWS
- has run a C program and a Python web app on it
- has deployed a website that opens on a phone over mobile data
- can explain the path (server → security group → web server → file) and the basic security controls
- has presented a 3-minute live demo
- has **terminated every cloud resource** and checked the bill shows nothing running

If those things happen, the workshop worked. Nothing else matters as much.

---

## 4. The four episodes

The four episodes map one-to-one onto the four sessions in the workshop plan (`facilitator/reference/Cloud_Computing_Workshop.pdf`). Every mission is listed in [`PLAN.md`](PLAN.md).

| Episode | Workshop slot | Missions | What students actually do | Boss |
|---|---|---|---|---|
| **01 · SPARK** [open](https://voltide.vercel.app/#/session/1) | Day 1 · Session 01: Cloud + Setup | 13 | Learn what the cloud is (IaaS, PaaS, SaaS, scaling, VMs vs containers), install VirtualBox + Ubuntu, type their first Linux commands, tour AWS / Azure / Google Cloud, learn account safety | LAGZILLA |
| **02 · CURRENT** [open](https://voltide.vercel.app/#/session/2) | Day 1 · Session 02: Computer Networks | 9 | IP addresses, DNS, HTTP/HTTPS, TCP/UDP, ports, NAT, firewalls; run `ping`, `ip addr`, `nslookup`, `curl`, `traceroute`; turn on a firewall | Packet Loss |
| **03 · TIDE** [open](https://voltide.vercel.app/#/session/3) | Day 2 · Session 03: Cloud Lab Practicals | 8 | Launch an EC2 server, SSH in, check CPU/RAM/disk, compile C, run a Flask web app, see App Engine (PaaS), make an S3 bucket, learn access rules, serverless, Hadoop, databases, chatbots | Out of Memory |
| **04 · SURGE** [open](https://voltide.vercel.app/#/session/4) | Day 2 · Session 04: Deployment Challenge | 8 | Form teams, build a webpage, deploy it with nginx, test it on phones, secure it, read server logs, run a 3-minute live demo, delete everything | Final Form |

Episode 01 is open to everyone. **Episodes 02, 03 and 04 are locked** until you unlock them in class (section 8).

Each episode folder in `sessions/` has its own `README.md` (overview) and `guide.md` (the field guide you teach from).

---

## 5. How a student experiences it, step by step

This is what happens on a student's screen. Walk through it once yourself so you know what they see.

1. **They open the site** at [voltide.vercel.app](https://voltide.vercel.app/). The home page shows a 3D globe, the four episodes and a "Start Episode 01" button.
2. **They open Episode 01.** A short story intro plays: LAGZILLA, a monster that feeds on downtime, is about to crash the college portal on results day. They press **Accept mission**.
3. **The episode page** shows a 3D scene, the episode summary, a **mission map** and the list of missions on the left (on phones, a bar at the bottom).
4. **Each mission follows the same rhythm**, every time:
   - a one-line **hook** from Volty, our mascot: why this matters to them
   - the idea in **one sentence**
   - an **analogy** using water or electricity
   - **new words**, explained like a human would explain them
   - an **interactive demo** they can play with. It's all simulated, so nothing costs money and nothing can break.
   - a **hands-on lab**: real commands to type on their own VM or cloud server, with the **expected output** shown so they can compare
   - a **checkpoint** question
5. **A step strip** at the top of every mission (**Learn → Try it → Lab → Check**) ticks off as they scroll, so they always know how much is left.
6. **In labs**, they press **"I ran it"** after each command.
7. **At the end of a mission**, they press **"Done · Next"**. That marks it complete and takes them to the next mission.
8. **After the last mission**, they fight the **boss**: 8 questions, 20 seconds each, 3 lives.
9. **Their profile** (tap the XP bar at the top) shows their rank, badges and certificates.

Every mission has its own colour theme and background pattern. That's deliberate: students can feel they've moved on, which keeps a long session from blurring together.

---

## 6. How the game works

The game layer is why students stay engaged. You don't need to manage it, but you should understand it so you can use it in the room ("first person to Packet Rider wins").

| Action | XP |
|---|---|
| Checkpoint answered right | +50 (three in a row = combo, double XP) |
| Lab step ticked ("I ran it") | +10 |
| Whole lab finished | +40 bonus |
| Mission completed | +30 |
| Interactive demo goals | varies, with badges |
| Secret transmission decoded (all missions in an episode done) | +250 |
| Boss defeated | +400 |

- **Ranks:** Recruit → Spark (250) → Packet Rider (600) → VM Wrangler (1100) → Container Captain (1800) → Auto-Scaler (2700) → Cloud Architect (3800).
- **Badges:** 33 in total across the four episodes.
- **Certificates:** one per episode (beat the boss + decode the transmission). Completing all four earns the **Workshop Graduate** certificate.
- **The secret transmission:** each episode hides a message. Every completed mission decrypts one piece. Episode 04's message is the golden rule: *stop what you start.*

---

## 7. Your job: the checklist

### Two or three days before the workshop
- [ ] Open [voltide.vercel.app](https://voltide.vercel.app/) on a lab PC **and** on your phone. Click through Episode 01 so you know the flow.
- [ ] Read the field guides: [`sessions/01-spark/guide.md`](sessions/01-spark/guide.md), [`02`](sessions/02-current/guide.md), [`03`](sessions/03-tide/guide.md), [`04`](sessions/04-surge/guide.md). They tell you exactly what to do, segment by segment, plus a troubleshooting table for each lab.
- [ ] Read [`facilitator/README.md`](facilitator/README.md) for the unlock password. It is **not** printed here, because this file may be public.
- [ ] Tell students to install **VirtualBox** and download the **Ubuntu Desktop ISO** before Day 1. Download links are in the Episode 01 field guide.
- [ ] Check lab PCs: **8 GB RAM recommended** (4 GB works), about **40 GB free disk**, and **virtualisation enabled in BIOS**.
- [ ] Keep a **pre-built Ubuntu VM image** on a pen drive as a backup.
- [ ] Decide on **cloud accounts** for Day 2: student AWS Free Tier accounts, or IAM users you create in one account. Everyone turns on **MFA** and a **billing alert**.
- [ ] Prepare one **Google Cloud project with billing** for the App Engine demo in Episode 03 (you run it live; students watch).
- [ ] Confirm the campus network allows **outbound SSH (port 22)**. If it doesn't, students use **EC2 Instance Connect** in the browser instead.
- [ ] Copy the sample files in `sessions/03-tide/lab-files/` and `sessions/04-surge/lab-files/` to a shared folder as a fallback.

### Day 1 (Episodes 01 and 02)
1. Put [voltide.vercel.app](https://voltide.vercel.app/) on the projector and have everyone open it.
2. Open **Episode 01** together and press **Accept mission**.
3. Open the episode's **Field guide** tab on your own screen and teach from it, segment by segment.
4. Use every **checkpoint** as a show-of-hands poll before anyone clicks.
5. In labs, insist students **compare their output** with the expected output, not just copy commands.
6. Run the **boss fight** on the projector with the class shouting answers, or in pairs.
7. When you start Episode 02, **unlock it** (section 8) and continue the same way.

### Day 2 (Episodes 03 and 04)
1. Unlock **Episode 03**. Students launch EC2 servers in the **Mumbai (ap-south-1)** region.
2. Run the App Engine part as a **live demo** from your own Google Cloud project.
3. At the end of Episode 03, make sure every student **stops their instance**.
4. Unlock **Episode 04**. Teams of 3–4: **Builder, Deployer, Tester, Presenter**.
5. Each team deploys, tests on a phone **with Wi-Fi off**, secures, reads logs, and presents.
6. Score the demos with the rubric in the Live demo mission:

   | Criterion | Weight |
   |---|---|
   | Site works live on a phone | 40% |
   | Explains the path (EC2 → security group → nginx → file) | 30% |
   | Security (SSH limited to My IP, only needed ports open) | 15% |
   | Story (one real problem they hit and how they fixed it) | 15% |

7. **Do not let anyone leave** until their team has ticked the **Clean sweep** checklist in the final mission. Each item links straight to the console page where you delete it.

### After the workshop
- [ ] Open the AWS **Billing** dashboard and confirm nothing is still running.
- [ ] Disable the App Engine app, or shut down the Google Cloud project.
- [ ] On shared lab PCs, **reset every browser** for the next batch (section 9).

---

## 8. Unlocking episodes 02, 03 and 04

Locked episodes show a lock screen with a box for a password. The password is in [`facilitator/README.md`](facilitator/README.md).

You have three options. Pick one.

| Option | When to use it | How |
|---|---|---|
| **In class, per device** (recommended) | Normal workshop | When you reach the episode, write the password on the board. Each student types it once; their browser remembers it. Capital letters don't matter. |
| **For everyone, on the live site** | You want an episode open for all, with no password | In Vercel: Project → Settings → Environment Variables. Add `VITE_UNLOCKED_SESSIONS` = `1,2` (the episode numbers to open), then redeploy. |
| **Permanently** | After the workshop, as revision material | In `sessions/index.js`, set `locked: false` for that episode, then push to GitHub. |

**To change the password:** run `npm run facilitator:hash -- YOUR-NEW-PASSWORD`. Paste the `unlockHash` it prints into each locked episode in `sessions/index.js`, then push.

Be honest with students about what this is: a **classroom gate, not real security**. The content is sent to the browser, so a determined student can get around it. That's actually a good point to make in Episode 04, where we teach that anything shipped to a browser is public.

---

## 9. Shared lab PCs: resetting between students

**With accounts on (section 10):** students just **log out** when they're done. Their progress is saved to their account, and the next student logs in to their own. The buttons below are only for a student who wants to start over.

**Without accounts:** progress is saved **only in each browser**, so on shared PCs you must reset between students.

1. Tap the **XP bar** at the top of the page to open the **profile**.
2. Scroll to **Reset (shared lab PCs)**.
3. Choose one:

| Button | What it clears | What it keeps | Use it when |
|---|---|---|---|
| **Reset score** | XP, rank, badges, combos, boss wins, lab ticks | Missions done, checklists, unlocked episodes | The same student wants to replay the game |
| **Reset everything** | **All of it**: XP, badges, missions, checklists, secret messages, unlocked episodes, team card, name, last position | Only the lite-mode setting | A **new student** is sitting down |

Both ask you to confirm first. **Reset everything** takes the browser back to the home page with Episodes 02–04 locked again, like a brand-new browser.

---

## 10. Student accounts and activity tracking (Google Sheets)

VOLTIDE can record every student's logins and learning in our Google Sheet: [VOLTIDE tracking sheet](https://docs.google.com/spreadsheets/d/15bMM6BLLT0-MfPz6LCke1SzORNdXietU_ySdHOvtL_g/edit). The full setup is in [`google-sheets/README.md`](google-sheets/README.md). In short:

1. Paste [`google-sheets/Code.gs`](google-sheets/Code.gs) into the sheet (**Extensions → Apps Script**) and run `setup` once.
2. **Deploy → New deployment → Web app** (Execute as: Me · Who has access: Anyone) and copy the URL.
3. The URL is already built into the site (`src/lib/backend.js`), so pushing to GitHub is enough. To use a different deployment, set `VITE_SHEETS_API` in Vercel; to switch logins off, set it to `off`.

What students then see:
- A **log in / sign up** screen first: name, registration number, email and password.
- **Forgot password?** emails them a 6-digit OTP. On their profile they can **change their password**, also with an OTP.
- Their progress is saved to their account, so they can log in on **any PC** and carry on.

What you then see in the sheet:

| Tab | What it shows you |
|---|---|
| **Overview** | Students signed up, logins today, active in the last hour, missions completed, average XP, failed logins, a **top-15 leaderboard** and the last 15 logins |
| **Students** | One row per student: reg. no., name, email, last login, login count, last active, XP, rank, badges, missions done, episodes unlocked, current page |
| **Logins** | Every sign-up, login, wrong password, logout, OTP and password change, with time and device |
| **Activity** | Every page opened, checkpoint (right or wrong), mission done, lab step, demo goal, badge, boss win or loss, unlock attempt and reset, with time and XP |

Rules: keep the sheet **private** (it holds names and emails); passwords are stored only as salted hashes, never in plain text; tell students what is collected.

---

## 11. Non-negotiables: cost and safety

These are the rules I will not bend on.

1. **Free tier only.** Students pick the instance type marked *Free tier eligible* (`t2.micro` or `t3.micro`).
2. **MFA and a billing alert** on every account, before anyone launches anything.
3. **SSH (port 22) from "My IP" only.** Never from "Anywhere". The website ports (80/443) are the only ones open to everyone.
4. **Never share the `.pem` key.** Not in WhatsApp, not on GitHub, nowhere.
5. **Stop what you start.** Stop instances at the end of Day 1 practicals. **Terminate** everything at the end of Day 2. Check the bill.

VOLTIDE repeats these rules all the way through, and the final mission is a cleanup checklist. Your job is to enforce them in the room.

---

## 12. When things go wrong

Each field guide has its own troubleshooting table. These are the most common problems:

| Problem | Fix |
|---|---|
| Site feels slow or jerky on a lab PC | Press the **⚡ button** in the top bar for **lite mode** (switches off the 3D effects) |
| "VT-x is disabled" in VirtualBox | Enable virtualisation in the PC's BIOS / UEFI settings |
| VM has no internet | VirtualBox network adapter must be set to **NAT** |
| `Permissions 0644 … too open` when using SSH | Run `chmod 400 mykey.pem` |
| SSH times out | Security group must allow SSH from **My IP**; the campus IP may have changed, so edit the rule |
| Website works on my laptop but not on a friend's phone | The HTTP rule is limited to "My IP" (set it to Anywhere), or the phone typed `https://` (type `http://`) |
| Still see "Welcome to nginx!" | The file isn't in place: `sudo mv ~/index.html /var/www/html/index.html` |
| Site broke after stopping and starting the server | The **public IP changed**. Copy the new one from the EC2 console |
| A student's episode is locked again | Their browser was reset or is in private mode. They type the password again |
| No internet in the lab at all | Run VOLTIDE from your laptop (section 13); every lab also works on the local Ubuntu VM |

---

## 13. Running it without the live site

You'll rarely need this, but you should know it's possible.

**On your own laptop** (needs [Node.js](https://nodejs.org/) 20 or newer):
1. Download or clone this project and open a terminal in the folder.
2. Run `npm ci` (first time only; installs everything).
3. Run `npm run dev` and open **http://localhost:5173**.
4. To share it with the room over Wi-Fi, run `npm run dev -- --host` instead. It prints a "Network" address like `http://192.168.x.x:5173` that students can open.

**Fully offline on lab PCs:**
1. Run `npm run build`. This creates a `dist/` folder.
2. Copy `dist/` to each PC (USB stick is fine) and serve it with `npm run preview`, or from any web server.
3. Fonts are bundled, so it runs without internet. External links and photos still need internet.

---

## 14. Updating the live site

The live site at [voltide.vercel.app](https://voltide.vercel.app/) is hosted on **Vercel** and connected to our **GitHub** repo.

1. Make your change (see section 15) and commit it.
2. Push to the `main` branch on GitHub.
3. Vercel rebuilds and publishes automatically within a few minutes. You don't need to do anything else.

Settings already in the repo (`vercel.json`): framework **Vite**, install `npm ci`, build `npm run build`, output `dist`. Links like `#/session/2` work without any extra configuration.

**Keep the GitHub repo private** if students shouldn't see `facilitator/`.

---

## 15. Changing the content

You can change almost everything without touching the engine.

| I want to… | Edit this |
|---|---|
| Change a mission's text, lab, checkpoint or boss questions | `sessions/<episode>/content.jsx` |
| Change the teaching notes | `sessions/<episode>/guide.md` |
| Change an episode's name, colours, lock or password | `sessions/index.js` |
| Add or change a glossary word | `src/data/glossary.js` |
| Give a mission a specific colour or pattern | add `theme: { a: '#hex', b: '#hex', motif: 'waves' }` to that mission in `content.jsx` |
| Change the student handbook | `guide.md` (also shown in the app at `#/handbook`) |

After any change, push to GitHub and the live site updates (section 14).

---

## 16. Links you can share

| Link | Opens |
|---|---|
| [voltide.vercel.app](https://voltide.vercel.app/) | Home |
| [`/#/session/1`](https://voltide.vercel.app/#/session/1) to [`/#/session/4`](https://voltide.vercel.app/#/session/4) | An episode |
| [`/#/session/1/topic/service-models`](https://voltide.vercel.app/#/session/1/topic/service-models) | One specific mission (copy any mission's link with its "Copy mission link" button) |
| [`/#/session/1/guide`](https://voltide.vercel.app/#/session/1/guide) | That episode's field guide |
| [`/#/glossary`](https://voltide.vercel.app/#/glossary) | Jargon buster (106 terms, each linked to where it's taught) |
| [`/#/handbook`](https://voltide.vercel.app/#/handbook) | How VOLTIDE works, for students |
| [`/#/profile`](https://voltide.vercel.app/#/profile) | XP, badges, certificates and the reset buttons |

---

## 17. Questions you'll be asked

**Do students need to sign up?** Only when the Google Sheet is connected (section 10). Then they sign up once with their name, registration number, email and a password, and log in after that. Without it, they just open the link.

**Do we collect any student data?** Only with the Google Sheet connected: name, registration number, email, login times and devices, and what they do in VOLTIDE, all in our private sheet. Passwords are never stored, only salted hashes. Without the sheet, nothing leaves the student's browser.

**A student forgot their password.** They click **Forgot password?** on the login screen and get a 6-digit code by email. Nobody, including you, can see their password.

**Will it work on phones?** Yes. Every page works on a phone, with a navigation bar at the bottom. Labs still need a laptop or lab PC, because students type commands.

**Can a student lose their progress?** With accounts on, no: it's saved to their account and comes back when they log in anywhere, unless they press **Reset everything** themselves. Without accounts, it's lost if their browser data is cleared, they use a private window, or someone presses **Reset everything**.

**Does any demo cost money?** No. Every demo on the site is simulated. Only the real labs on AWS / Google Cloud can cost money, and section 11 covers that.

**The 3D effects are slowing the PC down.** Press the **⚡ button** for lite mode. It's switched on automatically for anyone whose device asks for reduced motion.

**What if the internet goes down?** Run it locally (section 13). Every lab also works on the local Ubuntu VM.

---

## 18. Where everything lives

```
voltide/
├── README.md            ← this memo
├── guide.md             ← student handbook (also in-app at #/handbook)
├── PLAN.md              ← every mission in every episode + design notes
├── facilitator/         ← unlock password, teaching notes, workshop PDF, password tool
├── google-sheets/       ← Code.gs (paste into Apps Script) + step-by-step setup
├── sessions/
│   ├── index.js         ← the 4 episodes: names, colours, lock, password, 3D scene
│   ├── 01-spark/        ← README.md · guide.md · content.jsx · demos/ · visuals/
│   ├── 02-current/
│   ├── 03-tide/         ← + lab-files/ (hello.c, app.py, App Engine app)
│   └── 04-surge/        ← + lab-files/ (index.html starter page)
└── src/                 ← the engine: pages, game/XP, 3D scenes, themes, styles
```

Credits: built with [React](https://react.dev/), [Vite](https://vite.dev/), [three.js](https://threejs.org/), [GSAP](https://gsap.com) and [Lenis](https://lenis.darkroom.engineering); effects from [React Bits](https://github.com/DavidHDev/react-bits) (MIT + Commons Clause, see `src/vendor/reactbits/LICENSE.md`); colours from [shadcn/ui](https://ui.shadcn.com/).

---

That's everything. The tool does the heavy lifting: the explanations, the practice, the motivation, the checklists. What it can't do is stand in the room, notice the student who's stuck, and make sure every server gets switched off at the end. That part is yours, and it's the part that matters most.

Thank you for running this. Let's make sure every student leaves having shipped something real.

**— CEO**
