# NextVibe Website — AGENTS.md

## Stack
- Static HTML/CSS/JS (no framework)
- Deployed to Netlify (netlify.toml)
- Source in `Website Desing/` directory
- No build step — edit HTML directly

## Project Structure
```
Website Desing/
  index.html          # Home page
  about.html          # About page
  services.html       # Services page
  contact.html        # Contact form (Netlify Forms)
  start/              # Start page
  blog/               # Blog posts (static HTML)
```

## Conventions
- All pages are static HTML — no React, no framework
- Netlify Forms for contact submissions
- Netlify Pretty URLs handles trailing-slash canonicalisation
- `X-Frame-Options: DENY` and other security headers set in netlify.toml
- No npm/node — edit HTML files directly

## Deployment
- Push to GitHub → Netlify auto-deploys from main branch
- Build output: `Website Desing/`
- Custom domain: (set up via Netlify dashboard)

## Common Tasks
- Edit pages: modify HTML files in `Website Desing/`
- Add blog post: create new HTML file in `Website Desing/blog/`
- Deploy: `git push` (Netlify auto-deploys)
- Local preview: open HTML files directly in browser

## Git
- Ignore .claude/worktrees/
- Main branch only
