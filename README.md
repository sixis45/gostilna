# Gostilna Pri Brvi

Demo website for a fictional gostilna in Čezsoča near Bovec, in the Soča valley.
The restaurant, menu, prices and contact details are made up.

## What's on the page

- **Hero**: a landscape of the Julian Alps, the Soča with its gravel banks, a suspension footbridge and the house, drawn on a `<canvas>`. It adapts to light and dark mode, and the river sparkle animation stops when the visitor prefers reduced motion.
- **Open / closed status**, computed from the opening hours in Europe/Ljubljana time, including the shorter winter schedule.
- **Menu** with prices, allergen codes (EU numbering) and vegetarian marks.
- **"From source to plate"**: where the ingredients come from, in order down the river from Trenta to Goriška Brda.
- **Visit info**: hours (today's row is highlighted), address, distances and practical notes.
- **Reservation form**: validates closed days, the kitchen's last booking time and past dates. It's a demo, so nothing is sent.
- **Language switch** between Slovenian and English. The choice is remembered in the browser.

## Running it

It's one self-contained file with no build step. Open `index.html` in a browser, or serve the folder:

```sh
npx serve .
```

To publish it, enable GitHub Pages for this repository (Settings → Pages → deploy from branch, root folder).

## Customising

- **Name, address, phone**: search `index.html` for `Pri Brvi`, `Čezsoča 14` and `+386 5 000 00 00`.
- **Menu**: each dish is an `<li class="dish">`. Slovenian and English text sit side by side in `<span lang="sl">` / `<span lang="en">`.
- **Opening hours**: update the `OPEN` table in the script and the hours table in the "Obisk" section.
- **Colours and fonts**: CSS custom properties at the top of the `<style>` block, with a separate dark palette.
- **Real reservations**: replace the demo submit handler with a call to a form service or your own backend.
