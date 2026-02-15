# AWSCC UP Mindanao - Full Website System Analysis

> **Source:** https://www.awsccupmindanao.org/
> **Organization:** AWS Cloud Club - University of the Philippines Mindanao
> **GitHub Org:** [AWS-Learning-Club-UP-Mindanao](https://github.com/AWS-Learning-Club-UP-Mindanao)
> **Analyzed:** 2026-02-14

---

## Table of Contents

1. [System Architecture Overview](#1-system-architecture-overview)
2. [Repository Map](#2-repository-map)
3. [Main Website (awsccupmindanao.org)](#3-main-website)
4. [Events Page](#4-events-page)
5. [Officers Page](#5-officers-page)
6. [About Page](#6-about-page)
7. [Workshops Subdomain](#7-workshops-subdomain)
8. [Blogs Subdomain](#8-blogs-subdomain)
9. [CMS (Content Management System)](#9-cms-content-management-system)
10. [Shared Components](#10-shared-components)
11. [Data Models & Schemas](#11-data-models--schemas)
12. [Feature-by-Feature Breakdown for Replication](#12-feature-by-feature-breakdown-for-replication)
13. [Implementation Priority Matrix](#13-implementation-priority-matrix)

---

## 1. System Architecture Overview

The AWSCC UP Mindanao website is a **multi-site static architecture**
consisting of 4 separate repositories/deployments:

```
awsccupmindanao.org (Main Site)
  |-- /pages/events.html
  |-- /pages/officers.html
  |-- /pages/about.html
  |
workshops.awsccupmindanao.org (Subdomain - Separate Site)
  |-- /posts/:title/
  |-- /categories/
  |-- /tags/
  |-- /archives/
  |-- /about/
  |
blogs.awsccupmindanao.org (Subdomain - Separate Site)
  |-- /posts/:title/
  |-- /categories/
  |-- /tags/
  |-- /archives/
  |-- /about/
  |
CMS (Admin Dashboard - Separate App)
  |-- /login
  |-- /dashboard
  |-- /settings
```

### Tech Stack Summary

| Component | Technology | Hosting |
|-----------|-----------|---------|
| Main Website | Vanilla HTML/CSS/JS (ES Modules) | Vercel |
| Workshops | Jekyll + Chirpy Theme (Ruby) | GitHub Pages |
| Blogs | Jekyll + Chirpy Theme (Ruby) | GitHub Pages |
| CMS | Next.js 16 + AWS Amplify + TypeScript | AWS Amplify |

### External Integrations

| Service | Purpose |
|---------|---------|
| Meetup.com | "Join Us" registration link |
| Facebook | Social link (`facebook.com/awscc.up`) |
| Instagram | Social link (`instagram.com/awscc_upmin`) |
| LinkedIn | Social link (`linkedin.com/company/awscc-upmin`) |
| GitHub | Source code + social link |
| Vercel | Main website hosting + URL redirects |
| GitHub Pages | Workshops + Blogs hosting |
| AWS Amplify | CMS hosting + backend (DynamoDB) |

---

## 2. Repository Map

### Repo: `AWSCC-Website` (Main Site)
- **Language:** CSS (primary), HTML, Vanilla JS (ES Modules)
- **Homepage:** https://www.awsccupmindanao.org
- **Structure:**
  ```
  AWSCC-Website/
  ├── index.html                    # Homepage
  ├── vercel.json                   # Vercel redirects config
  ├── pages/
  │   ├── about.html
  │   ├── events.html
  │   └── officers.html
  └── assets/
      ├── components/               # Reusable HTML partials
      │   ├── navbar.html
      │   ├── footer.html
      │   └── officerCards.html
      ├── css/
      │   └── global.css            # Single global stylesheet
      ├── fonts/                    # Custom fonts
      ├── icons/                    # UI icons (PNG)
      ├── img/                      # Images (WebP format)
      │   ├── events/
      │   ├── highlights/
      │   └── officers/
      └── js/
          ├── main.js               # Homepage init + navbar
          ├── navbar.js             # Navbar component loader
          ├── footer.js             # Footer component loader
          ├── carousel.js           # Image carousel logic
          ├── slotmachine_anim.js   # Stat counter animation
          ├── events/
          │   ├── events.js         # Events page init
          │   ├── renderEvents.js   # Event card rendering
          │   └── json/
          │       ├── upcomingEvents.json
          │       └── heldEvents.json
          ├── officers/
          │   ├── officers.js       # Officers page init
          │   ├── renderOfficers.js # Officer card rendering
          │   ├── fallbackOfficers.js
          │   └── officerInfo/
          │       ├── leadsInfo.json
          │       ├── deptHeadsInfo.json
          │       └── committeeHeadsInfo.json
          └── about/                # About page scripts
  ```

### Repo: `AWSCC-Workshop` (Workshops Subdomain)
- **Language:** Shell (build), Markdown (content), Ruby (Jekyll)
- **Theme:** `jekyll-theme-chirpy` (dark mode)
- **Homepage:** https://workshops.awsccupmindanao.org
- **Structure:** Standard Chirpy Jekyll theme with `_posts/` for content

### Repo: `AWSCC-Blogs` (Blogs Subdomain)
- **Language:** Shell (build), Markdown (content), Ruby (Jekyll)
- **Theme:** `jekyll-theme-chirpy` (dark mode)
- **Homepage:** https://blogs.awsccupmindanao.org
- **Structure:** Standard Chirpy Jekyll theme with `_posts/` for content

### Repo: `AWSCC-Website-CMS` (Content Management System)
- **Language:** TypeScript
- **Framework:** Next.js 16.1.1 + React 19 + Tailwind CSS v4
- **Backend:** AWS Amplify Gen 2 (DynamoDB, Cognito auth)
- **Status:** Early development (still has default Todo schema)

---

## 3. Main Website

### URL: `https://www.awsccupmindanao.org/`

### 3.1 Navigation Bar
- **Type:** Fixed top navbar, loaded dynamically from `navbar.html`
- **Links:**
  - Events -> `/pages/events.html`
  - Workshops -> `https://workshops.awsccupmindanao.org`
  - Blogs -> `https://blogs.awsccupmindanao.org`
  - Officers -> `/pages/officers.html`
  - About -> `/pages/about.html`
  - Join Us -> Meetup.com (external)
- **Branding:** Logo image + "AWS Cloud Club" / "UP Mindanao" text
- **Pattern:** HTML partial loaded via `fetch()` + `innerHTML`

### 3.2 Hero Section
- **Background:** Gradient image (`gradient_1.webp`) + cloud overlays
- **Content:** Logo centered (loaded dynamically)
- **CTA Buttons:**
  - "Join Our Community" -> Meetup.com link
  - "Learn More" -> (no action defined)
- **Animations:** Cloud floating effects via CSS

### 3.3 "Why Join" Section
- **Heading:** "Why join AWSCC - UP Mindanao?"
- **Tagline:** "After all, **it's always Day One...**"
- **Feature Cards (3):**
  1. **Hands-on Learning** - Icon: laptop, description about labs/projects
  2. **Cloud Innovation** - Icon: cloud, description about AWS services
  3. **Certification Support** - Icon: lightning, description about CCP cert
- **Background:** Gradient overlay image
- **Layout:** Responsive card grid

### 3.4 Club Highlights Section
- **Image Carousel:**
  - 3 highlight images with prev/next buttons
  - Dot indicators for slide position
  - Auto-advancing with manual controls
- **Stat Cards (3):**
  - Active Members: `50+` (slot machine animation on scroll)
  - Conducted Workshops: `5+`
  - Affiliated Organizations: `10+`
- **Animation:** Slot machine counter animation (`slotmachine_anim.js`)

### 3.5 Footer
- **Type:** Loaded dynamically from `footer.html`
- **Content:**
  - Logo + "AWS Cloud Club - UP Mindanao"
  - Tagline: "It's Always Day One!"
  - Description paragraph
  - Social icons: Facebook, Instagram, LinkedIn, GitHub
  - Quick Links: Officers, Events, Workshops, Blogs, About, Join Us
  - Copyright: "2025 AWS Cloud Club - UP Mindanao. All rights reserved."

### 3.6 Deployment Config (vercel.json)
```json
{
  "cleanUrls": true,
  "redirects": [
    { "source": "/about", "destination": "/pages/about.html" },
    { "source": "/events", "destination": "/pages/events.html" },
    { "source": "/officers", "destination": "/pages/officers.html" }
  ]
}
```

---

## 4. Events Page

### URL: `/pages/events.html`

### 4.1 Upcoming Events Carousel
- **Type:** Horizontal card carousel with prev/next navigation
- **Data Source:** `assets/js/events/json/upcomingEvents.json`
- **Card Fields:**
  - `title` (string)
  - `description` (string)
  - `posterImage` (string, URL - currently empty for all)
  - `tags` (string array)
- **Current Entries:**
  1. "Introduction to AWS Cloud and AWS Cloud Clubs" - Tags: AWS, Cloud Basics, Community
  2. "AWS Capture the Flag" - Tags: AWS, CTF, Competition
  3. "Coming Soon" - placeholder

### 4.2 Held Events List
- **Type:** Vertical list with alternating image/text layout
- **Data Source:** `assets/js/events/json/heldEvents.json`
- **Card Fields:** Same schema as upcoming events
- **Card Layout:** Side-by-side with poster image + title/description/tags
- **Current Entries (4):**
  1. "AWSCC Containers Day" - Tags: Containers, Fargate, ECS, EKS
  2. "First Line of Defense: AWS Account Security 101 with IAM" - Tags: Security, Cybersecurity, Defense
  3. "Amazon Elastic Compute Cloud: Backbone of AWS" - Tags: EC2, Cloud Computing, Infrastructure
  4. "AWS CCP Certification Workshop" - Tags: Certification, AWS CCP, Cloud Fundamentals

### 4.3 Rendering Pattern
- Events are fetched from JSON files at runtime
- `renderEvents.js` generates HTML cards dynamically
- Carousel component handles sliding/navigation

---

## 5. Officers Page

### URL: `/pages/officers.html`

### 5.1 Page Header
- **Title:** "Meet the Officers"
- **Description:** Intro paragraph about the core team

### 5.2 Officer Sections (3 tiers)

#### Leads (3 members)
- **Data Source:** `officerInfo/leadsInfo.json`
- **Schema:**
  ```json
  {
    "Name": "string",
    "Position": "string (Department Lead | Cloud Captain | Committee Lead)",
    "Description": "string (personal quote)",
    "Image": "string (WebP path)"
  }
  ```

#### Department Heads (12 members)
- **Data Source:** `officerInfo/deptHeadsInfo.json`
- **Positions include:** Cloud Computing Dev Head, Data Computing Head,
  Machine Learning Head, Socmed Co-Head, Software & Web Development Head, etc.

#### Committee Heads (9 members)
- **Data Source:** `officerInfo/committeeHeadsInfo.json`
- **Positions include:** Core Volunteer Head, Creatives Co-Head,
  Events Co-Head, Logistics & Finance Co-Head, Promotions Co-Head,
  Partnerships Head, Sponsorships Co-Head, etc.

### 5.3 Card Component
- **HTML Template:** `assets/components/officerCards.html`
- **Behavior:** Flip card (front: photo + name/position on hover overlay; back: loading state with name/position)
- **Rendering:** Fetches JSON + HTML template, populates via DOM manipulation
- **Fallback:** `fallbackOfficers.js` handles image load failures
- **Total Officers:** 24 members

---

## 6. About Page

### URL: `/pages/about.html`

### 6.1 Hero/Header
- **Background:** Gradient images (same cosmic/cloud theme)
- **Content:**
  - Organization logo (centered, large)
  - Title: "AWS Cloud Club - UP Mindanao"
  - Description: Founded in early 2024, first official AWS student org
    in Davao City and entire UP System

### 6.2 Mission Statement
- Styled box/card with gradient border
- "Foster a **collaborative learning environment**, empower individuals,
  gain proficiency in AWS through **workshops, knowledge sharing,
  and community building**"

### 6.3 Vision Statement
- Styled box/card with gradient border
- "Be a **leading student-driven cloud community in Mindanao**,
  recognized for impact in **cloud education, collaboration,
  and innovation** aligned with AWS technologies"

---

## 7. Workshops Subdomain

### URL: `https://workshops.awsccupmindanao.org`

### 7.1 Platform
- **Engine:** Jekyll (Ruby static site generator)
- **Theme:** `jekyll-theme-chirpy` (dark mode forced)
- **Features:** PWA enabled, caching enabled

### 7.2 Layout
- **Sidebar (left, fixed):**
  - Organization avatar/logo
  - Title: "AWSCC Workshop"
  - Description: "A knowledge base of all workshops..."
  - Navigation: HOME, CATEGORIES, TAGS, TIMELINE, ABOUT US
  - Social links: GitHub, Email, RSS, LinkedIn
- **Main content area (center):**
  - Post cards with preview image, title, excerpt, date, category
- **Panel (right sidebar):**
  - Recently Updated posts
  - Trending Tags

### 7.3 Content Structure
- **Posts (2):**
  1. "Backbone of AWS" (Jan 25, 2025) - Category: Cloud Computing
     - 104 min read, comprehensive EC2 workshop
     - Tags: Apache, EC2
  2. "First Line of Defense" (Nov 20, 2024) - Category: Security
     - IAM security workshop
     - Tags: IAM
- **Categories (2):** Cloud Computing (1), Security (1)
- **Tags (3):** Apache, EC2, IAM

### 7.4 Post Features
- Table of Contents (auto-generated, right sidebar)
- Breadcrumb navigation
- Full-text search functionality
- Reading time estimate
- Author attribution
- Category/tag taxonomy
- Date-based archive (Timeline)

### 7.5 Post Data Schema (Jekyll Front Matter)
```yaml
---
title: "Post Title"
date: YYYY-MM-DD HH:MM:SS +0800
categories: [Category Name]
tags: [tag1, tag2]
image:
  path: /assets/img/post-image.webp
  alt: "Alt text"
---
Markdown content here...
```

---

## 8. Blogs Subdomain

### URL: `https://blogs.awsccupmindanao.org`

### 8.1 Platform
- Same as Workshops: Jekyll + Chirpy Theme (dark mode)
- **Title:** "AWSCC Blogs"
- **Description:** "A knowledge base of all blogs made by members..."

### 8.2 Content Structure
- **Posts (4):**
  1. "Unlock the Power of the Cloud - Deploy Your Django App on AWS EC2"
     (Nov 4, 2024) - Category: Cloud Computing
  2. "Get Started with NoSQL - AWS DynamoDB Fundamentals"
     (Nov 4, 2024) - Category: Databases
  3. "Security with AWS Cognito - Building Your First User Pool"
     (Nov 4, 2024) - Category: Security
  4. "Harnessing Computer Vision with Amazon Rekognition"
     (Nov 3, 2024) - Category: Machine Learning
- **Categories (4):** Cloud Computing, Databases, Machine Learning, Security
- **Tags (8):** Amazon Cognito, Amazon DynamoDB, Amazon EC2,
  Amazon Rekognition, Computer Vision, Django, NoSQL, Web Development

### 8.3 Key Difference from Workshops
- Blogs are member-written articles (community contributions)
- Workshops are official workshop documentation/guides
- Both use identical platform and theme

---

## 9. CMS (Content Management System)

### Repo: `AWSCC-Website-CMS`

### 9.1 Tech Stack
- **Framework:** Next.js 16.1.1 (App Router)
- **Language:** TypeScript
- **UI:** Tailwind CSS v4
- **Backend:** AWS Amplify Gen 2
  - Auth: AWS Cognito (identity pool)
  - Data: DynamoDB (via Amplify Data)
- **Build:** `amplify.yml` for CI/CD on AWS Amplify

### 9.2 App Routes
```
/login              # Authentication page
/dashboard          # Main admin dashboard
/dashboard/layout   # Dashboard layout wrapper
/settings           # Settings page
/test               # Test/development page
```

### 9.3 Data Schema (Current - Early Stage)
```typescript
const schema = a.schema({
  Todo: a.model({
    content: a.string(),
  }).authorization((allow) => [allow.guest()])
})
```
> **Note:** The CMS is still in early development with only a default
> Todo model. No officers/events/content models have been built yet.

### 9.4 Dependencies
```json
{
  "aws-amplify": "^6.15.9",
  "next": "16.1.1",
  "react": "19.2.3",
  "@aws-amplify/backend": "^1.20.0",
  "@tailwindcss/postcss": "^4",
  "aws-cdk-lib": "^2.216.0"
}
```

---

## 10. Shared Components

### 10.1 Navbar (`components/navbar.html`)
- Used across all main site pages
- Loaded dynamically via `navbar.js` using `fetch()` + `innerHTML`
- Contains logo, navigation links, "Join Us" CTA

### 10.2 Footer (`components/footer.html`)
- Used across all main site pages
- Loaded dynamically via `footer.js`
- Contains logo, tagline, description, social links, quick links, copyright

### 10.3 Officer Card (`components/officerCards.html`)
- Reusable flip-card template
- Front: Photo overlay with name/position on hover
- Back: Loading state with name/position text
- Used by `renderOfficers.js` for all 3 officer tiers

---

## 11. Data Models & Schemas

### 11.1 Event
```typescript
interface Event {
  title: string
  description: string
  posterImage: string      // URL path to WebP image
  tags: string[]           // e.g. ["AWS", "CTF", "Competition"]
}
```

### 11.2 Officer
```typescript
interface Officer {
  Name: string             // "Last, First"
  Position: string         // Role title
  Description: string      // Personal quote
  Image: string            // URL path to WebP headshot
}

// Grouped by tier:
interface OfficerData {
  Leads: Officer[]           // 3 members
  departmentHeads: Officer[] // 12 members
  committeeHeads: Officer[]  // 9 members
}
```

### 11.3 Workshop/Blog Post (Jekyll)
```typescript
interface Post {
  title: string
  date: string           // ISO date
  categories: string[]   // Single category
  tags: string[]         // Multiple tags
  image: {
    path: string         // Preview image path
    alt: string
  }
  content: string        // Markdown body
  readingTime: number    // Auto-calculated (minutes)
}
```

### 11.4 Stat Counter
```typescript
interface StatCard {
  label: string          // "Active Members"
  icon: string           // Icon image path
  value: number          // Target number for animation
}
```

---

## 12. Feature-by-Feature Breakdown for Replication

### MUST-HAVE Features (Core Pages)

| # | Feature | Source Page | Complexity | Notes |
|---|---------|-----------|------------|-------|
| 1 | Navigation bar | All pages | Low | Fixed top, responsive, logo + links |
| 2 | Hero section with CTA | Homepage | Medium | Gradient bg, animated clouds, 2 buttons |
| 3 | "Why Join" feature cards | Homepage | Low | 3 icon cards with descriptions |
| 4 | Image carousel | Homepage | Medium | Auto-advance, dots, prev/next buttons |
| 5 | Stat counters with animation | Homepage | Medium | Slot machine counting animation |
| 6 | Events - Upcoming carousel | Events | Medium | Horizontal card slider |
| 7 | Events - Held events list | Events | Low | Vertical list with images |
| 8 | Officers - Tiered grid | Officers | Medium | 3 tiers, flip cards, 24 members |
| 9 | About - Mission/Vision | About | Low | Logo, description, two statement cards |
| 10 | Footer | All pages | Low | Social links, quick links, copyright |

### SHOULD-HAVE Features (Subdomains)

| # | Feature | Source | Complexity | Notes |
|---|---------|--------|------------|-------|
| 11 | Workshop posts | workshops.* | High | Full blog with categories/tags/search |
| 12 | Blog posts | blogs.* | High | Same platform as workshops |
| 13 | Categories taxonomy | Both blogs | Medium | Category listing + filtered views |
| 14 | Tags taxonomy | Both blogs | Medium | Tag cloud + filtered views |
| 15 | Timeline/Archive | Both blogs | Low | Date-based post listing |
| 16 | Full-text search | Both blogs | Medium | Client-side search functionality |
| 17 | Table of Contents | Post pages | Low | Auto-generated from headings |
| 18 | Reading time | Post pages | Low | Word count based estimation |

### NICE-TO-HAVE Features (CMS)

| # | Feature | Source | Complexity | Notes |
|---|---------|--------|------------|-------|
| 19 | Admin login | CMS | High | AWS Cognito authentication |
| 20 | Content dashboard | CMS | High | CRUD for events/officers/posts |
| 21 | Settings page | CMS | Medium | Site configuration management |

---

## 13. Implementation Priority Matrix

### For awslc.alpha.org (Our Adaptation)

Since our site uses **Next.js 16 + Tailwind CSS + GSAP**, here is the
mapping of their features to our architecture:

#### Phase 1: Core Landing Page Parity
> Already mostly built in our current site

| Their Feature | Our Equivalent | Status | Action Needed |
|---------------|---------------|--------|---------------|
| Hero section | `hero/` section | Exists | Compare + enhance |
| Why Join cards | `about/` section | Exists | Feature cards exist |
| Club Highlights | `events/` section | Exists | Add carousel + stats |
| Team grid | `team/` section | Exists | Already have 12 members |
| Footer | `shared/footer` | Exists | Verify social links |
| Navbar | `shared/navigation` | Exists | Verify links |

#### Phase 2: New Pages to Build

| Feature | Implementation Plan |
|---------|-------------------|
| **Events page** | Create `/events` route with upcoming carousel + held events list. Store data in JSON or hardcoded arrays. |
| **About page** | Create `/about` route with org history, mission, vision. We already have vision section on homepage. |
| **Officers page** | Adapt existing `team/` section into dedicated page with 3 tiers (leads, dept heads, committee heads). |

#### Phase 3: Blog/Workshop System

| Feature | Implementation Plan |
|---------|-------------------|
| **Workshops section** | Option A: Separate Jekyll site (like them). Option B: MDX pages within Next.js using `@next/mdx`. Option C: External CMS (Notion, Contentful). |
| **Blogs section** | Same options as workshops. Recommend MDX within Next.js for single-codebase simplicity. |
| **Categories & Tags** | Build taxonomy system if using MDX. Free with Jekyll/external CMS. |
| **Search** | Use `flexsearch` or `fuse.js` for client-side search. |

#### Phase 4: CMS / Admin (Future)

| Feature | Implementation Plan |
|---------|-------------------|
| **Content management** | Since we use static export, options: (1) Edit JSON/MDX files directly, (2) Build admin with Amplify like them, (3) Use headless CMS like Sanity/Contentful. |

### Key Architecture Differences

| Aspect | AWSCC UP Mindanao | Our Site (awslc.alpha.org) |
|--------|-------------------|--------------------------|
| Main site | Vanilla HTML/CSS/JS | Next.js 16 + React 19 |
| Styling | Single CSS file | Tailwind CSS v4 + shadcn/ui |
| Animations | CSS only | GSAP + ScrollTrigger |
| Data loading | Runtime `fetch()` from JSON | Hardcoded in components |
| Components | HTML partials via `fetch()` | React components |
| Blog/Workshop | Separate Jekyll sites | TBD (MDX recommended) |
| Hosting | Vercel + GitHub Pages | Static export (`/dist`) |
| CMS | AWS Amplify (early stage) | None currently |
| Images | WebP, loaded from `/assets/img/` | WebP, `unoptimized: true` |
| Fonts | Custom (not identified) | Geist + Urban Starblues |

### Data to Collect for Our Site

To replicate the officer/events system, we need to prepare:

1. **Officer data** for all tiers (JSON format per their schema)
2. **Event data** - upcoming + held events with poster images
3. **Workshop content** - markdown posts with frontmatter
4. **Blog content** - member-contributed articles
5. **Stat numbers** - active members, workshops conducted, affiliations
6. **Highlight photos** - for the image carousel

---

*This analysis covers all publicly accessible pages, modules, data structures,
and technical architecture of the AWSCC UP Mindanao website system as of
February 2026. Use this as a reference for building equivalent functionality
into the AWS Learning Club Alpha (awslc.alpha.org) platform.*
