# Running the Live Draw — Operator Instructions

For whoever is at the keyboard during the live draw (4:00pm, Friday 14 August 2026).

**Important — the organizer's URL is different from everyone else's.**

- **You (running the draw):** [football.marandmor.com/draw-display.html?admin=1](https://football.marandmor.com/draw-display.html?admin=1) — note the `?admin=1` at the end. This gives you the Start Draw / Draw Name / Auto-play / Undo / Speed buttons.
- **Everyone else:** [football.marandmor.com/draw-display.html](https://football.marandmor.com/draw-display.html) (no `?admin=1`) — this is the plain public link already on the homepage and nav bar. It's read-only and now updates **live** as you draw, on their own device, without needing to be on the Teams call. They'll see the same reveal animation, sound, and voice announcement, just a second or two behind you.

Still start a Teams screen share of your **entire screen** as the primary way people watch together in the room/call — the direct link is a bonus for anyone who can't join the call or wants to follow along on their own device.

*(`draw-admin.html` still exists if you ever want to edit the participant/team lists beforehand, but it isn't needed to run the draw.)*

## 1. Before you go live

1. Open [football.marandmor.com/draw-display.html?admin=1](https://football.marandmor.com/draw-display.html?admin=1) in Chrome — **don't forget `?admin=1`**, otherwise you'll get the read-only view with no buttons.
2. Scroll the team cards to confirm all 16 teams are listed correctly.
3. In Teams, start screen share and choose **Share entire screen** (not a specific window) — this way whatever you click and whatever pops up on screen is visible to everyone, including the browser chrome/animation together.
4. If you want to test the public link works, open [football.marandmor.com/draw-display.html](https://football.marandmor.com/draw-display.html) (no `admin`) in a different browser or your phone beforehand and confirm it says "Waiting for the organizer to start the draw…".

## 2. Start the draw

1. Click **🔀 Start Draw** — this shuffles the 143 names into a fresh random pool and enables the draw buttons.
2. To draw one name at a time: click **🎟️ Draw Name**. Each click plays the full spin-and-reveal animation and assigns that person to the next team in the rotation.
3. To let it run on its own: click **▶ Auto-play**. It keeps drawing automatically, pausing briefly between picks (adjust the **Pace between picks** slider — this is just how many seconds it waits after one pick lands before starting the next one automatically; it has no effect if you're clicking Draw Name manually). Click it again (now labeled **Pause**) to stop.
4. Made a mistake, or the wrong name got drawn? Click **↩ Undo** — it removes the last pick from its team and puts the name back in the pool.

## 3. Finishing up

1. Once all 143 names are drawn, the page shows a "Draw complete" banner with confetti, and the Draw/Auto-play buttons disable themselves.
2. Click **⬇ CSV** for a plain results list, and/or **⬇ teams.json** — this is the file the rest of the site (Fixtures, Stats) reads team rosters from.
3. Replace `data/teams.json` in the site's GitHub repo with the exported file, then commit and push so the live site picks it up (see the main README for the exact git commands).

## If something goes wrong mid-draw

| Problem | Fix |
|---|---|
| Wrong name/mis-click | Click **↩ Undo** — reverses the last pick only. |
| Need to bail and start completely over | **⟲ Reset** re-shuffles from scratch and clears every pick. Confirms before doing it. |
| Page accidentally refreshed mid-draw | No longer a problem — progress is saved to this browser automatically after every pick, so a refresh restores exactly where you left off (team cards, pick count, everything). Just don't clear your browser data mid-draw. |
| Draw feels slow | Use the **Speed** buttons (1x/2x/3x) next to the pace slider — they speed up both the spin animation and the auto-play pacing together. |
| Public viewers say the page isn't updating | It needs internet access to the live-sync service — if it's stuck on "Live sync unavailable," their Teams screen-share view still works fine as a fallback. Confirm you're not testing on a locked-down office wifi that blocks it. |

## Your randomization questions, answered

- **Does Reset repeat the same order?** No. **⟲ Reset** (and **🔀 Start Draw**) re-shuffles the full 143-name pool from scratch each time, and every individual pick is then drawn using the browser's cryptographically secure random number generator (`crypto.getRandomValues`) — not a seeded or repeating sequence. Two runs will not produce the same order or the same team assignments.
- **What technique is used?** Two layers: (1) the whole pool is shuffled with a Fisher–Yates shuffle when you click Start/Reset, and (2) each individual "Draw Name" click then picks one random index out of whatever names remain, using the Web Crypto API's secure RNG (stronger than a typical `Math.random()`-only approach). Which *team* is next to pick is not random — it follows a fixed "snake" rotation (Team 1 → 16, then 16 → 1, repeating) so every team ends up with a fair, even squad size; but *who* lands on that team at each turn is fully random.
- **What does "Pace between picks" mean?** It only applies during **Auto-play** — it's the pause (0.8–4 seconds) between one name landing and the next draw starting automatically. It does nothing if you're clicking Draw Name yourself.

## Quick reference

- **You run the draw from:** [football.marandmor.com/draw-display.html?admin=1](https://football.marandmor.com/draw-display.html?admin=1)
- **Everyone else watches from:** [football.marandmor.com/draw-display.html](https://football.marandmor.com/draw-display.html)
- **Site home:** [football.marandmor.com](https://football.marandmor.com/)
- **Team size split:** 15 teams of 9, 1 team of 8 (based on 143 names, balanced snake draft)
