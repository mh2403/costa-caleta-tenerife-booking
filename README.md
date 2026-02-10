# Costa Caleta Tenerife Booking

Website for a private holiday apartment in La Caleta (Adeje, Tenerife) with a public booking flow and an admin dashboard to manage bookings, pricing, and availability.

## Features
- Multilingual frontend (NL / EN / ES)
- Booking request flow with availability checks
- Admin dashboard for bookings, pricing, and blocked dates
- Supabase backend (auth + database)

## Tech Stack
- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase

## Local Development
```bash
npm install
npm run dev
```
App runs on `http://localhost:8080`.

## Build
```bash
npm run build
npm run preview
```

## Environment Variables
Create a `.env` file with:
```
VITE_SUPABASE_PROJECT_ID="your_project_ref"
VITE_SUPABASE_URL="https://your_project_ref.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your_anon_key"
```

## Deployment (GitHub Pages)
This repo uses GitHub Actions to build and deploy the `dist/` folder to GitHub Pages.
If your repo name changes, update `base` in `vite.config.ts`.

