# Cloudflare Pages release setup

This repository contains a static professional portfolio. Git integration is preferred to avoid Cloudflare API tokens in source code or ChatGPT.

## Connect once in the Cloudflare dashboard

1. Open https://dash.cloudflare.com/ and select **Workers & Pages**.
2. Choose **Create application → Pages → Connect to Git** (the wording may vary).
3. Connect GitHub and authorize access to **Divin-kumar/divinkumar-pv-portfolio**.
4. Use a Pages project name such as **divinkumar-pv-portfolio** (Cloudflare will confirm availability).
5. Set **Production branch** to **resume-led-redesign-2026-11-05**. Do not select `main` while the redesign remains under review.
6. Use **no framework preset**. Configure:
   - **Root directory:** repository root (leave blank/default)
   - **Build command:** `sh cloudflare-pages-build.sh`
   - **Build output directory:** `dist`
   - **Environment variables:** none required
7. Save and deploy. Wait for a successful Pages deployment and use the exact `*.pages.dev` address Cloudflare displays.

## What the build publishes

`cloudflare-pages-build.sh` copies only the active, public-facing static assets into `dist`:

- `index.html` (includes the existing portrait as a data URI)
- `portfolio-next.css`, `portfolio-polish.css`
- `portfolio-next.js`, `portfolio-polish.js`
- `_headers` with basic browser-security headers

The build excludes old, unused JavaScript/CSS and internal development documentation. It does not pull patient records, ticket exports, internal URLs, or any private data.

## Verify the release

- Open the exact Cloudflare Pages URL in a desktop browser.
- Check the portrait, hero, work search, category filters, work details, expertise explorer, keyboard navigation, themes, reduced motion, LinkedIn/contact links, and browser printing.
- Verify no Power BI text appears.
- If a required check fails, do not promote the redesign to the original GitHub `main` or change the older Vercel URL.
- Cloudflare's production branch can be changed later in the Pages project's **Settings → Builds → Branch control**.

## Release boundaries

The Cloudflare setup is separate from the previous Vercel deployment. Do not expose Cloudflare API tokens or account secrets in repository files. Connecting GitHub requires explicit authorization by the Cloudflare account holder, and the public Pages domain is not known until the first deployment succeeds.
