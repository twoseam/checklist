# JotList — Design Notes

Project state + context, kept in the repo so it travels with the code.
Last updated: 2026-05-21.

## Overview

A multi-list checklist web app. Single static file (`index.html`) — HTML + CSS +
vanilla JS, no build step, no framework, no dependencies. **Single-file is
intentional** — do not split into separate CSS/JS files.

- **Live:** https://jotlist.io  (also https://twoseam.github.io/checklist/)
- **Repo:** https://github.com/twoseam/checklist
- **Deploy:** push to `main` → GitHub Pages auto-publishes (~1–2 min).
- **Version:** v1.4.5 in code (in-app changelog: tap the version number).
  ⚠️ Working tree is **uncommitted** — last *pushed* commit is v1.4.4
  (`365c749`). v1.4.5 (completed-task swipes, pull-to-refresh, 2 default
  lists, ~185-line dead-CSS trim) + this doc are not committed/pushed yet.

## Files

- `index.html` — the entire app (~2300 lines).
- `manifest.json` — PWA manifest.
- `CNAME` — custom domain (`jotlist.io`).
- `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png` — home-screen icons.
- `DESIGN_NOTES.md` — this file.

## Data model

`localStorage` key `checklist_data`:

```
state = { lists: [ {
  id, name, color,
  todos:     [ { id, text } ],
  completed: [ { id, text, at } ]
} ] }
```

- `completed` is a **flat list, newest first**. Completing a task moves it from
  `todos` to the front of `completed`; restoring moves it back.
- The old session/`batches` architecture was removed (v1.4.3). `loadState`
  migrates any old `batches[].events` (completed only) into the flat
  `completed` list.
- Fresh install → two lists: "JotList 1" (orange) + "JotList 2" (purple), each
  with sample tasks `Jot 1/2/3` (`DEFAULT_TODOS`).

## What's built

**Home**
- Multiple lists; square cards — 2-col on phone, 4-col on desktop.
- Press-and-hold a card to drag-reorder (touch + mouse); cards FLIP-slide aside.
- Each card has a ⋯ menu → Edit / Delete list.
- Settings gear pinned to the bottom of the window (panel is **empty** for now).
- Animated home backdrop: drifting gradient of the lists' colours.

**List view**
- Add a task (Enter or button) — fades in.
- Active task: **swipe right = complete, swipe left = delete** — coloured
  reveal behind the row, arms past ~30%, slide-off + a full-screen colour flash.
  Checkbox / × buttons do the same.
- Completing a task **slides it down into History**.
- Drag-reorder tasks — **desktop only** (HTML5 drag); mobile reorder NOT built.
- History = flat, **collapsible** list of completed tasks. Swipe right =
  restore, left = delete; tap the green check = restore, × = delete.

**App-wide**
- 5-colour palette per list; list view themes to its colour.
- Pull down from the top of a view → refresh (reload).
- Text selection / long-press callout disabled everywhere (inputs excepted).
- Branded confirm dialogs; sliding view transitions; swipe right on empty
  space (not on a task) = back to home.
- iOS home-screen icon + installable PWA; pinch-zoom disabled.
- Light list colours auto-switch UI text to dark.

## Brand palette

Orange `#F05726` · Purple `#7226F0` · Teal `#26F0C1` · Yellow `#E5B82B` · Brown `#9B604C`.

## Roadmap

- ← NEXT: **mobile task reorder** — press-and-hold drag for tasks (currently
  desktop HTML5-drag only; phone can't reorder tasks). The task row already has
  a touch handler for swipes, so this needs gesture arbitration (swipe vs
  hold-drag vs scroll vs tap) on the same element.
- Then: **task detail view** — a ⋯ / + on each task opens a panel for notes, a
  link, and a picture (image as base64 in localStorage).
- Settings panel: still empty — nothing decided to put in it.
- Later (deferred): cross-device sync.

## Resolved

- **iOS standalone background gap (FIXED v1.3.9, confirmed on-device).** In the
  installed app the bottom ~62px showed a wrong colour. Diagnosed with an
  on-screen readout: standalone PWA `innerHeight` = 894px but `screen.height` =
  956px, so the gradient stopped 62px short. A separate `position: fixed`
  layer didn't work (iOS clips fixed elements to the 894px layout viewport).
  Fix: the animated gradient lives on `<body>` (iOS fills it edge-to-edge) with
  `body` height pinned to `var(--app-h)` = `max(innerHeight, screen.height)`;
  `html` gets `overflow: hidden`. **Lesson: measure with real numbers, don't
  guess iOS quirks from screenshots.**
- **History could silently drop a completed task** — a stale session-batch id.
  Moot now (sessions removed).

## Caveats / accepted tradeoffs

- **No sync.** `localStorage` only — every browser/device is independent.
- Swipe-back gesture is touch-only.
- The app is JS-rendered — markdown/fetch tools can't verify it; test in a browser.
- iOS standalone caches hard — to see a new version, delete the home-screen
  icon and re-add it. Pull-to-refresh helps in Safari.
- App always opens to the home view on load.
- Renaming the app didn't rename anyone's *existing* lists — only fresh state.

## Workflow notes

- Owner (Michael) is a filmmaker, not a developer. Pushes via GitHub Desktop;
  pushing to `main` from the CLI needs his explicit OK each time.
- Communication preferences are mandatory — see `../../00-Communication.md`
  (auto-loaded). Very short, bullet lists, one task-step at a time, no jargon.
- **Dev loop:** `npx live-server` serves the folder with hot reload; test on a
  real phone via the Mac's LAN IP (e.g. `192.168.1.163:8080`) in Safari.
- The repo currently lives on a NAS volume — git rebase can choke on stale
  file-stat caching there (use merge, or `git status` to refresh first). Owner
  plans to move it to a local disk.
