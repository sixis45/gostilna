# Gostilna Pri Brvi

Demo website for a fictional gostilna in the Soča valley. The gostilna, its menus and contact details are made up.

The site is built on the reference "Restavracija Soča" UI: Tailwind, Plus Jakarta Sans + Inter, and Material Symbols icons drawn as inline SVG.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | The Slovenian page, and the source for the other languages |
| `src/translations.json` | English and Italian text, keyed by the exact Slovenian text |
| `scripts/build-pages.mjs` | Builds `en/index.html` and `it/index.html` from the two files above |
| `zasebnost.html`, `dostopnost.html` | Privacy policy and accessibility statement (SL / EN / IT on one page) |
| `404.html` | "Page not found" page |
| `netlify/functions/submission-created.js` | Optional confirmation email to guests (see below) |
| `img/`, `fonts/`, `favicon*` | WebP photos, share image, self-hosted fonts, icons |
| `robots.txt`, `sitemap.xml` | For search engines |

## Building

```sh
npm install
npm run build        # CSS + English and Italian pages
```

`npm run build:css` only rebuilds `styles.css` (after changing Tailwind classes). `npm run build:pages` only rebuilds `en/` and `it/`, which are generated and not committed. Netlify runs `npm run build` on every deploy.

## Languages

Slovenian is at `/`, English at `/en/` and Italian at `/it/`. Each is a real page with its own `lang`, canonical URL and `hreflang` links, so search engines index all three. The SL / EN / IT switch links between them.

To change text, edit the Slovenian in `index.html` and update the matching key in `src/translations.json`. The build warns when a translation no longer matches any text on the page. Messages written by the page script (form results, validation) are in the `M` object at the bottom of `index.html`.

## What's on the page

- **Menus** with allergen codes (EU numbering) and a legend.
- **Reservation form:** it refuses Mondays and Tuesdays, past dates and times that have already passed today. The email field is optional.
- **Navigation:** a menu button below 1280 px wide, and a "skip to content" link.
- **Contact:** the map, "Navodila za pot", phone and email all open the right app.
- **Social sharing and search:** a description, a share image for WhatsApp/Facebook (`img/og.jpg`), and schema.org `Restaurant` data (hours, address, menus, prices).
- **Speed:** WebP photos with smaller versions for phones, lazy loading, fixed image sizes, and preloaded hero image and fonts.
- **Security:** headers set in `netlify.toml`: CSP, nosniff, frame and referrer policy, and long caching for fonts.
- **Offline-proof assets:** the page makes no requests to Google or any other third party.

## Before going live with a real gostilna

1. Replace the placeholders: name, address (also in the Google Maps links and the schema.org data), phone, email and photos. In `zasebnost.html`, fill in the company details (in square brackets) and have a lawyer check the text.
2. Connect a custom domain in Netlify. The build uses Netlify's `URL` automatically for canonical links, the sitemap and the share image.
3. Set the environment variable `SITE_INDEXABLE=true` in Netlify. Until then every page carries `noindex`, so the demo with its made-up details stays out of Google.

## Netlify setup

`netlify.toml` holds the build settings, headers and functions folder.

1. **Forms:** under **Forms**, enable form detection and redeploy. Under **Site configuration → Notifications → Emails and webhooks → Form submission notifications**, add an email for the `reservation` form.
2. **Guest confirmation email (optional):**
   - Create a free [Resend](https://resend.com) account and verify your domain there.
   - In Netlify, set `RESEND_API_KEY` and `CONFIRMATION_FROM` (for example `Gostilna Pri Brvi <rezervacije@your-domain.si>`), and optionally `CONFIRMATION_REPLY_TO`.
   - Guests who leave an email then get a short "we've received your request" message in their language. Without these variables the function does nothing.
3. **Newsletter:** Netlify Forms only collects the addresses. To send newsletters, export them (Forms → newsletter → Export) into a tool like Brevo or Mailchimp.

### Forms

| Form | Fields |
| --- | --- |
| `reservation` | `guests`, `date`, `time`, `seating` (`terasa` / `kamin` / `vseeno`), `name`, `phone`, `email`, `notes`, `language` (`sl` / `en` / `it`) |
| `newsletter` | `email` |

Both forms send in the background, and the guest sees the result in their language. Spam is filtered by Netlify plus a hidden `bot-field` honeypot. Outside Netlify, sending fails and the page asks the guest to call.

## Running locally

Run `npm run build`, then serve the folder with `npx serve .` and open `http://localhost:3000`, `/en/` or `/it/`. The forms only send on Netlify.
