# AGENTS.md

MOUJA SURF SCHOOL — Astro 5 static site (surf school & camp in Taghazout, Morocco).
Official domain: `https://moujasurfschool.com`. Visible brand: **MOUJA TAGHAZOUT**.
Keep existing wording/style — do not rewrite prose or redesign unless explicitly asked.

## Commands

- `npm run check` — QA gate. Expected: **0 errors / 0 warnings / 0 hints**.
- `npm run build` — static build. Expected: **`24 page(s) built`** + sitemap.
- There is **no test or lint runner**. Verify with `npm run check` then `npm run build`.

## Server / preview workflow

- The static preview server (`serve.py`, serves `dist/`) is **started manually by the user** on `http://localhost:8231`. Use it for visual/QA checks.
- **Do not launch** `npm run dev`, `astro dev`, or a second `serve.py` while :8231 is running; never start a second server or change the port.
- Only after `npm run build`, QA against :8231; never restart the server yourself.
- Build format is `file` (`dist/about.html`); `serve.py` maps `/about` → `about.html`. `astro preview` is not the documented flow.

## Repo state

- **Not a git repository** — no `.git/`. Do **not** run `git init`, `git add`, `git commit`, or `git push`.
- A `.gitignore` exists (prepared for a future repo): excludes `node_modules/`, `dist/`, `.astro/`, `archive-original/`, `*.log`, `.env*`, IDE/OS files. Source (`src/`, `public/`, configs, docs) stays tracked.
- `archive-original/` is a legacy snapshot, excluded from build/tsconfig and from the repo. **Never edit it.**
- Do not create stray debug pages in `src/pages/` (a leading `_` makes Astro skip the page; still delete them after use).

## Data / architecture

- Single source of truth: `src/data/content.json` (rooms, packages, activities, restaurant, shop, hero, nav, megamenu), typed by `src/data/loaders.ts`.
- `src/data/loaders.ts` also exports `SITE` (business identity: `businessName: 'MOUJA SURF SCHOOL'`, visible `name: 'MOUJA TAGHAZOUT'`, `url`, NAP, `geo`, `areaServed`, `priceRange`, `currenciesAccepted`, `sameAs`). **Consume `SITE`; never hardcode NAP elsewhere.**
- Images are referenced by string `imageId` only — **never hardcode an image URL**. Resolve via `image(id)` from `loaders.ts`; unknown ids fall back to `hero_coaching`.
- Pages are `.astro` in `src/pages/` (static routes + `/packages/[slug]`, `/blog/[slug]`). Blog posts are markdown in `src/content/blog/` (schema in `src/content.config.ts`).

## Routes

- Static: `/`, `/about`, `/activities`, `/accommodation`, `/blog`, `/booking`, `/company`, `/cookies`, `/faq`, `/packages`, `/restaurant`, `/surf-camp`, `/surf-shop`, `/surf-yoga`, `/terms`, `/404`.
- Packages: `/packages/starter-surfer`, `/packages/wave-warrior`, `/packages/nomad-zen`, `/packages/digital-nomad`, `/packages/couples-getaway`, `/packages/group-week`.
- Blog: `/blog/[slug]` (2 posts).

## SEO / structured data

- Official domain: `https://moujasurfschool.com` — canonical, OG, sitemap, robots, JSON-LD all use it. **Do not reintroduce the old domain.**
- Entity: **MOUJA SURF SCHOOL** (structured data); visible brand: **MOUJA TAGHAZOUT**. Organization `@id`: `https://moujasurfschool.com/#organization`.
- Schema architecture is centralized in `src/lib/seo/schema.ts` (builders for Organization/LocalBusiness, WebSite, WebPage, BreadcrumbList, Service, Offer, FAQPage, Article) and emitted by `src/layouts/BaseLayout.astro` as **one `@graph` per page** (props: `schema`, `breadcrumb`, `mainEntity`). **Do not create a parallel schema system**; only add schema backed by real data.
- `public/robots.txt` and `public/llms.txt` exist. AI crawlers are **not blocked**; do not add arbitrary AI blocking or AI-ranking promises.

## Images

- All site images are **local WebP** under `src/assets/images/<category>/`. No external image URLs; don't reintroduce them.
- `src/data/images.ts` is the central registry (`import.meta.glob('../assets/images/**/*.webp', { eager: true })` → returns `{ default: { src } }` objects; use the `local()` helper).
- One file is shared by many IDs (e.g. `hero_coaching` == `package1` == `hero/surf-coaching.webp`). Reuse an existing asset before adding a new one.
- To add an image: drop a `.webp` in `src/assets/images/<category>/` and register via `local('<category>/file.webp')` in `images.ts`. Match the `<img width/height>` attributes in the templates.

## Design constraints (frozen)

- Styling lives only in `src/styles/tokens.css` and `src/styles/components.css`. No Tailwind, no per-component CSS.
- Typography: **Fraunces** (hero + targeted large titles), **Playfair Display** (other titles), **Inter** (body/UI). Do not change these or the color tokens.
- **Dark mode / theme toggle were removed — do not reintroduce** (`data-theme="dark"`, dark `prefers-color-scheme`, theme localStorage).
- **The homepage search/filter widget was removed — do not reintroduce it.**
- The design/QA state is validated (no horizontal overflow, no clipping, clean console). Preserve it; only minimal, strictly necessary changes are acceptable.

## Protected files (do not modify without explicit need)

`src/styles/tokens.css`, `src/styles/components.css`, `src/data/content.json`, `src/data/loaders.ts`, `src/data/images.ts`, `src/lib/seo/schema.ts`, `src/layouts/BaseLayout.astro`, `src/assets/images/**`, `archive-original/**`, `serve.py`, `server-menu.bat`, `start-local.bat`. Also protected: Header, Footer, Mega Menu, Mobile Drawer, Hero, booking, WhatsApp, SEO/schema metadata, routes.

## Blog & internal links

- 2 blog posts exist. Blog links are styled only inside `.post-article`; **inline links elsewhere may be invisible** — prefer existing buttons/CTA components instead of raw inline anchors outside blog prose.
- Internal linking was strengthened (blog→surf-camp/restaurant, surf-camp→packages, activities→packages, packages→booking). Keep links natural; **no keyword-stuffed links**.

## Entity / content watch

- Old brand/data may still need verified values (old "Taghazout Surf Nomads" mentions, old email, `+48` phone, old social handles). **Never invent** business data (NAP, hours, GPS, socials, certifications, dates). Flag missing/uncertain data; do not guess.

## Security

- Never expose API keys, tokens, passwords, secrets, credentials, or private keys. If a secret is found: don't display/copy it; flag it.

## Reference repos (architecture references only — no copying, no rebranding)

NDS Vanilla (`github.com/mazin-musleh/NDS-vanilla`), CSS Architecture (`github.com/jareware/css-architecture`), Astro (`github.com/withastro/astro`), ONYX Private Travel (`github.com/bymilon/onyx-private-travel`), Travel Agency (`github.com/devanshupatil/Travel-Agency-Website`).

## Working rules

1. Read AGENTS.md, audit before changing, understand the current architecture.
2. Touch only the requested scope; minimal changes; no speculative refactors; no unrelated edits.
3. Reuse existing systems (tokens, components, schema, data, images) — do not create parallel systems.
4. Verify with `npm run check`, then `npm run build` (24 pages + sitemap) when files changed.
5. Use `http://localhost:8231` for QA; never start a second server.
6. End with a clear final report.