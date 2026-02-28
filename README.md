# Costa Caleta Tenerife Booking

Website for a private holiday apartment in La Caleta (Adeje, Tenerife) with a public booking flow and an admin dashboard to manage bookings, pricing, and availability.

## Features
- Multilingual frontend (NL / EN / ES)
- SEO-ready localized routes (`/`, `/nl`, `/es`)
- Booking request flow with availability checks
- Admin dashboard for bookings, pricing, and blocked dates
- Supabase backend (auth + database)
- GA4/GTM-ready tracking hooks for SEA attribution and conversion events

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

`npm run build` includes a postbuild step that:
- creates static route HTML copies for GitHub Pages deep-link support
- generates `dist/sitemap.xml` with locale alternates
- generates `dist/sitemap.txt` fallback for Search Console compatibility
- generates `dist/robots.txt` with private route exclusions

## Environment Variables
Copy `.env.example` to `.env` and fill in:
```
VITE_SITE_URL="https://www.costacaleta.eu"
VITE_GTM_ID=""
VITE_GA4_MEASUREMENT_ID=""
VITE_SUPABASE_PROJECT_ID="your_project_ref"
VITE_SUPABASE_URL="https://your_project_ref.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your_anon_key"
```

## Deployment (GitHub Pages)
This repo uses GitHub Actions to build and deploy the `dist/` folder to GitHub Pages.
If your repo name changes, update `base` in `vite.config.ts`.

Set these GitHub Actions secrets for production SEO/SEA:
- `VITE_SITE_URL` (example: `https://www.costacaleta.eu`)
- `VITE_GTM_ID` (optional, recommended when using Google Tag Manager)
- `VITE_GA4_MEASUREMENT_ID` (optional fallback when GTM is not used)
- `VITE_SUPABASE_PROJECT_ID`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

## Google Ads (SEA) Assets
- `marketing/seo-keyword-map.md`: SEO keyword map per page and per language.
- `marketing/google-ads-keywords.csv`: EN/NL/ES keyword import pack (exact + phrase, grouped per campaign/ad group).
- `marketing/google-ads-negative-keywords.txt`: shared negative keywords starter list.
- `marketing/google-ads-setup-checklist.md`: click-by-click setup and QA checklist.
