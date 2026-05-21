# Checklist — Design Notes

Project state + context, kept in the repo so it travels with the code.
Last updated: 2026-05-21.

## Overview

A multi-list checklist web app. Single static file (`index.html`) — HTML + CSS +
vanilla JS, no build step, no framework, no dependencies.

- **Live:** https://twoseam.github.io/checklist/
- **Repo:** https://github.com/twoseam/checklist
- **Deploy:** push to `main` → GitHub Pages auto-publishes (~1–2 min).
- **Current version:** v1.3.0 (in-app changelog: click the version number at the
  bottom of the home screen).

## Files

- `index.html` — the entire app.
- `manifest.json` — PWA manifest (installable web app).
- `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png` — home-screen / PWA icons.
- `DESIGN_NOTES.md` — this file.

## Data model

Stored in `localStorage` under key `checklist_data`:

```
state = { lists: [ {
  id, name, color,
  todos:   [ { id, text } ],
  batches: [ { id, name, startedAt, events: [ { action, text, at } ] } ]
} ] }
```

- `action` is one of: `added` | `completed` | `deleted` | `restored`.
- There is **no `completed` array** — checking a task removes it from `todos` and
  logs a `completed` event into the current history batch.
- A "session" batch starts when you open a list and ends when you leave it.

## What's built (v1.3.0)

- Multiple named lists; home = square cards in a 2-col grid; drag to reorder cards.
- Per-list color from a 5-color brand palette; the list view themes to that color.
- Animated home backdrop: a gradient of every list's color, slowly drifting.
- Tasks: add, complete (→ history), delete, drag-to-reorder.
- Per-list session History; shows live; restore any event (Restore button or by
  clicking the completed item's check icon).
- Animated "done" badge on a card when its list has 0 open tasks.
- Branded confirm dialogs (no native browser popups).
- Sliding view transitions; swipe-right-to-go-back gesture; modals fade/scale in.
- Version footer + changelog modal.
- iOS home-screen icon + installable PWA; mobile pinch-zoom disabled.
- Contrast handling: light list colors (yellow/teal) auto-switch UI text to dark.

## Brand palette

Orange `#F05726` · Purple `#7226F0` · Teal `#26F0C1` · Yellow `#E5B82B`
(toned down from the original `#F0E726` for readability) · Brown `#9B604C`.

## Caveats / accepted tradeoffs

- **No sync.** `localStorage` only — every browser/device is independent, no
  accounts, no cross-device sync. (Considered Supabase accounts or a shared
  sync-code; user chose to skip for now — see Roadmap.)
- Swipe-back gesture is **touch-only** — not testable with a desktop mouse.
- The app is JS-rendered, so markdown/fetch tools can't verify it — test in a
  real browser.
- iOS status bar style is `default` (light bar, dark text) on purpose;
  `black-translucent` would put white status text over light list colors.
- App always opens to the home view on load (doesn't restore the last open list).

## Workflow notes

- Owner pushes via **GitHub Desktop**. (One earlier push failed due to a diverged
  branch — resolved with a rebase.)
- The repo file is lowercase `index.html` (was once `Index.html`).

## Roadmap / ideas (not committed)

- Cross-device persistence — Supabase accounts (passwordless) or a shared
  sync-code. Bigger change; needs a backend service. Deferred.
- Optional: auto-expand the current session in History.
