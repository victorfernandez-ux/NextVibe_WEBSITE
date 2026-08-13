# NextVibe SEO Diagnostics — nextvibeai.com

**Date:** 13 August 2026
**Scope:** Full crawl of all 14 HTML pages in `Website Desing/` plus `robots.txt`, `sitemap.xml`, `netlify.toml`, `_headers`, `llms.txt` / `llms-full.txt`.
**Method:** Screaming Frog-style checks run against the deployed site source (the tool itself could not be downloaded in this environment — its CLI mode also requires a paid licence — so the same battery of checks was run directly: titles, meta descriptions, canonicals, headings, structured data, social tags, hreflang, internal links, sitemap coverage, redirects, security headers, images).

---

## Overall verdict

The technical foundation is **strong** — better than most small-business sites. No broken links, no duplicate titles or descriptions, valid structured data everywhere it exists, correct canonicals, solid security headers, and AI-search readiness (`llms.txt` + markdown mirrors) that most sites don't have yet.

The issues that matter are concentrated in three places: **two blog posts missing from the sitemap**, **titles/descriptions exceeding Google's display limits on 5 pages**, and a **client-side translation system that search engines cannot see**.

---

## ✅ What's passing (18 checks)

| Check | Result |
|---|---|
| Unique page titles | 14/14 unique, no duplicates |
| Unique meta descriptions | All unique, no duplicates |
| Broken internal links | **0** across all pages |
| Insecure (http://) links | 0 |
| H1 headings | Exactly one per page, all 14 pages |
| Canonical tags | Present and self-referencing on all indexable pages |
| hreflang | `en` + `x-default` pairs present and consistent |
| robots.txt | Valid, allows all, declares sitemap |
| WWW canonicalisation | 301 `www.nextvibeai.com` → `nextvibeai.com` (forced, in `netlify.toml`) |
| HTTPS / HSTS | `Strict-Transport-Security` with preload; full security header set (CSP, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy) |
| Structured data validity | All JSON-LD parses cleanly: `Organization` + `LocalBusiness` (home), `Person` (about), `Service` ×6 (services), `BlogPosting` ×5, `Blog`, `FAQPage` (/start/), `WebPage` + `BreadcrumbList` |
| Open Graph tags | Complete on all marketing/blog pages, absolute `og:image` URL |
| Twitter cards | Present on all marketing/blog pages |
| og:image weight | 49.6 KB — well optimised |
| Image alt text | No missing alt attributes |
| Font loading | Preconnect + preloaded stylesheet with swap — good CLS/LCP practice |
| Mobile viewport / lang / charset | Present on every page |
| AI-search readiness | `llms.txt`, `llms-full.txt`, and `.md` mirrors of every page — ahead of the curve |

---

## 🔴 High priority

### 1. Two blog posts are missing from sitemap.xml
`sitemap.xml` lists 11 URLs but the site has 13 indexable pages. Missing:

- `/blog/ai-automation-coaches.html`
- `/blog/ai-automation-marketing-agencies.html`

They're linked from `/blog/` so Google *can* find them, but exclusion from the sitemap slows discovery and signals lower priority. **The same two posts are also missing from `llms.txt`**, so AI search engines won't surface them either.

**Fix:** Add both URLs to `sitemap.xml` and both entries to `llms.txt`.

### 2. Meta descriptions exceed Google's ~160-character display limit on 5 pages
Google truncates these mid-sentence in search results, costing click-through:

| Page | Length |
|---|---|
| `/` (homepage) | 187 |
| `/blog/chatgpt-prompts-arent-ai-strategy.html` | 175 |
| `/blog/ai-strategy-vs-chatgpt-subscriptions.html` | 171 |
| `/blog/ai-automation-coaches.html` | 166 |
| `/blog/ai-leverage-stack-framework.html` | 161 |

**Fix:** Rewrite each to 120–155 characters, front-loading the value proposition.

### 3. Page titles exceed ~60 characters on 4 blog posts
Truncated in search results (Google cuts at ~600px ≈ 60 chars):

| Page | Length | Title |
|---|---|---|
| `/blog/ai-strategy-vs-chatgpt-subscriptions.html` | 73 | AI Strategy vs. ChatGPT Subscriptions — What Actually Works \| NextVibe AI |
| `/blog/ai-automation-coaches.html` | 72 | AI Automation for Coaches: 7 Systems That Save 15+ Hours/Week \| NextVibe |
| `/blog/ai-automation-marketing-agencies.html` | 71 | AI Automation for Marketing Agencies: What to Automate First \| NextVibe |
| `/blog/ai-leverage-stack-framework.html` | 67 | The AI Leverage Stack — 3 Layers Every Business Needs \| NextVibe AI |

**Fix:** Trim to ≤60 chars. Dropping the `| NextVibe AI` suffix on blog posts alone fixes most of these — the brand still appears via the `Organization` schema and URL.

---

## 🟡 Medium priority

### 4. Client-side translation is invisible to search engines
`js/i18n.js` swaps page text into ES/FR/DE/IT based on browser language / localStorage, on the same URLs. Search engines index only the English HTML — the four translations earn zero search visibility, and users can see different content than what Google indexed. hreflang (correctly) only declares `en`.

**Fix (choose one):** (a) If international traffic matters, serve real per-language URLs (`/es/`, `/fr/`…) with full hreflang interlinking; or (b) if it doesn't yet, remove the auto-detection (keep a manual switcher only) to avoid content-mismatch risk and ~7 KB of JS on every load.

### 5. Legal pages are thin on metadata
`/privacy-policy/` and `/terms/` are missing `twitter:card` and have no structured data; `404.html` has no meta description. Low traffic impact, but easy consistency wins.

### 6. Sitemap `lastmod` dates are stale
All entries say June 2026 while site content changed in August (recent commits). Stale `lastmod` teaches Google to distrust the field.

**Fix:** Update `lastmod` when a page materially changes — or remove the field entirely (Google ignores `changefreq`/`priority` anyway).

### 7. Mixed URL conventions
The site mixes extension URLs (`/services.html`, `/about.html`, blog posts) with pretty URLs (`/start/`, `/blog/`, `/privacy-policy/`). Not a ranking problem, but inconsistent for users and future migrations. If you ever unify, do it with 301s per page — Netlify's Pretty URLs plus per-page redirects.

### 8. Short titles/descriptions leave SERP space unused
- `/contact.html`: title 19 chars ("Contact NextVibe AI"), description 54 chars
- `/blog/` index: description 56 chars

**Fix:** Expand toward 50–60 char titles and 120–155 char descriptions with keywords (e.g. "Contact NextVibe AI — AI Automation for UK Small Businesses").

### 9. Stale email in llms-full.txt
`llms-full.txt` still contains `hello@nextvibe.ai`; the site everywhere else uses `hello@nextvibeai.com`. AI assistants reading this file could hand out a wrong address.

---

## 🟢 Low priority / housekeeping

- **Embedded CSS on every page** — no cross-page caching; `start/index.html` alone is 4,282 lines. Fine at this scale, but extracting shared CSS to one cached file would speed up repeat navigation.
- **`TODO.md` is stale** — both open items (placeholder Calendly link, placeholder email) are already fixed in the HTML; the real Calendly link `calendly.com/victor-fernandez-nextvibeai` is live on every page.
- **Duplicate `Person` schema** on `/about.html` (declared twice) — harmless but worth deduplicating.
- **Contact page word count is 101** — thin, but acceptable for a contact page.

---

## Page inventory

| URL | Title len | Desc len | Words | Structured data | Status |
|---|---|---|---|---|---|
| `/` | 50 | **187** | 376 | Organization, LocalBusiness | Desc too long |
| `/services.html` | 42 | 105 | 897 | Service ×6 | ✅ Clean |
| `/start/` | 34 | 82 | 469 | WebPage, BreadcrumbList, FAQPage | ✅ Clean |
| `/about.html` | 36 | 102 | 466 | Person ×2 | ✅ Clean |
| `/contact.html` | **19** | **54** | 101 | WebPage, BreadcrumbList | Title/desc short |
| `/blog/` | 52 | **56** | 322 | Blog | Desc short |
| `/blog/ai-leverage-stack-framework.html` | **67** | **161** | 842 | BlogPosting | Title+desc long |
| `/blog/chatgpt-prompts-arent-ai-strategy.html` | **65** | **175** | 736 | BlogPosting | Title+desc long |
| `/blog/ai-strategy-vs-chatgpt-subscriptions.html` | **73** | **171** | 724 | BlogPosting | Title+desc long |
| `/blog/ai-automation-marketing-agencies.html` | **71** | 155 | 1,582 | BlogPosting | Title long, **not in sitemap** |
| `/blog/ai-automation-coaches.html` | **72** | **166** | 1,376 | BlogPosting | Title+desc long, **not in sitemap** |
| `/privacy-policy/` | 28 | 96 | 867 | — | No twitter:card/schema |
| `/terms/` | 30 | 97 | 786 | — | No twitter:card/schema |
| `404.html` | 28 | — | 33 | — | (not indexed — fine) |

---

## Recommended fix order

1. Add the 2 missing blog posts to `sitemap.xml` and `llms.txt` (5 min, direct indexing impact)
2. Rewrite the 5 over-length meta descriptions (30 min, direct CTR impact)
3. Trim the 4 over-length blog titles (15 min, direct CTR impact)
4. Fix the stale email in `llms-full.txt` (2 min)
5. Decide the i18n strategy (real language URLs vs. manual-only switcher)
6. Expand contact/blog-index metadata; add twitter:card + schema to legal pages
7. Refresh or drop sitemap `lastmod`; clean up `TODO.md`
