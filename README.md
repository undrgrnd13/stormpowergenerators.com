# stormpowergenerators.com

Static site for [Stormpower Generators](https://www.stormpowergenerators.com) — standby generator installation, maintenance, and repair in Broward, Palm Beach, Martin, and St. Lucie counties.

## Pages

- `index.html` — home
- `maintenance.html` — maintenance agreements
- `installation-start-up.html` — install & start-up
- `service-repairs.html` — service & repairs
- `financing.html` — Synchrony financing
- `contact.html` — contact / request service
- `generator-maintenance-*.html` — city landing pages (maintenance)
- `sitemap.xml` / `robots.txt` — SEO crawl files

## Deploy

Host these files as a static site (current production origin). Prefer editing via PRs in this repo so Engineer can ship SEO and content changes without re-uploads.

## Stylesheet cache-busting

Every page links the compiled CSS with a version query, e.g. `css/styles.css?v=827550c`. The host's CDN caches `css/styles.css` for 30 days, with separate copies per browser `Accept-Encoding`, so a new build can stay stale for some visitors unless the URL changes.

**Whenever you rebuild `css/styles.css`**, bump the version on all pages in the same PR (use the new short commit hash or a date stamp):

```sh
./tailwindcss -c tailwind.config.js -i css/tailwind.input.css -o css/styles.css --minify
sed -i -E 's#css/styles\.css\?v=[A-Za-z0-9._-]+#css/styles.css?v=NEWVERSION#g' *.html
grep -L 'css/styles.css?v=NEWVERSION' *.html   # should print nothing
```
