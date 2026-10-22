# Connect VOLTIDE to Google Sheets

This adds **student accounts** and **activity tracking** to VOLTIDE, all stored in your Google Sheet:
<https://docs.google.com/spreadsheets/d/15bMM6BLLT0-MfPz6LCke1SzORNdXietU_ySdHOvtL_g/edit>

Once it's connected:
- Students **sign up** with their name, registration number, email and a password, then **log in**.
- They can **reset** a forgotten password, or **change** it from their profile, with a **6-digit OTP** sent to their email.
- Every login, logout, failed login and password change goes to the **Logins** tab.
- Every page opened, checkpoint, mission, lab step, badge, boss fight, unlock and reset goes to the **Activity** tab.
- Each student's latest XP, rank, badges, missions and current page are kept up to date on the **Students** tab.
- Progress is **saved to the account**. A student can log in on any PC and carry on, and on a shared lab PC each student only ever sees their own progress.

Everything runs on a free Google Apps Script attached to the sheet. There's no other server.

---

## Step 1 · Paste the script

1. Open the sheet.
2. Click **Extensions → Apps Script**. A new tab opens with a file called `Code.gs`.
3. Delete everything in it.
4. Copy the whole of [`Code.gs`](Code.gs) from this folder and paste it in. The sheet ID is already filled in on line 19 (`SHEET_ID`).
5. Click **💾 Save**. Name the project `VOLTIDE` if asked.

## Step 2 · Run the one-time setup

1. In the toolbar, pick the function **`setup`** from the drop-down, then click **▶ Run**.
2. Google asks for permission the first time:
   1. Click **Review permissions** and choose your Google account.
   2. You'll see "Google hasn't verified this app". That's normal for your own script. Click **Advanced → Go to VOLTIDE (unsafe)**.
   3. Click **Allow**. The script needs to edit this spreadsheet and send email (for the OTP codes).
3. Wait for "Execution completed". Go back to the sheet. You'll now have these tabs:

| Tab | What it holds |
|---|---|
| **Overview** | Live totals (students, logins today, active in the last hour, missions done, average XP, failed logins), a **top-15 leaderboard** and the **last 15 logins** |
| **Students** | One row per student: registration no., name, email, signed-up time, last login, login count, last active, XP, rank, badges, missions done, episodes unlocked, current page |
| **Logins** | Every sign-up, login, wrong password, logout, OTP sent and password change, with time and device |
| **Activity** | Every learning event: time, student, episode, type, item, detail, XP gained, total XP, page |
| Sessions *(hidden)* | Login tokens. Don't edit. |
| OTP *(hidden)* | Pending codes, stored hashed. Don't edit. |

On the Students tab, three columns are **hidden on purpose**: the password hash, the salt and the saved progress. Leave them hidden.

## Step 3 · Publish it as a web app

1. Click **Deploy → New deployment**.
2. Click the ⚙️ gear next to "Select type" and choose **Web app**.
3. Fill in:
   - **Description:** `VOLTIDE API`
   - **Execute as:** **Me**
   - **Who has access:** **Anyone**. Students don't need Google accounts; the site handles its own logins.
4. Click **Deploy**, then copy the **Web app URL**. It looks like `https://script.google.com/macros/s/AKfy…/exec`.
5. Quick check: open that URL in a browser. You should see `{"ok":true,"data":{"app":"VOLTIDE",…}}`.

## Step 4 · Connect the website

**Already done for this project.** The deployed web app URL is built into [`src/lib/backend.js`](../src/lib/backend.js):

```
https://script.google.com/macros/s/AKfycbwnGytFBNFVJZjGTch-NawaCiqXXk40ahr-Nv57KfoGRwYd-pISZQfa1VG5tF1n1iuDqQ/exec
```

Just push the project to GitHub and Vercel redeploys it with the login screen switched on.

