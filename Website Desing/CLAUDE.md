# NextVibe Agency Website

## Project Overview

Multi-page marketing website for NextVibe, an AI automation agency. Static HTML files with embedded CSS and JavaScript — no build step required.

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

## Notes

- Keep the single-file architecture — no bundlers or build steps
- Maintain the squared corner aesthetic (no pills)
- Test scroll animations after content changes
- Counter animations trigger on scroll into view
- **index.html is the main landing page** — don't overwrite with feature content
- Contact forms use Netlify Forms (`data-netlify="true"`)
