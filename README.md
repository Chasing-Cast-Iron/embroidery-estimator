# Chasing Cast Iron — Custom Embroidery Estimator

A React + Vite web app that lets customers get an instant price estimate for custom embroidery orders (hats, shirts, jackets, and more) and submit a quote request.

## Features

- **Instant Estimate Calculator** — quantity-tier pricing across 4 stitch-count tiers
- **Quote Submission Form** — pre-fills from the estimate; supports design file upload
- **FAQ Accordion**, **How It Works** steps, sticky header with mobile nav
- Fully mobile-responsive with a burgundy/warm brand palette

## Getting Started

```bash
npm install
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_FORMSPREE_ENDPOINT` | Formspree form endpoint URL (e.g. `https://formspree.io/f/xxxx`). If not set, the submit button falls back to a `mailto:` link. |

Create a `.env.local` file in the project root:

```
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/your-form-id
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm test` | Run unit tests (Vitest) |
| `npm run lint` | Run ESLint |

## Deployment

The app deploys automatically to GitHub Pages on every push to `main` via `.github/workflows/deploy.yml`.

Add `VITE_FORMSPREE_ENDPOINT` as a repository secret in **Settings → Secrets and variables → Actions** to enable form submissions in production.

## Project Structure

```
src/
  components/     # React UI components
  data/           # Pricing tables, item options, complexity options
  utils/          # calculateEstimate, formatCurrency, getQuantityTier, getStitchRange
    __tests__/    # Vitest unit tests
  styles/         # global.css
```
