# Gostilna demo sites

Two demo restaurant websites set in the Soča valley. Both restaurants, their menus, awards and contact details are made up.

| File | What it is |
| --- | --- |
| `index.html` | **Restavracija Soča**: a working copy of the reference UI (Tailwind, Plus Jakarta Sans + Inter, Material Symbols). |
| `pri-brvi.html` | **Gostilna Pri Brvi**: the first version, a single self-contained page with a canvas-drawn landscape, SL/EN switch and live opening status. |

## Restavracija Soča (`index.html`)

The markup and design follow the reference UI. Changes from the original:

- Tailwind is compiled into `styles.css` instead of loaded from the play CDN (`cdn.tailwindcss.com`), which isn't meant for production.
- The navigation links scroll to their sections, and the "Izberite ta meni" buttons add the chosen menu to the reservation notes.
- The reservation date defaults to the next open day (Wednesday–Sunday), at least 3 days ahead.
- The confirmation banner and the newsletter field say plainly that this is a demo and nothing was sent.
- Phone and email are placeholders, and the footer notes that the restaurant, awards and contacts are fictional.
- If a photo can't load, a stand-in appears instead of a broken image: a drawn river landscape in the hero, and a teal panel with an icon elsewhere.
- Small mobile fixes: smaller headline sizes on phones (using the UI's own `*-mobile` type tokens) and wrapping so nothing overflows sideways.

The photos and logo from the reference UI are stored in `img/` at full resolution, so the site no longer depends on the original `lh3.googleusercontent.com` links.

### Editing styles

After changing Tailwind classes in `index.html`, rebuild the CSS:

```sh
npm install
npm run build:css
```

The colour palette and type scale live in `tailwind.config.js`.

## Running

No server needed: open `index.html` or `pri-brvi.html` in a browser, or serve the folder with `npx serve .`. To publish, enable GitHub Pages for this repository (Settings → Pages → deploy from branch, root folder).
