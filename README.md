# RapidAid 

A React-based frontend for the Rapid Aid Matcher disaster relief application. This application allows users to submit aid requests and responders to view and coordinate relief efforts.

## Features

- **Submit Aid Requests**: Users can submit requests with their location and aid needs
- **Responder Dashboard**: View categorized aid requests with filtering, sorting, and status management
# RapidAid

RapidAid is a Vite + React frontend for coordinating non-emergency aid requests. Users can submit requests with location and details, and responders can view and manage requests via the dashboard.

This README was updated to reflect the current state of the repository (September 2025): maps were removed, i18n (English/Spanish) was added, and dependency conflicts with mapping libraries were resolved by removing them.

## Highlights

- Submit and categorize aid requests (AI categorization via Gemini)
- Responder dashboard with filtering, sorting and status management
- Multi-language UI (English and Spanish) via `react-i18next`
- No map integration in the current branch (map components were removed)

## Tech stack

- React 19
- React Router v7
- Vite (dev server + build)
- i18next / react-i18next for translations
- Plain CSS for component styling
- Node / npm

## Quick start

1. Clone the repo:

```powershell
git clone <repository-url>
cd Shellhacks_2025
```

2. Install dependencies:

```powershell
npm install
```

If you see peer dependency errors related to optional mapping libraries in an earlier branch, they were removed in this branch — run npm install again after pulling latest changes.

3. Set up your Gemini API key (optional, used for AI categorization):

Create a `.env` file in the project root with:

```text
VITE_GEMINI_API_KEY=your_api_key_here
```

4. Start dev server:

```powershell
npm run dev
```

Open the URL printed by Vite (usually http://localhost:5173 or similar).

## Scripts

- `npm run dev` — start Vite dev server
- `npm run build` — build for production
- `npm run preview` — preview production build
- `npm run lint` — run ESLint

## Localization

The app uses `react-i18next` with translation files in `src/locales`.
- Default languages included: English (`en.json`) and Spanish (`es.json`).

To add strings or languages, update `src/locales/*.json` and the i18n initialization in `src/i18n.js`.

## Gemini AI

The app integrates with Gemini for automatic request categorization. Gemini is used in `src/services/geminiService.js`.

Environment variable required (if you want categorization):

 - `VITE_GEMINI_API_KEY` — Gemini API key

If you don't set an API key the UI will still work; AI categorization calls will fail gracefully and the project stores requests locally.

## Notes about maps

- Mapping components (Leaflet / react-leaflet / GoogleMapPanel) were removed from this branch to avoid dependency conflicts and to simplify the UI.
- If you want map functionality back, we recommend adding a standalone feature branch and installing mapping dependencies compatible with React 19 (or using a vanilla JS integration that avoids react-leaflet's peer deps).

## Project structure (short)

```
src/
├─ components/      # Header, RequestForm, RequestList, RequestCard, badges
├─ pages/           # SubmitRequestPage, DashboardPage
├─ services/        # geminiService, databaseService
├─ locales/         # i18n JSON files
├─ App.jsx
└─ main.jsx
```

## Troubleshooting

- npm install errors: ensure you're on a recent Node version and that you pulled the latest branch where mapping deps were removed. If errors persist paste the install output here and I can help.
- Dev server errors: open the terminal where `npm run dev` runs — Vite will print file and line numbers for compile errors.

## Follow-ups I can do for you

- Run the dev server here and report build errors/warnings
- Remove the placeholder `UserMap.jsx` file completely (currently it exports null to keep imports safe)
- Add additional translations or a new language
- Reintroduce maps in a separate branch with a mapping approach compatible with React 19

## Contributors

- Alec Gomez — Frontend / DevOps
