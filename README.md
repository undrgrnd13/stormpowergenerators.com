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

## Analytics (GoatCounter)

Every page has an inactive GoatCounter snippet just before `</head>`, inside an HTML comment, so it loads nothing until it is switched on. To switch it on, replace `YOURCODE` with the GoatCounter site code (the `YOURCODE` in `YOURCODE.goatcounter.com`) and run this from the repo root:

```sh
sed -i -e 's/GOATCOUNTER_CODE/YOURCODE/' -e 's/<!--GC //' -e 's/ GC-->//' *.html
```

Check with `grep -c 'YOURCODE.goatcounter.com' *.html` (each page should print 1), then commit. The `?v=` stylesheet version does not need to change for this.
