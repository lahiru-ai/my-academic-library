# My Academic Library

A personal cloud-based academic library for organizing university resources. Built with React, Tailwind CSS, and Google APIs.

## Setup

1. **Google Cloud Project**
   - Create a project at [console.cloud.google.com](https://console.cloud.google.com)
   - Enable **Drive API** and **Sheets API**
   - Configure OAuth consent screen (External, add your email as test user)
   - Create OAuth 2.0 credentials (Web application)
   - Add authorized redirect URI: `http://localhost:5173` and your GitHub Pages URL

2. **Google Sheet** (optional)
   - Create a Google Sheet and copy its ID from the URL
   - The app will auto-create the required sheet tab if it doesn't exist

3. **Environment**
   ```bash
   cp .env.example .env
   ```
   Fill in `VITE_GOOGLE_CLIENT_ID` and `VITE_GOOGLE_SHEET_ID`

4. **Run**
   ```bash
   npm install
   npm run dev
   ```

## Deploy to GitHub Pages

```bash
npm run deploy
```

Or push to `main` — the GitHub Actions workflow handles deployment automatically.

## Tech Stack

React 19, TypeScript, Tailwind CSS v4, React Router v7, Google Drive API, Google Sheets API
