# Gostilna Pri Brvi

Demo website for a fictional gostilna in the Soča valley. The gostilna, its menus and contact details are made up.

| File | What it is |
| --- | --- |
| `index.html` | **Gostilna Pri Brvi**: the demo site, built on the reference "Restavracija Soča" UI (Tailwind, Plus Jakarta Sans + Inter, Material Symbols). |
| `pri-brvi.html` | An earlier draft with a different design: a single self-contained page with a canvas-drawn landscape, SL/EN switch and live opening status. |

## Gostilna Pri Brvi (`index.html`)

The markup and design follow the reference "Restavracija Soča" UI. Changes from the original:

- The name is Gostilna Pri Brvi, and the river flow widget in the hero is removed.
- All text is rewritten for a family gostilna: no awards, chef or tasting menus; two 4-course gostilna menus; corrected facts (Tolminc is a cow's milk cheese, Rebula, no Karst or Triglav in Kobarid); Slovenian sentence case; Slovenian alt text.
- Tailwind is compiled into `styles.css` instead of loaded from the play CDN (`cdn.tailwindcss.com`), which isn't meant for production.
- The navigation links scroll to their sections, and the "Izberite ta meni" buttons add the chosen menu to the reservation notes.
- The reservation date defaults to the next open day (Wednesday–Sunday), at least 3 days ahead.
- The confirmation banner and the newsletter field say plainly that this is a demo and nothing was sent.
- Phone and email are placeholders, and the footer notes that the gostilna, menu and contacts are fictional.
- If a photo can't load, a stand-in appears instead of a broken image: a drawn river landscape in the hero, and a teal panel with an icon elsewhere.
- Small mobile fixes: smaller headline sizes on phones (using the UI's own `*-mobile` type tokens) and wrapping so nothing overflows sideways.

The photos and logo from the reference UI are stored in `img/` at full resolution, so the site no longer depends on the original `lh3.googleusercontent.com` links.

### Languages

The page is in Slovenian, with English and Italian available from the SL / EN / IT switch in the header. The choice is remembered in the browser.

The Slovenian text lives in the HTML. The English and Italian versions are in the `T` dictionary in the script at the bottom of `index.html`, keyed by the exact Slovenian text. When you change a Slovenian sentence, change its key in `T` as well, or that sentence stays in Slovenian in the other languages.

### Favicon

`favicon.svg` (modern browsers), `favicon-32.png` (fallback) and `apple-touch-icon.png` (iOS home screen) use the logo mark: mountains, the footbridge and the river.

### Editing styles

After changing Tailwind classes in `index.html`, rebuild the CSS:

```sh
npm install
npm run build:css
```

The colour palette and type scale live in `tailwind.config.js`.

## Deploying to Netlify

`netlify.toml` already holds the settings: Netlify runs `npm run build:css` and publishes the repository root. In Netlify choose **Add new site → Import an existing project → GitHub**, pick `sixis45/gostilna` and the `main` branch, and deploy. No other settings are needed.

## Running

No server needed: open `index.html` or `pri-brvi.html` in a browser, or serve the folder with `npx serve .`. To publish, enable GitHub Pages for this repository (Settings → Pages → deploy from branch, root folder).
