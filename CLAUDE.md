# JotList — project notes for Claude

Public repo. Keep this file free of personal details, emails, IDs, keys,
and anything secret. Full history lives in the private notes repo
(`twoseam/claude-notes`, `projects/Checklist/`).

## What it is
- Single-file vanilla-JS checklist PWA. Name and wordmark: **JotList** (singular).
- Live: https://jotlist.io (GitHub Pages, this repo, ~1–2 min build).
- Backend: Supabase (auth + lists tables + realtime). Apple sign-in.
- Email invites go through a Google Apps Script relay (`kind:'invite'`).

## Dev
- `npx live-server` from the repo root → `localhost:8080`.
- Sign-in and service workers need `localhost` or https. Not a LAN IP.
- Headless Chrome tests need their own `--user-data-dir`. Never kill all Chrome.
- Schema changes: Michael pastes SQL into the Supabase SQL editor.

## Watch for
- **Apple sign-in secret expires on a fixed date** (see private notes).
  Must be regenerated before then or Apple sign-in breaks.
- **Supabase free tier auto-pauses** after ~2 weeks idle. Site looks "gone".
  A scheduled keep-alive ping exists. If it pauses anyway, Michael restores
  it from the Supabase dashboard; data is intact.

## Supabase gotchas (already hit — don't re-debug)
- After `ALTER TABLE`, run `NOTIFY pgrst, 'reload schema';` or the client 400s.
- `.upsert()` needs `onConflict` when the key isn't `id`.
- RLS policies that query their own table recurse. Use SECURITY DEFINER
  helpers (`is_list_member`, `is_list_owner`).
- `auth.users` isn't client-readable. Use `list_member_emails()`.

## Code gotchas
- `showConfirm({message})` sets `textContent`. Plain text only, no HTML.
- `sw.js` must NOT intercept fetches. Empty listener, installability only.
- Check-off race: `refreshFromCloud` bails while `pendingPush` or `pushing`.
- Testing invites: Gmail files self-sent mail under Sent. Test with an
  outside address.

## Style rules (Michael's)
- Copy: tight, no em dashes, no orphan words (bind last two with `&nbsp;`).
- Minimal motion. He cuts flourishes.
- White wordmark on gradient, red wordmark on white.
- Soft-fill chips: lift HSL lightness. Never overlay same hue at low opacity.
- He judges feel on-device. Ship the native-feeling cut, expect 1–2 rounds.
- Apply instructions literally. Don't invent exceptions; ask.
- Task lists: run through them, commit + push each.
- Commit and push before ending any session.
