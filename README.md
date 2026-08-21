# Hargun Panauti Tracker

A responsive, single-page tracker with a dramatic red/black visual system and persistent browser storage.

## Deploy immediately

No build step is required.

1. Upload `index.html`, `styles.css`, and `app.js` to any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages, or a web server).
2. Open the deployed page.
3. Events are saved to `localStorage` under `hargun-panauti-tracker-v1`, so refreshes preserve the counter and history on the same browser/device.

## Included

- Slider-to-record interaction
- Severity, category, date/time and notes per event
- Persistent event history
- Delete individual events
- Clear/reset all events
- Responsive desktop/mobile layout
- Accessible labels and dialog
- No backend, database, or build tooling required

## Important persistence note

This implementation is intentionally client-side. `localStorage` is per browser/device and can be cleared by the user. For multi-user/server-side persistence, replace the `load()`/`save()` functions in `app.js` with API calls to your database-backed service.
