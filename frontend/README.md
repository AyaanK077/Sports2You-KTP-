# Sports2You 🏀⚽

UTD-focused court reservation app — futuristic, dark-themed, student-facing.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev
```

Open http://localhost:5173

## Demo Credentials
- **Email**: any valid email format (e.g. `test@utdallas.edu`)
- **Password**: any 6+ character string

## Project Structure

```
Sports2You.jsx        ← Entire app (all pages, components, mock data, styles)
src/main.jsx          ← React entry point
index.html            ← HTML shell
vite.config.js        ← Vite config
package.json          ← Dependencies
```

## Pages & Routes
| Page | Route key | Description |
|------|-----------|-------------|
| Landing | `landing` | Hero, features, facilities overview |
| Login | `login` | UTD-style sign in |
| Sign Up | `signup` | Student account creation |
| Dashboard | `home` | Quick reserve CTA, upcoming bookings, stats |
| Reserve | `reserve` | 6-step multi-step booking flow |
| My Reservations | `reservations` | Upcoming/past bookings with cancel |
| Facilities | `facilities` | AC & Rec West cards |
| Facility Detail | `facility` | Hours, courts, sports, quick reserve |
| Profile | `profile` | User info, stats, sign out |
| Admin | `admin` | Court occupancy overview (visit `/admin` route key) |

## Facilities & Courts

### Activity Center (AC)
- **Main Gym – Left Court** → Basketball only
- **Main Gym – Middle Court** → Basketball only
- **Main Gym – Right Court** → Basketball only
- **Side Gym** → Basketball + Soccer

### Recreation Center West (Rec West)
- **Main Court** → Basketball + Soccer

## Booking Rules
| Sport | Court Type | Min Players | Max Players |
|-------|-----------|-------------|-------------|
| Basketball | Half Court | 6 | — |
| Basketball | Full Court | — | 10 |
| Soccer | — | 8 | — |

## Tech Stack
- React 18 + JSX
- Vite
- All CSS in-file (CSS-in-JS via `<style>` tag)
- Google Fonts: Barlow + Barlow Condensed
- No external UI library dependencies

## Design Tokens
```css
--bg: #0a0b0d          /* Deep black */
--orange: #f47c20      /* UTD burnt orange glow */
--green: #39d98a       /* Neon green accent */
--teal: #00d4cc        /* Teal edge glow */
--yellow: #f7c948      /* Warm yellow */
```
