# Checklist — Design Notes

Project state + context, kept in the repo so it travels with the code.
Last updated: 2026-05-21.

## Overview

A multi-list checklist web app. Single static file (`index.html`) — HTML + CSS +
vanilla JS, no build step, no framework, no dependencies.

- **Live:** https://twoseam.github.io/checklist/
- **Repo:** https://github.com/twoseam/checklist
- **Deploy:** push to `main` → GitHub Pages auto-publishes (~1–2 min).
- **Version:** v1.4.3 in code (in-app changelog: tap the version number).

## Files

- `index.html` — the entire app.
- `manifest.json` — PWA manifest.
- `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png` — home-screen icons.
- `DESIGN_NOTES.md` — this file.

## Data model

`localStorage` key `checklist_data`:

```
state = { lists: [ {
  id, name, color,
  todos:   [ { id, text } ],
  batches: [ { id, name, startedAt, events: [ { action, text, at } ] } ]
} ] }
```

- `action`: only `completed` is logged (since v1.3.10). The `added`/`deleted`/
  `restored` values still exist in old code paths/CSS but nothing writes them;
  `loadState` strips any non-`completed` events from existing data.
- No `completed` array — checking a task removes it and logs a `completed` event.
- A "session" batch starts on opening a list, ends on leaving it.

## What's built

- Multiple named lists; home = square cards, 2-col grid; drag to reorder cards.
- 5-color brand palette per list; list view themes to that color.
- Animated home backdrop: drifting gradient of all list colors.
- Tasks: add, complete (→history), delete, drag-reorder.
- Swipe a task left to complete it (turns green past ~30% of row width).
- New lists (and fresh installs) start with no tasks.
- Per-list session History; shows live; restore via button or the check icon.
- Animated "done" badge on a card when its list has 0 open tasks.
- Branded confirm dialogs (no native popups).
- Sliding view transitions; swipe-right-to-go-back.
- Version footer + changelog modal.
- iOS home-screen icon + installable PWA; pinch-zoom disabled.
- Contrast handling: light list colors auto-switch UI text to dark.

## Brand palette

Orange `#F05726` · Purple `#7226F0` · Teal `#26F0C1` · Yellow `#E5B82B` · Brown `#9B604C`.

## ⚠️ OPEN BUGS

1. **Pull-to-refresh doesn't work.** Native pull-to-refresh can't work with the
   fixed-position view layout. Needs a custom gesture build. `overscroll-behavior`
   was removed but that did not enable it.

## Resolved

- **iOS standalone background gap (FIXED v1.3.9).** In the installed app the
  bottom ~62px showed a wrong colour. Diagnosed with an on-screen readout: in
  standalone PWA, `innerHeight`/`body` height = 894px but `screen.height` =
  956px, so the gradient stopped 62px short.
  - v1.3.8 tried a separate `position: fixed` `#bgLayer` — iOS clips fixed
    elements to the 894px layout viewport, so it left a 62px band. Don't use a
    fixed layer for the backdrop.
  - v1.3.9 fix (works): the animated gradient lives on `<body>` — the page's
    main background, which iOS fills edge-to-edge — and `body` height is pinned
    to `var(--app-h)` (= `max(innerHeight, screen.height)`, 956px) so it is
    tall enough. `html` gets `overflow: hidden` so the taller body can't
    scroll. The gradient still animates (`bgDrift`, `background-size: 300vw
    300vh`); it is NOT a solid colour.
  ⚠️ Confirm once on-device with a screenshot of the installed app.

## Caveats / accepted tradeoffs

- **No sync.** `localStorage` only — every browser/device is independent.
- Swipe-back gesture is touch-only.
- The app is JS-rendered — markdown/fetch tools can't verify it; test in a browser.
- iOS standalone caches hard — to see a new version you must delete the
  home-screen icon and re-add it.
- App always opens to the home view on load.

## Workflow notes

- Owner (Michael) pushes via GitHub Desktop. He is a filmmaker, not a developer.
- Communication preferences are mandatory — see `../../00-Communication.md`
  (auto-loaded). Very short, bullet lists, one task-step at a time, no jargon.

## Roadmap

- ← NEXT: confirm the v1.3.8 background fix on a real iPhone.
- Then: custom pull-to-refresh (open bug #1).
- Later (deferred): cross-device sync (Supabase accounts or shared sync-code).
