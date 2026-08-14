# 2026 MAR&MOR Staff Football Tournament — site

A plain static site (no build step) for the tournament: home/overview, live team draw, fixtures/bracket, and stats. Deploys directly to Vercel.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Tournament overview — draw details, teams, format, venue |
| `draw-admin.html` | **Private.** Draw control panel — load/edit participants & teams, run the live draw, undo, export results. Don't share this URL or screen. |
| `draw-display.html` | Public presentation screen for the live draw. This is what you screen-share in Teams. Stays in sync with `draw-admin.html` live via `postMessage` between the two open windows — no server involved. |
| `fixtures.html` | Round of 16 → QF → SF → 3rd/Final bracket + weekly schedule. Reads `data/fixtures.json`. |
| `stats.html` | Top scorers, results log, progress. Reads `data/fixtures.json`. |
| `assets/style.css` | Shared theme | 
| `assets/nav.js` | Shared nav bar, injected into `<div id="site-nav">` on every page |
| `data/teams.json` | Team rosters (who's on which team). Replaced by the export from `draw-admin.html` after the live draw. |
| `data/fixtures.json` | Bracket pairings, schedule, and match results. Edit this weekly. |

## Running the draw live (14 Aug, 4pm)

1. Open `draw-admin.html` on the organizer's laptop.
2. Click **Open Display Window** — a second window opens (`draw-display.html`). Share *that* window in the Teams call, not the admin page.
3. On the admin page: confirm the participant list and team names, click **Lock In Lists & Enable Draw**.
4. Click **Draw Name** (or **Auto-play**) to run the ballot live. Both windows update together.
5. When done, click **Export teams.json** on the admin page. Replace `data/teams.json` in this repo with the downloaded file, then commit & push (see below) so the Fixtures page shows real rosters.

If the popup is blocked, allow popups for the site, or use the manual link shown on the admin page.

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
- `draw-admin.html` is the only source of truth during the live draw; `draw-display.html` is a pure renderer and can be safely reloaded/reopened (click **Resync Display** on the admin page afterward).
