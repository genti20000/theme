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

## Backend API (Node + PostgreSQL)

This project includes a Node.js API server for admin authentication, content storage, and uploads.

### Environment variables

Create a `.env` file for the API server:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=change-me
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me
CORS_ORIGIN=http://localhost:5173
PORT=3001
```

If `DATABASE_URL` is not set, the API will run in memory using the default
credentials `admin / 12345` (or the values provided by `ADMIN_EMAIL` and
`ADMIN_PASSWORD`).

### Start the API server

```
npm run server
```

The React app can call the API via `VITE_API_BASE_URL` (e.g. `http://localhost:3001`).
