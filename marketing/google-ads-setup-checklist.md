# Google Ads Setup Checklist (EN / NL / ES)

## 1) Create campaigns
1. Open Google Ads -> `Campaigns` -> `+ New campaign`.
2. Goal: `Leads`.
3. Campaign type: `Search`.
4. Create 3 campaigns:
   - `Search EN - Costa Caleta`
   - `Search NL - Costa Caleta`
   - `Search ES - Costa Caleta`

## 2) Add keywords
1. Open campaign -> `Keywords` -> `Search keywords` -> `+`.
2. Import from file: `marketing/google-ads-keywords.csv`.
3. Confirm each campaign uses its matching landing page:
   - EN: `https://www.costacaleta.eu/booking`
   - NL: `https://www.costacaleta.eu/nl/booking`
   - ES: `https://www.costacaleta.eu/es/booking`

## 3) Add negative keywords
1. Open campaign -> `Keywords` -> `Negative keywords`.
2. Paste all lines from `marketing/google-ads-negative-keywords.txt`.
3. Apply to each EN/NL/ES campaign.

## 4) Conversion tracking (must-do)
1. Google Ads -> `Goals` -> `Conversions` -> `+ New conversion action`.
2. Choose `Import` -> `Google Analytics 4 properties`.
3. Import and set as `Primary`:
   - `booking_request_submitted`
   - `generate_lead`
4. Keep `contact_click` as `Secondary` (reporting only).

## 5) Bidding and budget
1. Start with `Maximize Conversions`.
2. Keep a controlled daily budget per language campaign.
3. Turn off Search Partners for first 2 weeks (optional quality control).

## 6) Ad assets (minimum)
1. Add at least 12 headlines and 4 descriptions per language.
2. Add assets:
   - Sitelinks: `Booking`, `Contact`, `Gallery`
   - Callout: `Direct booking`, `No platform fees`, `Fast WhatsApp reply`
   - Structured snippet: `Amenities`

## 7) QA before launch
1. Open each ad and verify final URL matches language.
2. Click test each URL to ensure no 404.
3. In GA4 Realtime, confirm events arrive after test visit:
   - `page_view`
   - `booking_step_viewed`
   - `booking_request_submitted` (test form)

## 8) Weekly optimization
1. Review `Search terms` report.
2. Add irrelevant terms to negatives.
3. Pause keywords with high spend and no conversions.
4. Increase budget only on ad groups with conversions.
