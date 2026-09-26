# Gostilna Pri Brvi

Demo website for a fictional gostilna in the Soča valley. The gostilna, its menus and contact details are made up.

`index.html` is the whole site. It's built on the reference "Restavracija Soča" UI (Tailwind, Plus Jakarta Sans + Inter, Material Symbols icons).

## What changed from the reference UI

- The name is Gostilna Pri Brvi, and the river flow widget in the hero is removed.
- All text is rewritten for a family gostilna: no awards, chef or tasting menus; two 4-course gostilna menus; corrected facts (Tolminc is a cow's milk cheese, Rebula, no Karst or Triglav in Kobarid); Slovenian sentence case; Slovenian alt text.
- Tailwind is compiled into `styles.css` instead of loaded from the play CDN (`cdn.tailwindcss.com`), which isn't meant for production.
- Icons are inline SVG (Material Symbols Outlined), and Inter and Plus Jakarta Sans are self-hosted in `fonts/`. The page makes no requests to Google, which keeps it working where Google Fonts are blocked and avoids the GDPR issue of loading fonts from Google.
- The photos and logo are stored in `img/` at full resolution.
- The navigation links scroll to their sections, and the "Izberite ta meni" buttons add the chosen menu to the reservation notes.
- The reservation date defaults to the next open day (Wednesday–Sunday), at least 3 days ahead.
- The reservation and newsletter forms submit to Netlify Forms (see below).
- If a photo can't load, a stand-in appears instead of a broken image: a drawn river landscape in the hero, and a teal panel elsewhere.
- Small mobile fixes: smaller headline sizes on phones (using the UI's own `*-mobile` type tokens) and wrapping so nothing overflows sideways.

## Languages

The page is in Slovenian, with English and Italian available from the SL / EN / IT switch in the header. The choice is remembered in the browser.

The Slovenian text lives in the HTML. The English and Italian versions are in the `T` dictionary in the script at the bottom of `index.html`, keyed by the exact Slovenian text. When you change a Slovenian sentence, change its key in `T` as well, or that sentence stays in Slovenian in the other languages. Messages the script writes (form results) are in `M`.

## Favicon

`favicon.svg` (modern browsers), `favicon-32.png` (fallback) and `apple-touch-icon.png` (iOS home screen) use the logo mark: mountains, the footbridge and the river.

## Editing styles

After changing Tailwind classes in `index.html`, rebuild the CSS:

```sh
npm install
npm run build:css
```

The colour palette and type scale live in `tailwind.config.js`, and the font faces in `src/fonts.css`. Netlify rebuilds the CSS on every deploy anyway.

## Deploying to Netlify

`netlify.toml` already holds the settings: Netlify runs `npm run build:css` and publishes the repository root.

1. In Netlify choose **Add new site → Import an existing project → GitHub**, pick `sixis45/gostilna` and the `main` branch, and deploy.
2. Under **Forms**, click **Enable form detection**, then trigger a new deploy (Deploys → Trigger deploy). Netlify finds the forms while it deploys.
3. For emails, go to **Site configuration → Notifications → Emails and webhooks → Form submission notifications**, add an email notification, and pick the `reservation` form (and `newsletter`, if you want those too).

### Forms

| Form | Fields |
| --- | --- |
| `reservation` | `guests`, `date`, `time`, `seating` (`terasa` / `kamin` / `vseeno`), `name`, `phone`, `notes`, `language` (`sl` / `en` / `it`, the language the guest used) |
| `newsletter` | `email` |

Both forms send in the background (AJAX), so the guest stays on the page and sees the result in their language. Submissions appear under **Forms** in Netlify. Spam is filtered by Netlify's built-in filter plus a hidden `bot-field` honeypot.

Outside Netlify (opened as a local file, for example) sending fails, and the page shows a message asking the guest to call.

## Running locally

No server needed: open `index.html` in a browser, or serve the folder with `npx serve .`. The forms only send on Netlify.
