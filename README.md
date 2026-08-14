# 2026 MAR&MOR Staff Football Tournament — site

A plain static site (no build step) for the tournament: home/overview, live team draw, fixtures/bracket, and stats. Deploys directly to Vercel.

**Live site:** [football.marandmor.com](https://football.marandmor.com/)

## Pages

| File | Purpose |
|---|---|
| `index.html` | Tournament overview — draw details, teams, format, venue |
| `draw-admin.html` | Optional secondary control panel — edit the participant/team lists, or drive a second `draw-display.html` window remotely via `postMessage`. Not required for the live draw. |
| `draw-display.html` | **This is the page you run the live draw from — with `?admin=1` in the URL.** Has its own Start Draw / Draw Name / Auto-play / Undo / Export buttons built into the same screen as the animation. Without `?admin=1` (the plain public link, used on the homepage/nav), it's a read-only view that updates live for anyone via Firebase Realtime Database. |
| `fixtures.html` | Round of 16 → QF → SF → 3rd/Final bracket + weekly schedule. Reads `data/fixtures.json`. |
| `stats.html` | Top scorers, results log, progress. Reads `data/fixtures.json`. |
| `assets/style.css` | Shared theme | 
| `assets/nav.js` | Shared nav bar, injected into `<div id="site-nav">` on every page |
| `data/teams.json` | Team rosters (who's on which team). Replaced by the export from `draw-admin.html` after the live draw. |
| `data/fixtures.json` | Bracket pairings, schedule, and match results. Edit this weekly. |

## Running the draw live (14 Aug, 4pm)

1. Open [football.marandmor.com/draw-display.html?admin=1](https://football.marandmor.com/draw-display.html?admin=1) — **note the `?admin=1`** — on the organizer's laptop. That query param is what turns on the Start Draw / Draw Name / Auto-play / Undo buttons.
2. In Teams, share your **entire screen** (not a single window) so people see you click the buttons and the animation together.
3. Click **🔀 Start Draw**, then **🎟️ Draw Name** (or **▶ Auto-play**) to run the ballot live, right there on the same screen.
4. When done, click **⬇ teams.json**. Replace `data/teams.json` in this repo with the downloaded file, then commit & push (see below) so the Fixtures page shows real rosters.

Anyone who opens the plain [football.marandmor.com/draw-display.html](https://football.marandmor.com/draw-display.html) link (no `?admin=1` — this is what the homepage and nav bar already link to) sees a read-only view that updates live in real time on their own device via Firebase Realtime Database, without needing to be on the Teams call.

`draw-admin.html` still exists if you want to edit the participant/team lists beforehand, but it isn't required to run the draw itself.

For the full operator runbook (step-by-step, plus troubleshooting and the randomization technique used), see [`DRAW-DAY-INSTRUCTIONS.md`](./DRAW-DAY-INSTRUCTIONS.md).

## Updating match results each week

`data/fixtures.json` holds every match, keyed by id (`R16-0`…`R16-7`, `QF-0`…`QF-3`, `SF-0`, `SF-1`, `3P-0`, `F-0`). Round of 16 pairings and the Friday schedule are already filled in; later rounds' teams are computed automatically from winners — you never need to fill those in by hand.

After a match, edit its entry under `"results"`:

```json
"R16-0": { "scoreA": 2, "scoreB": 1, "scorersA": [{"name": "Player Name", "goals": 2}], "scorersB": [{"name": "Player Name", "goals": 1}] }
```

`scorersA`/`scorersB` are optional — leave them as empty arrays if you're not tracking goal scorers. If a knockout match is drawn after 90 minutes and goes to penalties, add `"penA"` and `"penB"` with the shootout score.

Commit and push the updated file — Vercel redeploys automatically and the Fixtures/Stats pages pick it up.

## Local preview

Because the Fixtures and Stats pages load `data/*.json` with `fetch()`, opening the HTML files directly (`file://`) will fail with a CORS error in most browsers. Run a tiny local server from this folder instead:

```bash
npx serve .
# or
python3 -m http.server 8000
```

Then open `http://localhost:3000` (or `:8000`). `draw-admin.html` and `draw-display.html` work fine over `file://` too, but the local server is more representative of production.

## Deploying

1. Push this folder to a GitHub repo.
2. In Vercel: **New Project → Import** the repo. No framework preset needed — it's a static site, so leave build command empty and output directory as `.` (root).
3. Every push to the main branch redeploys automatically.

## Notes

- The tournament announcement cited **142** eligible participants; the "UPDATED PLAYERS LIST" file supplied 143 names (no duplicates). The extra name is flagged on `draw-admin.html` — reconcile before Friday's draw if needed.
- Round of 16 pairings are simply teams taken in the order they appear in the announcement (Watts vs Circuit Breakers, Grid vs Chillers, etc.) — not seeded, since team rosters themselves are randomly drawn anyway.
- `draw-display.html` now runs and owns the draw itself (own shuffle, own picks). Progress is saved automatically (both to the browser and to Firebase), so a refresh mid-draw restores exactly where it left off. `draw-admin.html` is kept only for pre-event list editing and the optional two-window remote-control flow.
- Live cross-device sync uses a free Firebase Realtime Database project (see `draw-display.html`'s inline `firebaseConfig` for the project). Its security rules are wide open (read/write, no auth) for simplicity during the event — fine for a low-stakes internal one-day tool, but worth locking down or deleting the Firebase project afterward if you don't plan to reuse it.
