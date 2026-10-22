# Facilitator guide

## Setting up the room
- Serve the site from your laptop: `npm run dev`, then share `http://<your-LAN-IP>:5173`, or copy `dist/` to each lab PC (works offline).
- On weak lab PCs, students press the ⚡ button for lite mode.
- Project the session map at the start of each session; it doubles as the agenda.

## Running a session
1. Open the session's **Field guide** tab and teach segment by segment.
2. Use each **checkpoint** as a show-of-hands poll before revealing the answer.
3. Labs show the **expected output**. Ask students to compare, not just copy.
4. End with the takeaway checklist on the projector.

## Keep it smooth (from the workshop plan)
- Prepare VM images and sample code in advance.
- If cloud accounts or internet are unavailable, use a local VM: every lab works on the Ubuntu VM.
- Students use free tiers with a billing alert, and **stop or delete temporary cloud resources after the workshop**.
- Restate the golden rule at the start of every episode: *stop what you start.*

## Student accounts (Google Sheets)
If the site is connected to the Google Sheet (see `google-sheets/README.md`), students sign up and log in, and their progress is saved to their account. On shared PCs, students simply **log out** from their profile when they finish; the next student logs in to their own account. Watch the **Overview** tab of the sheet during class to see who is active and the live leaderboard.

## Shared lab PCs: resetting between students
Open the **profile** (click the XP bar) and scroll to **Reset**:
- **Reset score** clears XP, badges, combos and boss results. Mission progress, checklists and unlocked episodes stay. Use it to replay the game.
- **Reset everything** wipes all activity in this browser: XP, badges, mission progress, takeaway checklists, unlocked episodes, team card, handle and last position. The next student starts at episode 01, locked like new. (The lite-mode setting is kept.)

Both ask for confirmation. Progress lives only in the browser's local storage, so nothing is shared between PCs or students.
