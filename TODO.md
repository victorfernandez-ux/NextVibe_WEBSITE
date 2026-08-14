# NextVibe Website — TODO

## Content
- [x] Replace placeholder Calendly link with actual NextVibe link (`calendly.com/victor-fernandez-nextvibeai`)
- [x] Replace placeholder email with real email (`hello@nextvibeai.com`)
- [x] Update founder name to Victor Fernandez Garcia
- [ ] Write real testimonial (or get client approval for placeholder)
- [ ] Review and finalize pricing amounts

## SEO (from 2026-08-13 audit — see SEO-AUDIT.md)
- [x] Add missing blog posts to sitemap.xml and llms.txt
- [x] Rewrite over-length titles and meta descriptions (blog posts, homepage)
- [x] Expand short metadata (contact, blog index)
- [x] Add twitter:card + structured data to privacy-policy and terms pages
- [x] Fix stale email in llms-full.txt
- [x] Disable browser-language auto-switching in i18n (indexed content now matches displayed default)
- [ ] Decide long-term i18n strategy: real per-language URLs (`/es/`, `/fr/`…) with hreflang, or English-only
- [ ] Consider unifying URL style (`.html` vs pretty URLs) — requires per-page 301s if done
- [ ] Consider extracting shared embedded CSS into one cached stylesheet

## Design
- [x] Add favicon
- [x] Add Open Graph meta tags for social sharing
- [ ] Add real logo/wordmark if available (currently text-only)
- [ ] Review mobile responsiveness on real devices
- [ ] Add social media links to footer

## Functionality
- [x] Add Google Analytics tracking (GA4: G-YQN59YEK9T)
- [ ] Verify Netlify Forms submission works after deploy
- [ ] Set up form notification emails in Netlify dashboard
- [ ] Add cookie consent banner if required

## Deployment
- [x] Initialize git repo
- [x] Create Netlify site and link
- [x] Set up custom domain (nextvibeai.com)
- [x] Deploy to production
- [ ] Verify all pages on live URL after each deploy

## Accessibility
- [ ] Run accessibility audit on all pages
- [ ] Add alt text to any future images
- [ ] Test keyboard navigation end-to-end
- [ ] Verify color contrast passes WCAG AA
