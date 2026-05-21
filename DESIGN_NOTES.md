# Checklist — Design Notes

Project state + context, kept in the repo so it travels with the code.
Last updated: 2026-05-21.

## Overview

A multi-list checklist web app. Single static file (`index.html`) — HTML + CSS +
vanilla JS, no build step, no framework, no dependencies.

- **Live:** https://twoseam.github.io/checklist/
- **Repo:** https://github.com/twoseam/checklist
- **Deploy:** push to `main` → GitHub Pages auto-publishes (~1–2 min).
- **Version:** v1.3.6 in code (in-app changelog: tap the version number).
  ⚠️ v1.3.5/v1.3.6 may be unpushed/untested — check `git status`.

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

- `action`: `added` | `completed` | `deleted` | `restored`.
- No `completed` array — checking a task removes it and logs a `completed` event.
- A "session" batch starts on opening a list, ends on leaving it.

## What's built

- Multiple named lists; home = square cards, 2-col grid; drag to reorder cards.
- 5-color brand palette per list; list view themes to that color.
- Animated home backdrop: drifting gradient of all list colors.
- Tasks: add, complete (→history), delete, drag-reorder.
- Per-list session History; shows live; restore via button or the check icon.
- Animated "done" badge on a card when its list has 0 open tasks.
- Branded confirm dialogs (no native popups).
- Sliding view transitions; swipe-right-to-go-back.
- Version footer + changelog modal.
- iOS home-screen icon + installable PWA; pinch-zoom disabled.
- Contrast handling: light list colors auto-switch UI text to dark.

## Brand palette

Orange `#F05726` · Purple `#7226F0` · Teal `#26F0C1` · Yellow `#E5B82B` · Brown `#9B604C`.

## ⚠️ OPEN BUGS — unresolved at end of session

1. **iOS standalone background gap.** In the installed home-screen webapp, the
   bottom ~10% of the screen shows the layer *behind* the main background
   (a strip of the wrong color). Many fix attempts (v1.3.1–v1.3.6) did NOT
   resolve it. Latest attempt (v1.3.6): the animated gradient was moved onto
   the `body` element (the orange strip proved `body` reaches the bottom).
   **UNVERIFIED** — needs testing on a real iPhone.
   - The background is an ANIMATED gradient (`bgDrift`), not a solid color —
     any fix must preserve the animation.
   - DO NOT keep guessing. If v1.3.6 still fails, add a temporary on-screen
     readout of `window.innerHeight`, `screen.height`, etc. and diagnose with
     real numbers. This issue cannot be solved blind from screenshots.

2. **Pull-to-refresh doesn't work.** Native pull-to-refresh can't work with the
   fixed-position view layout. Needs a custom gesture build. `overscroll-behavior`
   was removed but that did not enable it.

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

- ← NEXT: verify/finish the iOS background fix (open bug #1).
- Then: custom pull-to-refresh (open bug #2).
- Later (deferred): cross-device sync (Supabase accounts or shared sync-code).
