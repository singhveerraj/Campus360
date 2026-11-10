# Campus360 — TIET

A frontend-first campus companion prototype for Thapar Institute of Engineering and Technology.

## Run locally

1. Install Node.js LTS.
2. Open this folder in VS Code.
3. Open a terminal in `frontend` and run:

   ```bash
   npm install
   npm run dev
   ```

4. Open the local URL shown by Vite (usually http://localhost:5173).

No backend is required for this redesigned demo. Notices, event registrations, and helpdesk requests use in-browser React state and reset when the page is refreshed. The campus map image is included in `frontend/public/campus-map.png`; marker positions are illustrative and should be verified.

## Features
- Responsive campus-life homepage with interactive navigation and visual cards
- Interactive campus map with selectable pins, search and category filters
- Noticeboard with category filters, like buttons, and optional Admin preview for adding notices
- Events and clubs with category filters and interactive registration
- Helpdesk form with local request tracker

All notices, events, timetable entries and sample content are demonstration data, not verified official TIET announcements.
