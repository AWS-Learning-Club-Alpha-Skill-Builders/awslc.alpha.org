# AWS Learning Club - Alpha

Static landing page for **AWS Learning Club - Alpha**, a student-led AWS community at Rizal Technological University (RTU), Philippines.

## Tech Stack

- **Framework:** Next.js (App Router) with static export
- **Language:** TypeScript (strict mode) + React
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Animation:** GSAP + ScrollTrigger
- **Hosting:** Vercel

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Static export to `/dist` (auto-fetches Meetup events first) |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |
| `npm run fetch-events` | Manually sync events from Meetup |

## Meetup Events Integration

Events displayed on the landing page and `/events` page are automatically pulled from the [AWS Cloud Club at RTU Meetup group](https://www.meetup.com/aws-cloud-club-at-rizal-technological-university/).

### How it works

A build-time scraping script (`scripts/fetch-meetup-events.ts`) fetches the Meetup group page, extracts event data from Meetup's embedded `__NEXT_DATA__`, and writes it to `src/data/meetup-events.generated.json`. The site's data layer reads from this JSON file.

### When to sync events

Run this command whenever a new event is posted, edited, or cancelled on Meetup:

```bash
npm run fetch-events
```

This updates `src/data/meetup-events.generated.json` with the latest data. Commit and push the updated file to trigger a Vercel redeploy.

> **Note:** `npm run build` also runs the sync automatically via the `prebuild` script, so every build gets fresh data.

### What gets synced

For each Meetup event, the script extracts:
- Title, description, date, time, location
- Event banner image (from Meetup's CDN)
- Registration link (for upcoming/active events only)
- Event type (Online / In-Person)

### Key files

| File | Purpose |
|------|---------|
| `scripts/fetch-meetup-events.ts` | Scraping script (run at build time) |
| `src/data/meetup-events.generated.json` | Generated event data (committed to git) |
| `src/data/events.ts` | Data layer with Event interface and helpers |
| `src/app/events/page.tsx` | `/events` page (Upcoming / Held tabs) |
| `src/app/(landing)/events/events.tsx` | Landing page events section |

### Troubleshooting

- **Events not showing?** Run `npm run fetch-events` and check the console output. The script logs how many events were found.
- **Script fails?** It fails gracefully — if the fetch fails, it keeps the existing JSON file or writes an empty array. The build is never broken by scraping failures.
- **Meetup changed their page structure?** The script relies on `__NEXT_DATA__` embedded in Meetup's HTML. If Meetup changes this, the script may need updating.

## Deploy

Push to `main` to trigger a Vercel deployment. The build process automatically fetches the latest Meetup events before generating the static site.
