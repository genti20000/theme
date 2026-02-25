<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1jWfVzsD1j70JUOolhkhxzREhGCRajnhN

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Media Library env vars

Frontend:
- `VITE_MEDIA_BASE_PATH=/uploads`
- Optional: `VITE_MEDIA_BASE_URL=https://files.londonkaraoke.club`

Server (`db.php`):
- `LKC_MEDIA_BASE_PATH=uploads` (folder under `public_html`, default is `public_html/uploads`)
- Optional: `LKC_MEDIA_BASE_URL=https://files.londonkaraoke.club`
- `LKC_ADMIN_PASSWORD=<admin key>`
- `LKC_DB_HOST=<mysql host>`
- `LKC_DB_NAME=<mysql db>`
- `LKC_DB_USER=<mysql user>`
- `LKC_DB_PASS=<mysql pass>`

## Media repair / thumbnail rebuild

Admin UI:
- Open Media Library modal
- Click `Rebuild Thumbnails / Repair Media`

CLI (server-safe, idempotent):
- `LKC_SYNC_URL="https://files.londonkaraoke.club/db.php" LKC_ADMIN_PASSWORD="<admin key>" php scripts/repair_media.php`

Notes:
- Repair scans uploaded files, normalizes URLs, generates missing video thumbnails with `ffmpeg` (if available), and marks blob/invalid records as `broken`.
- The job is idempotent and can be rerun safely.

## Hostinger media setup

1. Upload endpoint writes files to `public_html/uploads` by default (`db.php` + `LKC_MEDIA_BASE_PATH=uploads`).
2. Media URLs are resolved as root-absolute paths such as `/uploads/1771478148_file.png` so they work from `/admin` and public routes.
3. Verify files exist in Hostinger hPanel:
   - `public_html/uploads/`
   - `public_html/uploads/thumbs/` (video thumbnails)
4. Run one-time cleanup to remove blob/broken placeholders:
   - `LKC_SYNC_URL=\"https://files.londonkaraoke.club/db.php\" LKC_ADMIN_PASSWORD=\"<admin key>\" php scripts/cleanup_media.php`
