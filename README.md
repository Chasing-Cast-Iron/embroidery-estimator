# Chasing Cast Iron — Custom Embroidery Estimator

A React + Vite web app that lets customers get an instant price estimate for custom embroidery orders (hats, shirts, jackets, and more) and submit a quote request.

## Features

- **Instant Estimate Calculator** — quantity-tier pricing across 4 stitch-count tiers
- **Quote Submission Form** — pre-fills from the estimate; supports optional design upload with email/Tally fallback copy
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
| `VITE_TALLY_UPLOAD_URL` | Optional Tally upload form URL shown near the artwork upload field when configured. Useful if you want native file uploads without depending on Formspree file support. |

Create a `.env.local` file in the project root:

```
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/your-form-id
VITE_TALLY_UPLOAD_URL=https://tally.so/r/your-form-id
```

## Form Submission & File Upload Options

### Formspree (current default)

The quote form submits to a Formspree endpoint when `VITE_FORMSPREE_ENDPOINT` is set.

> **⚠️ Important:** Native file uploads via Formspree require a **paid plan**. On the free tier, text fields are delivered fine but attached files will be dropped silently.
>
> Because of this, **file upload is not required** in the form. If a customer cannot upload their artwork, a clear note in the form tells them to submit without a file and we will reply with instructions for sending it separately.
>
> The form still accepts text-only submissions when `VITE_FORMSPREE_ENDPOINT` is configured. Artwork can be emailed separately after the quote request if upload support is not available.

### Tally (recommended free/low-cost upload option)

[Tally](https://tally.so) is the recommended option if you want free file upload support. Tally's free plan supports file uploads natively.

**To add Tally upload support later:**

1. Create a Tally form that includes a file upload field and any fields you want (name, email, order details, etc.).
2. Add the Tally form URL as `VITE_TALLY_UPLOAD_URL` to show it as an optional artwork upload link beside the custom quote form upload field.
3. Tally forms can email responses (including file links) to any address — set that to your business email.

The current form fallback message already guides customers to submit without artwork first. If the Tally URL is configured, customers also see a direct artwork upload link.

### Future backend option (Cloudflare Pages + Resend + R2)

For a fully custom solution later:

```
Cloudflare Pages Functions  — serverless form handler
Resend                      — transactional email
Cloudflare R2               — file storage
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

Add `VITE_TALLY_UPLOAD_URL` as a repository variable in **Settings → Secrets and variables → Actions → Variables** if you want to show a Tally artwork upload link.

## Project Structure

```
src/
  components/     # React UI components
  data/           # Pricing tables, item options, complexity options
  utils/          # calculateEstimate, formatCurrency, getQuantityTier, getStitchRange
    __tests__/    # Vitest unit tests
  styles/         # global.css
```
