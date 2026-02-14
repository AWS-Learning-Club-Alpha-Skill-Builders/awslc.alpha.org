# CLAUDE.md - AWS Learning Club Alpha Website

## Project Overview

Static landing page for **AWS Learning Club - Alpha**, a student-led AWS community at Rizal Technological University (RTU), Philippines. Single-page architecture with scroll-based sections.

## Tech Stack

- **Framework:** Next.js 16.0.7 (App Router) with `output: 'export'` (static site)
- **Language:** TypeScript (strict mode) + React 19.2.1
- **Styling:** Tailwind CSS v4 (`@import "tailwindcss"` syntax) + CSS variables
- **UI Library:** shadcn/ui (New York style) + Radix UI primitives
- **Animation:** GSAP 3.13.0 + ScrollTrigger
- **Fonts:** Geist (Sans & Mono) + Urban Starblues (custom, `/public/fonts/`)
- **Forms:** react-hook-form + Zod validation
- **Analytics:** @vercel/analytics
- **Build:** Turbopack (dev), static export to `/dist`

## Project Structure

```
src/
├── app/
│   ├── (landing)/           # Route group: landing page sections
│   │   ├── hero/            # Animated intro with logo + stats
│   │   ├── about/           # Feature cards (4 cards)
│   │   ├── vision/          # Vision/Mission/Values + banner
│   │   ├── events/          # Events section (currently empty)
│   │   ├── team/            # Horizontal scrollable team cards (12 members)
│   │   ├── testimonials/    # Member testimonials (3)
│   │   ├── contact/         # Contact form (mailto:)
│   │   └── shared/          # Navigation, Footer, modals/
│   ├── layout.tsx           # Root layout (metadata, fonts)
│   ├── page.tsx             # Homepage (composes all sections)
│   ├── not-found.tsx        # 404 page
│   └── globals.css          # Global styles, CSS variables, theme
├── components/
│   └── ui/                  # shadcn/ui components (55+)
├── hooks/
│   ├── use-mobile.ts        # Mobile detection hook
│   └── use-toast.ts         # Toast notification hook
└── lib/
    └── utils.ts             # cn() utility (clsx + tailwind-merge)
```

## Key Commands

```bash
npm run dev          # Dev server with Turbopack
npm run build        # Static export to /dist
npm run start        # Serve production build
npm run lint         # ESLint
```

## Architecture & Conventions

### File Naming
- **kebab-case** for all files and directories: `core-members.tsx`, `use-mobile.ts`
- **PascalCase** for component exports: `CoreMembers`, `SignupModal`
- **camelCase** for variables, functions, hooks, props

### Imports
- Always use path alias `@/*` (maps to `./src/*`)
- Barrel exports via `index.ts` in section directories
- Import order: external libs -> internal modules -> types

### Component Patterns
- All landing sections are **client components** (`"use client"`) due to GSAP animations
- Each section is self-contained in `app/(landing)/[section-name]/`
- Use `useRef` + `useEffect` for GSAP animation targets
- Mobile fallbacks with `setTimeout` for animation visibility
- Use `cn()` from `@/lib/utils` for conditional Tailwind classes

### Styling
- **Utility-first Tailwind CSS** - no custom CSS files per component
- AWS brand colors: primary/accent `#ff9900` (orange), foreground `#232f3e` (navy)
- White background, navy text, orange accents
- Mobile-first responsive: `sm:`, `md:`, `lg:` breakpoints
- CSS variables defined in `globals.css` `:root`
- Tailwind v4 syntax: `@import "tailwindcss"` (not `@tailwind` directives)

### Animation Patterns
- GSAP context API for cleanup in `useEffect`
- `ScrollTrigger` for scroll-based animations
- `gsap.set()` for initial states, staggered animations for card grids
- Always add mobile fallback with `setTimeout` to ensure visibility

### Static Site Configuration
- `output: 'export'` in `next.config.ts` - no API routes, no SSR
- `trailingSlash: true`, `distDir: 'dist'`
- Images: `unoptimized: true` (no Next.js Image Optimization API)
- All data is hardcoded in component files (no CMS, no database)

## Code Quality Standards

### TypeScript
- Strict mode enabled, zero type errors
- Never use `any` - use precise, descriptive types
- Prefer `interface` over `type` for object shapes
- Use const objects with `as const` instead of enums
- Use type guards for undefined/null handling

### React Best Practices
- Functional components with TypeScript interfaces
- Define components using the `function` keyword
- Extract reusable logic into custom hooks
- Use `React.memo()` strategically for performance
- Proper cleanup in `useEffect` hooks
- Avoid inline function definitions in JSX
- Never use index as list key

### Forbidden Patterns
- No direct `fetch()` calls in components
- No inline styles or large style objects
- No `any` types
- No business logic in components
- No unused variables or imports
- When using apostrophes/quotes in HTML, use `&apos;`, `&quot;`, etc.

### Accessibility
- Semantic HTML elements
- ARIA attributes where needed
- Keyboard navigation support
- Color contrast ratios (4.5:1 minimum)
- Logical heading hierarchy (h1 -> h2 -> h3)

### Code Style
- Tabs for indentation
- Single quotes for strings
- Omit semicolons (unless required for disambiguation)
- Strict equality (`===`) only
- Trailing commas in multiline literals
- Line length limit: 80 characters

## Content & Data

- Team members: hardcoded array in `core-members.tsx` (12 people)
- Testimonials: hardcoded array in `testimonials.tsx` (3 entries)
- Team photos: WebP in `/public/board-members/`
- Contact email: `awslc.alpha@gmail.com`
- No testing infrastructure currently set up
- No CI/CD pipeline configured

## When Expanding This Project

If adding backend/API features in the future, follow the four-layer architecture:
1. **Services** (`src/services/`) - API communication only
2. **Hooks** (`src/hooks/`) - State & read operations (SWR/React Query)
3. **Actions** (`src/actions/`) - Write operations (Server Actions)
4. **Components** (`src/components/`) - UI presentation only

Data flow: `Component -> Hook -> Service -> API` (reads) | `Component -> Action -> Service -> API` (writes)
