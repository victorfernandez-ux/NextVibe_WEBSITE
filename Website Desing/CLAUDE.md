# NextVibe Agency Website

## Project Overview

Multi-page marketing website for NextVibe, an AI automation agency. Static HTML files with embedded CSS and JavaScript — no build step required.

## Tech Stack

- **Framework**: Static HTML (no build step)
- **Styling**: Embedded CSS
- **JavaScript**: Vanilla JS, embedded
- **Hosting**: Netlify
- **Fonts**: Inter (Google Fonts CDN)

## File Structure

```
Website Desing/
├── index.html          # Main landing page (hero, calculator, case studies, services, testimonials, contact form)
├── services.html       # Detailed services page (Lead Gen, PM, Hiring, Sales Admin, pricing)
├── about.html          # About page (founders, story, timeline, values, press)
├── contact.html        # Contact page (form, contact info, Calendly CTA)
├── netlify.toml        # Netlify configuration
├── .gitignore          # Git ignore rules
└── CLAUDE.md           # This file
```

## Design System

### Colors
| Token | Hex | Usage |
|-------|-----|-------|
| Black base | `#000000` | Background |
| Dark surface | `#0a0a0a` | Cards, alt sections |
| Dark elevated | `#111111` | Elevated cards |
| Dark border | `#1a1a1a` | Borders, dividers |
| Cyan primary | `#06B6D4` | Accents, CTAs, highlights |
| Cyan light | `#22D3EE` | Hover states |
| Cyan dark | `#0891B2` | Active states |
| White | `#FFFFFF` | Primary text |
| Gray text | `#9CA3AF` | Secondary text |

### Typography
- **Font**: Inter
- **Weights**: 300–800
- **Letter spacing**: -0.03em (tight)

### Corner Radii
Squared/luxe aesthetic — avoid rounded pills:
- Small: `4px`
- Medium: `6px`
- Large: `8px`

### Logo
Plain text wordmark: "Next" in white + "Vibe" in cyan (`#06B6D4`).

## Page Structure

### index.html (Main Landing Page)
1. **Hero** — Badge, headline with cyan highlight, subtitle, CTA buttons, stats row
2. **Savings Calculator** — Interactive inputs with live savings calculation
3. **Case Studies** — 3 cards with stats (SaaS, E-Commerce, Agency)
4. **Services Overview** — 3 service cards (Growth, Operations, Bespoke AI)
5. **Testimonials** — Client quote card
6. **Contact Form** — Inline form with Netlify Forms integration
7. **Footer** — Logo, nav links, copyright

### services.html (Detailed Services)
1. **Hero** — Stats-focused hero with animated counters
2. **Lead Generation Systems** — AI Cold Email, Application Systems, Content Systems
3. **Project Management Systems** — Automated Fulfillment, Onboarding, PM Workflows
4. **Hiring Systems** — Intake Systems, AI Scoring, Trial Processes
5. **Sales Administration** — Custom CRMs, AI Asset Generators, Nurture Systems
6. **Who It's For** — Target personas (Agencies, SaaS, Professional Services, E-Commerce)
7. **Process** — 4-step timeline (Discovery, Design, Build, Launch)
8. **Pricing** — Three tiers (Single System £3,500, Growth Package £8,500, Retainer £3,000/mo)
9. **CTA** — Final call-to-action

### about.html (About)
1. **Hero** — Company origin story headline with gradient orbs
2. **Story Section** — Company history and early AI adoption narrative
3. **Founders Section** — Profile for Victor Fernandez Garcia (Founder)
4. **Timeline Section** — Key milestones from 2020–2025
5. **Values Section** — 6-card grid of company principles
6. **Press Section** — Featured media logos
7. **CTA** — Call-to-action linking to Calendly

### contact.html (Contact)
1. **Hero** — "Get in Touch" headline
2. **Contact Form** — Name, email, company, message with Netlify Forms
3. **Contact Info** — Email, response time, Calendly card
4. **Footer**

## Interactive Features

- Scroll-triggered reveal animations via Intersection Observer
- Animated counters with easeOutQuart easing
- Mouse-following cursor glow effect (desktop only)
- Scroll progress indicator bar (fixed top)
- Smooth scroll navigation
- Interactive savings calculator (index.html)
- Mobile hamburger menu
- Fully responsive (breakpoints: 768px, 1024px)

## Deployment

### Deploy to Production
```bash
netlify deploy --prod
```

### Preview Deploy
```bash
netlify deploy
```

## External Dependencies

- **Calendly**: Meeting booking at `calendly.com/leftclick-meeting-30`
- **Google Fonts**: Inter font family via CDN
- **No npm packages** — Zero build dependencies

## Common Tasks

### Update Content
Edit the relevant HTML file directly. All content, styles, and scripts are embedded.

### Change Colors
Search for hex codes:
- Primary cyan: `#06B6D4`
- Light cyan: `#22D3EE`
- Dark cyan: `#0891B2`

### Update Calendly Link
Search for `calendly.com/leftclick-meeting-30` and replace across all files.

### Update Pricing (services.html)
Find the `.pricing-grid`. Each tier has:
- `.pricing-name` — tier name
- `.pricing-amount` — price
- `.pricing-features` — feature list

## Notes

- Keep the single-file architecture — no bundlers or build steps
- Maintain the squared corner aesthetic (no pills)
- Test scroll animations after content changes
- Counter animations trigger on scroll into view
- **index.html is the main landing page** — don't overwrite with feature content
- Contact forms use Netlify Forms (`data-netlify="true"`)