- **To use a different deployment:** add a Vercel environment variable (**Settings → Environment Variables**) with key `VITE_SHEETS_API` and the new `/exec` URL as its value, then **Redeploy**. Locally, put the same line in a `.env.local` file.
- **To switch logins off** (back to no accounts): set `VITE_SHEETS_API` to `off` and redeploy.
- **If you edit `Code.gs`:** publish a **new version** of the same deployment (see "Changing the script later" below). The URL stays the same, so nothing needs to change on the site.

## Step 5 · Test it

1. Open the site. You should now see the **Log in / Sign up** screen instead of the home page.
2. Sign up with a test account. Check the **Students** and **Logins** tabs: your row appears.
3. Open a mission, answer a checkpoint and mark the mission complete. Within about 30 seconds (or as soon as you switch tabs), rows appear on the **Activity** tab.
4. Try **Forgot password?** and check that the code arrives by email (look in spam too).

## Optional · Clean-up timer

Expired logins and codes are harmless, but you can clear them daily:

1. In Apps Script, click **⏰ Triggers** in the left bar → **+ Add Trigger**.
2. Choose function **`cleanup`**, event source **Time-driven**, **Day timer**, any time.
3. Click **Save**.

---

## Changing the script later

If you edit `Code.gs`, you must publish a new version or the site keeps using the old one:

1. **Deploy → Manage deployments**.
2. Click ✏️ edit on your deployment.
3. Under **Version**, choose **New version**.
4. Click **Deploy**.

The URL stays the same, so you don't need to change anything on Vercel.

## Settings you can change (top of `Code.gs`)

| Setting | Default | Meaning |
|---|---|---|
| `SESSION_DAYS` | 14 | How long a login lasts on one device |
| `OTP_MINUTES` | 10 | How long an emailed code works |
| `OTP_RESEND_SECONDS` | 60 | Minimum gap between two codes |
| `OTP_MAX_TRIES` | 5 | Wrong codes allowed before a new one is needed |
| `LOGIN_MAX_FAILS` / `LOGIN_LOCK_MINUTES` | 5 / 15 | Wrong passwords before a short lock, and how long it lasts |

## Security and privacy

- **Keep the sheet private.** Don't share it as "Anyone with the link". It contains students' names and emails.
- **Passwords are never stored.** The sheet keeps a salted hash (1,000 rounds of SHA-256). Nobody, including you, can read a student's password. A forgotten password can only be reset by OTP.
- **OTP codes** are stored hashed, expire after 10 minutes, and stop working after 5 wrong tries.
- **Five wrong passwords** lock that account for 15 minutes.
- **Changing a password** logs that account out on every other device.
- **No formulas from students:** anything a student types that starts with `=`, `+`, `-` or `@` is saved as plain text, so it can't run as a formula in your sheet.
- **Tell students what you collect:** name, registration number, email, login times and device, and what they do in VOLTIDE.

## Limits to know

- **Emails:** Apps Script can send about **100 emails a day** from a free Gmail account, or about **1,500** from Google Workspace. Every OTP counts as one email.
- **Busy classes:** the site sends activity in batches (every 30 seconds, plus when a tab is hidden or closed), so a class of around 100 students is fine. If many students sign in at the same moment, a few may see the "servers are napping" cartoon for a second; retrying works.

## Troubleshooting

| What you see | Fix |
|---|---|
| No login screen on the site | `VITE_SHEETS_API` isn't set, or the site wasn't redeployed after adding it |
| The "No internet" plug cartoon on every attempt | Wrong URL (it must end in `/exec`), or **Who has access** isn't **Anyone**. Redeploy with the right settings |
| "LAGZILLA chewed a cable" (500) | Open Apps Script → **Executions** to see the error. Usually `setup` was never run, or the script wasn't re-deployed after an edit |
| OTP email never arrives | Check spam. Check the daily email limit. Make sure you clicked **Allow** for sending email when you ran `setup` |
| A student forgot their registration number | Look it up on the **Students** tab by name or email |
| A student wants their progress wiped | They can use **Reset everything** on their profile, or you can clear the hidden **Progress (JSON)** cell in their row |
