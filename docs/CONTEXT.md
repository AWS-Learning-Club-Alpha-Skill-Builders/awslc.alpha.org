# CONTEXT.md — Session Handoff for Supabase MCP

> Load this file when continuing work with the Supabase MCP connected.

---

## Project State

AWS Learning Club Alpha website with Skillbuilder module tracking.
- **Framework:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, GSAP
- **Auth:** Supabase Auth with Google OAuth (just set up)
- **Database:** Supabase PostgreSQL
- **Supabase Project:** `dqxccxrwqngohcdegxnt` (ap-southeast-1)
- **Prisma:** Installed but NOT used for migrations (Supabase auth schema FK conflicts). Schema file exists at `prisma/schema.prisma` as documentation only. All queries use the Supabase JS client.

---

## Database Schema (Current)

### profiles
| Column | Type | Default | Notes |
|--------|------|---------|-------|
| id | uuid PK | — | FK to auth.users.id |
| email | text | — | |
| full_name | text | null | |
| role | text | 'member' | 'member' \| 'admin' \| 'super-admin' |
| **is_approved** | boolean | false | **NEW** — gates dashboard access |
| **avatar_url** | text | null | **NEW** — from Google profile |
| created_at | timestamptz | now() | |
| updated_at | timestamptz | now() | |

### invites
| Column | Type | Default |
|--------|------|---------|
| id | uuid PK | gen_random_uuid() |
| email | text (unique) | — |
| invited_by | uuid | — |
| status | text | 'pending' |
| expires_at | timestamptz | now() + 7 days |
| created_at | timestamptz | now() |
| updated_at | timestamptz | now() |

### skill_categories
| Column | Type | Default |
|--------|------|---------|
| id | uuid PK | gen_random_uuid() |
| slug | text (unique) | — |
| name | text | — |
| emoji | text | null |
| theme_key | text | null |
| short_description | text | null |
| long_description | text | null |
| display_order | int4 | 0 |
| is_active | bool | true |
| created_at | timestamptz | now() |
| updated_at | timestamptz | now() |

### skill_modules
| Column | Type | Default |
|--------|------|---------|
| id | uuid PK | gen_random_uuid() |
| category_id | uuid FK | — |
| slug | text (unique) | — |
| title | text | — |
| nextwork_url | text | — |
| description | text | null |
| display_order | int4 | 0 |
| is_active | bool | true |
| verification_hints | jsonb | '[]' |
| created_at | timestamptz | now() |
| updated_at | timestamptz | now() |

### module_progress
| Column | Type | Default |
|--------|------|---------|
| id | uuid PK | gen_random_uuid() |
| user_id | uuid | — |
| module_id | uuid | — |
| status | text | 'todo' |
| started_at | timestamptz | null |
| completed_at | timestamptz | null |
| created_at | timestamptz | now() |
| updated_at | timestamptz | now() |
| **unique** | (user_id, module_id) | |

### module_submissions
| Column | Type | Default |
|--------|------|---------|
| id | uuid PK | gen_random_uuid() |
| user_id | uuid | — |
| module_id | uuid | — |
| documentation_url | text | — |
| verification_status | text | 'pending' |
| verification_reason | text | null |
| verified_at | timestamptz | null |
| created_at | timestamptz | now() |
| updated_at | timestamptz | now() |

---

## Auth Flow

1. **Login** (`/auth/login`) — Google OAuth only (no password). Calls `supabase.auth.signInWithOAuth({ provider: 'google' })`
2. **Callback** (`/auth/callback/route.ts`) — Exchanges code, auto-creates profile if first sign-in (`is_approved: false` for members, `true` for super-admins)
3. **Super-admin check** — `NEXT_PUBLIC_SUPERADMIN_EMAIL` env var (comma-separated). Matching emails → redirect to `/admin`. Non-matching → `/skillbuilder/dashboard`
4. **Approval gate** — `/skillbuilder/dashboard` checks `profiles.is_approved`. If `false`, shows "Pending Approval" screen. Super-admin approves from `/admin/members`

