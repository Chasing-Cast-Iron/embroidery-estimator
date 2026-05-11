# Chasing Cast Iron — Custom Embroidery Estimator

A React + Vite web app that lets customers get an instant embroidery price estimate for listed hat and cap items, then submit a quote request.

## Features

- **Instant Estimate Calculator** — quantity-tier embroidery pricing across 4 stitch-count tiers plus selected item base cost
- **Guided Request Flow** — lets customers choose estimate-first or quote-now in one workspace
- **Embroidery-Only Pricing Note** — clarifies that blank item/apparel costs are added separately
- **Netlify Quote Submission** — native form processing with artwork upload and email notifications
- **Hatch Font Selector** — searchable Hatch Embroidery 3 Digitizer font list for text-only embroidery requests
- **FAQ Accordion**, **How It Works** steps, sticky header with mobile nav
- Fully mobile-responsive with a burgundy/warm brand palette

## Getting Started

```bash
npm install
npm run dev
```

## Quote Submission Setup

This app is static and should be deployed through Netlify so Netlify Forms can receive quote requests, store submissions, handle artwork uploads, and send email notifications. No runtime environment variables are required.

The site contains a native Netlify form with these visible fields:

- Name
- Email
- Phone
- Deadline / needed by
- Item type
- Quantity
- Design type (logo/image or text-only)
- Text to embroider
- Notes
- Digitizing needed, or an "I'm not sure" option
- File upload, conditionally required when design type is logo/image

Estimator details and Hatch font preferences are submitted with the form when available:

```
source
itemType
itemTypeLabel
quantity
designComplexity
designComplexityLabel
digitizingNeeded
digitizingNeededLabel
estimateSummary
estimateDetails
hatchFontName
hatchFontCategory
hatchFontSizeRange
hatchFontJoinMethod
```

Netlify detects the form from the static blueprint in `index.html`, while the React form in the quote section provides the customer-facing UI.
When a visitor calculates an estimate first, the order fields are prefilled and the estimate summary/details are included automatically.

In Netlify, add a form notification for the `quote-request` form and send it to `chasingcastiron@gmail.com`.

## GoDaddy

For GoDaddy Websites + Marketing, either point a domain/subdomain to Netlify or link/embed the deployed Netlify estimator from a Quote page. Netlify handles the actual form submission and file upload.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm test` | Run unit tests (Vitest) |
| `npm run lint` | Run ESLint |

## Deployment

Deploy the app with Netlify:

- Connect this GitHub repository to Netlify.
- Netlify can read `netlify.toml`, which sets the build command to `npm run build` and the publish directory to `dist`.
- In Netlify, verify form detection is enabled.
- Add a form notification for `quote-request` to email `chasingcastiron@gmail.com`.

The GitHub Actions workflow now runs CI only: lint, tests, and production build.

## Project Structure

```
src/
  components/     # React UI components
  data/           # Pricing tables, item options, complexity options
  utils/          # calculateEstimate, formatCurrency, getQuantityTier, getStitchRange
    __tests__/    # Vitest unit tests
  styles/         # global.css
```