### Environment Variables
```
NEXT_PUBLIC_SITE_URL=https://awsc-alpha.cloud
NEXT_PUBLIC_SUPABASE_URL=https://dqxccxrwqngohcdegxnt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SUPERADMIN_EMAIL=ramchrist20@gmail.com,notadocath@gmail.com
DATABASE_URL=postgresql://postgres.dqxccxrwqngohcdegxnt:...@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.dqxccxrwqngohcdegxnt:...@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
```

---

## Key Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing page |
| `/skillbuilder` | Public | Skillbuilder landing page |
| `/skillbuilder/dashboard` | Approved members | Module tracking dashboard |
| `/auth/login` | Public | Google OAuth sign-in |
| `/auth/callback` | System | OAuth code exchange + profile auto-create |
| `/admin` | Super-admin only | Admin overview with charts |
| `/admin/leaderboard` | Super-admin only | Ranked member leaderboard |
| `/admin/members` | Super-admin only | Member management + approval |

---

## Security Layers (Defense-in-Depth)

1. **Client-side redirect** — Login page checks email against env var (convenience only)
2. **Server layout guard** — `/admin/layout.tsx` checks user email against `NEXT_PUBLIC_SUPERADMIN_EMAIL`
3. **Service-layer guard** — Every admin service function calls `assertSuperAdmin()` which re-checks email server-side
4. **Action guards** — `requireSuperAdminUserId()` in server actions (invite, approve)
5. **Approval gate** — `getIsApproved()` check in skillbuilder dashboard page
6. **`import 'server-only'`** — All services marked to prevent client-side import

---

## What's Done

- [x] Skillbuilder landing page (`/skillbuilder`) — public, with hero background image
- [x] Skillbuilder dashboard (`/skillbuilder/dashboard`) — authenticated, approval-gated
- [x] Login page — Google OAuth only, dark split-screen design
- [x] OAuth callback route with auto profile creation
- [x] Admin overview (`/admin`) — stat cards, charts (Recharts), mini leaderboard
- [x] Admin leaderboard (`/admin/leaderboard`) — ranked table with search, medals
- [x] Admin members (`/admin/members`) — member table with tabs (All/Pending/Approved), approve/revoke buttons, invite modal
- [x] Pending approval screen for unapproved members
- [x] `is_approved` and `avatar_url` columns added to profiles table
- [x] Supabase Google OAuth provider configured
- [x] Prisma schema file (documentation only)
- [x] PRD at `docs/PRD-super-admin.md`

## What's Left (from PRD)

- [ ] Module enrollment approval system (members request, super-admin approves per module)
- [ ] `enrollment_requests` table
- [ ] Email notifications (Resend or Supabase Edge Functions)
- [ ] `notifications` table + in-app notification bell
- [ ] `admin_audit_log` table
- [ ] Admin analytics page (`/admin/analytics`)
- [ ] Admin module management page (`/admin/modules`) — CRUD for categories/modules
- [ ] Public top-10 leaderboard on `/skillbuilder` landing page
- [ ] CSV export from leaderboard

---

## File Structure (Admin)

```
src/app/admin/
├── layout.tsx              # Super-admin guard (email check)
├── admin-shell.tsx         # Sidebar + layout shell
├── page.tsx                # Overview (server component)
├── admin-overview.tsx      # Charts + stat cards (client)
├── leaderboard/
│   ├── page.tsx
│   └── admin-leaderboard.tsx
└── members/
    ├── page.tsx
    └── admin-members.tsx

src/services/admin.service.ts    # All admin data queries (assertSuperAdmin on each)
src/actions/approve-member.ts    # Approve/revoke member access
src/types/admin.types.ts         # AdminOverviewStats, LeaderboardEntry, MemberRow, etc.
```
