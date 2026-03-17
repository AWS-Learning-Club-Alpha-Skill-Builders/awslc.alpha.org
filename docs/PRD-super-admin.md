# PRD: Super-Admin Dashboard & Google SSO

**Product:** AWS Learning Club Alpha - Skillbuilder Super-Admin
**Author:** Ram Christopherbaarde
**Date:** 2026-03-17
**Status:** Draft

---

## 1. Problem Statement

Currently there is **no admin UI**. Admin actions (inviting members, managing modules) exist only as server actions with no interface. There is no way to:

- See a leaderboard of member progress across all tracks
- Approve or reject module enrollment requests
- View aggregated analytics on member activity
- Manage members at scale (bulk invite, role changes)
- Sign in with Google (only email/password exists)

The super-admin needs a dedicated dashboard to manage the Skillbuilder program, track member progress, and control module access.

---

## 2. Goals

1. **Google SSO** via Supabase Auth for all users (members + super-admins)
2. **Super-admin dashboard** with member management, module oversight, and analytics
3. **Leaderboard** showing top performers across all tracks
4. **Module enrollment approval** - super-admin gates who can take which modules
5. **Email notifications** via Gmail/Google accounts for approvals, invites, and milestones

---

## 3. User Roles

| Role | Description | Access |
|------|-------------|--------|
| `member` | Club member invited by super-admin | Skillbuilder dashboard, own progress, leaderboard (read) |
| `super-admin` | Club president / advisor / core officer | Full admin dashboard, member management, enrollment approval, leaderboard, analytics, module CRUD, role assignment |

> The `profiles.role` column will be: `'member' | 'super-admin'` (replaces existing `'member' | 'admin'`)

**Who is a super-admin?** Core officers of AWS Learning Club Alpha (president, VP, department heads). Set manually in Supabase or promoted by another super-admin via the dashboard.

---

## 4. Feature Specifications

### 4.1 Google SSO (All Users)

**Current state:** Email/password only via Supabase Auth. Invite system already exists using `supabase.auth.admin.inviteUserByEmail()` with redirect to `/auth/accept-invite`.

**Target state:** Google OAuth as primary sign-in method. Members are invited via Supabase invite link (sent to their Gmail), then sign in with Google on subsequent visits.

**Invite flow (existing, to be kept):**
1. Super-admin enters Gmail address in `/admin` dashboard
2. `inviteMemberAction` calls `supabase.auth.admin.inviteUserByEmail()` + creates `invites` record
3. Member receives Supabase invite email at their Gmail
4. Member clicks link -> redirected to `/auth/accept-invite` -> sets password / links Google
5. Profile auto-created with `role: 'member'`

**Google SSO additions:**
- Enable Google OAuth provider in Supabase dashboard
- Login page shows "Sign in with Google" button above email/password form
- Only users with an existing Supabase account (created via invite link) can sign in
- Existing email/password users can link their Google account for easier future sign-ins

**Supabase config needed:**
- Google Cloud Console: OAuth 2.0 credentials (client ID + secret)
- Supabase Auth > Providers > Google: enable + paste credentials
- Redirect URL: `{SITE_URL}/auth/callback`

**New route:** `/auth/callback/route.ts` - handles OAuth code exchange

### 4.2 Super-Admin Dashboard

**Route:** `/admin`
**Guard:** `requireSuperAdmin()` (new auth guard)

#### 4.2.1 Overview Page (`/admin`)

- Total members count, new this week/month
- Total modules, completion rate across all members
- Active members (signed in within 7 days)
- Pending enrollment requests count
- Quick-action buttons: Invite Member, View Leaderboard

#### 4.2.2 Leaderboard (`/admin/leaderboard`)

A ranked table of all members by progress, also embeddable on the public skillbuilder landing page.

| Column | Description |
|--------|-------------|
| Rank | Position by score |
| Member | Name + avatar (from Google profile) |
| Email | Gmail address |
| Modules Completed | Count of `done` modules |
| Modules In Progress | Count of `in-progress` modules |
| Completion Rate | `done / total_enrolled` as percentage |
| Last Active | Last module status change timestamp |
| Streak | Consecutive weeks with at least 1 completion |

**Sorting:** Default by completion count desc, toggleable by any column.
**Filtering:** By track/category, by date range.
**Export:** CSV download for reports.

**Public leaderboard:** A read-only, anonymized (first name + last initial) version on `/skillbuilder` landing page showing top 10.

#### 4.2.3 Member Management (`/admin/members`)

| Feature | Description |
|---------|-------------|
| Members table | Paginated list with name, email, role, join date, last active, modules completed |
| Invite member | Modal: enter Gmail address -> calls existing `inviteMemberAction` -> Supabase sends invite link to Gmail |
| Bulk invite | Upload CSV of Gmail addresses, loops `inviteMemberAction` per email |
| Promote to super-admin | Toggle per member: member / super-admin |
| Deactivate | Soft-delete: revoke access without deleting data |
| View profile | Drill-down to see member's full module progress across all tracks |
| Pending invites | Table of `invites` with status (pending/accepted/expired), resend option |

#### 4.2.4 Module Enrollment Approval (`/admin/enrollments`)

**New concept: Enrollment Requests**

Instead of members freely starting any module, they must request enrollment. The flow:

1. Member clicks "Request to Enroll" on a module card (replaces "Mark In Progress")
2. Creates an `enrollment_request` record with status `pending`
3. Super-admin sees pending requests in `/admin/enrollments`
4. Super-admin approves or rejects with optional message
5. On approval: module_progress is created with `in-progress` status
6. Member receives email notification of decision
7. On rejection: member sees reason on their dashboard

**New table: `enrollment_requests`**

```sql
create table enrollment_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  module_id uuid references skill_modules(id) not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  admin_note text,
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, module_id)
);
```

**Super-admin enrollments view:**
- Tabs: Pending | Approved | Rejected
- Each card shows: member name, module title, track name, requested date
- Bulk approve/reject with checkboxes
- Filter by track/category

#### 4.2.5 Analytics (`/admin/analytics`)

- Completion trends chart (line chart, weekly/monthly)
- Track popularity (bar chart: enrollments per category)
- Member activity heatmap (daily activity grid)
- Average time to complete per module
- Drop-off rates (started but never completed)

#### 4.2.6 Module Management (`/admin/modules`)

UI for the existing `upsertSkillCategoryAction` and `upsertSkillModuleAction`:

- CRUD interface for categories and modules
- Drag-and-drop reordering (display_order)
- Toggle active/inactive
- Edit verification hints
- Preview module card

### 4.3 Email Notifications

Using Supabase Edge Functions or a service like Resend/SendGrid, sent to members' Gmail accounts:

| Trigger | Recipient | Content |
|---------|-----------|---------|
| Enrollment approved | Member (Gmail) | "Your enrollment in {module} has been approved" |
| Enrollment rejected | Member (Gmail) | "Your enrollment request was not approved: {reason}" |
| Module completed | Super-admin | "{Member} completed {module}" |
| New member joined | Super-admin | "{Email} joined via Google SSO" |
| Weekly digest | Super-admin | Summary of completions, new members, pending requests |
| Milestone reached | Member (Gmail) | "Congratulations! You completed all modules in {track}" |

---

## 5. Database Changes

### New tables

```sql
-- Enrollment requests (gated module access)
create table enrollment_requests ( ... );  -- see 4.2.4

-- Notifications log
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  type text not null,
  title text not null,
  body text,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- Audit log (tracks all super-admin actions)
create table admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references auth.users(id) not null,
  action text not null,
  target_type text not null,
  target_id uuid,
  metadata jsonb,
  created_at timestamptz default now()
);
```

### Schema changes

```sql
-- Update role to member | super-admin (migrate existing 'admin' -> 'super-admin')
update profiles set role = 'super-admin' where role = 'admin';

alter table profiles
  drop constraint if exists profiles_role_check;
alter table profiles
  add constraint profiles_role_check
  check (role in ('member', 'super-admin'));

-- Add Google profile fields
alter table profiles
  add column avatar_url text,
  add column display_name text;
```

### Row Level Security (RLS)

- `enrollment_requests`: members see own rows, super-admins see all
- `module_progress`: members see own, super-admins see all (read), only system writes on approval
- `notifications`: users see own only
- `admin_audit_log`: super-admin only

---

## 6. Tech Stack Additions

| Tool | Purpose |
|------|---------|
| Supabase Google OAuth | Primary authentication via Gmail |
| Recharts or Chart.js | Admin analytics charts |
| Resend (or Supabase Edge Functions) | Transactional email to Gmail accounts |
| TanStack Table | Sortable, filterable admin tables |
| Supabase Realtime | Live updates on admin dashboard |

---

## 7. Sprint Plan

### Sprint 1: Google SSO & Auth Foundation (Week 1-2)

**Goal:** All users can sign in with Google. Two-role system in place.

| # | Task | Type | Est |
|---|------|------|-----|
| 1.1 | Configure Google OAuth in Supabase dashboard + Google Cloud Console | Config | 2h |
| 1.2 | Create `/auth/callback/route.ts` for OAuth code exchange | Backend | 2h |
| 1.3 | Update login page: add "Sign in with Google" button above email/password | Frontend | 3h |
| 1.4 | Auto-create profile on first Google sign-in (DB trigger or middleware) | Backend | 3h |
| 1.5 | Migrate `profiles.role`: rename `admin` -> `super-admin`, update constraint | DB migration | 1h |
| 1.6 | Create `requireSuperAdmin()` auth guard, update existing `requireAdminUserId()` | Backend | 2h |
| 1.7 | Add `avatar_url` and `display_name` columns to profiles | DB migration | 1h |
| 1.8 | Allow invited users to link Google account on `/auth/accept-invite` | Backend + Frontend | 3h |
| 1.9 | Ensure only Supabase-invited users can sign in (no open registration) | Backend | 2h |
| 1.10 | Update navigation: show Google avatar, account dropdown | Frontend | 2h |

**Deliverable:** Users sign in with Google after being invited via Supabase invite link. `member` and `super-admin` roles work.

---

### Sprint 2: Super-Admin Layout & Member Management (Week 3-4)

**Goal:** Super-admin shell with member CRUD.

| # | Task | Type | Est |
|---|------|------|-----|
| 2.1 | Create `/admin` layout with sidebar nav (Overview, Members, Enrollments, Leaderboard, Modules, Analytics) | Frontend | 4h |
| 2.2 | Admin overview page with stat cards (members, modules, completion rate, pending) | Frontend | 3h |
| 2.3 | `getAdminOverviewStats()` service function | Backend | 3h |
| 2.4 | Members table page (`/admin/members`) with pagination + search | Frontend | 4h |
| 2.5 | `getAllMembers()` service with sorting/filtering | Backend | 3h |
| 2.6 | Invite member modal: enter Gmail, calls existing `inviteMemberAction` (Supabase invite link) | Frontend | 2h |
| 2.7 | Bulk invite: CSV upload of Gmail addresses, loops existing invite action per email | Frontend + Backend | 4h |
| 2.8 | Promote/demote role toggle (member <-> super-admin) | Backend | 2h |
| 2.9 | Deactivate member action (soft delete) | Backend | 2h |
| 2.10 | Member detail drill-down (full module progress per member) | Frontend | 3h |

**Deliverable:** Super-admin can view, invite, promote, and manage all members.

---

### Sprint 3: Enrollment Approval System (Week 5-6)

**Goal:** Gated module access with super-admin approval workflow.

| # | Task | Type | Est |
|---|------|------|-----|
| 3.1 | Create `enrollment_requests` table + RLS policies | DB migration | 2h |
| 3.2 | `requestEnrollmentAction` server action | Backend | 2h |
| 3.3 | Update member dashboard: "Request to Enroll" replaces "Mark In Progress" | Frontend | 3h |
| 3.4 | `approveEnrollmentAction` / `rejectEnrollmentAction` server actions | Backend | 3h |
| 3.5 | Admin enrollments page (`/admin/enrollments`) with Pending/Approved/Rejected tabs | Frontend | 4h |
| 3.6 | Bulk approve/reject with checkboxes | Frontend | 2h |
| 3.7 | Show enrollment status (pending/approved/rejected) on member module cards | Frontend | 2h |
| 3.8 | Notification badge on admin sidebar for pending request count | Frontend | 2h |
| 3.9 | Create `admin_audit_log` table + logging utility | Backend | 2h |
| 3.10 | Log all approval/rejection actions to audit log | Backend | 1h |

**Deliverable:** Members request enrollment, super-admin approves/rejects.

---

### Sprint 4: Leaderboard (Week 7-8)

**Goal:** Ranked leaderboard for super-admin and public preview on landing page.

| # | Task | Type | Est |
|---|------|------|-----|
| 4.1 | `getLeaderboard()` service: aggregate progress across all members | Backend | 4h |
| 4.2 | Admin leaderboard page (`/admin/leaderboard`) | Frontend | 4h |
| 4.3 | Sortable columns (completed, rate, streak, last active) | Frontend | 3h |
| 4.4 | Filter by track/category and date range | Frontend | 3h |
| 4.5 | CSV export functionality | Backend + Frontend | 2h |
| 4.6 | Calculate streak logic (consecutive weeks with at least 1 completion) | Backend | 3h |
| 4.7 | Public top-10 leaderboard component on `/skillbuilder` landing page | Frontend | 3h |
| 4.8 | Anonymization logic (first name + last initial) for public view | Backend | 1h |
| 4.9 | Leaderboard rank badges (gold/silver/bronze for top 3) | Frontend | 2h |
| 4.10 | Real-time updates via Supabase Realtime subscription | Frontend | 3h |

**Deliverable:** Full leaderboard on admin dashboard, top-10 preview on skillbuilder landing.

---

### Sprint 5: Email Notifications (Week 9-10)

**Goal:** Automated email notifications to members' Gmail accounts.

| # | Task | Type | Est |
|---|------|------|-----|
| 5.1 | Set up Resend (or Supabase Edge Function) for transactional email | Config | 3h |
| 5.2 | Email template system (React Email or HTML templates) | Backend | 4h |
| 5.3 | Enrollment approved/rejected email to member's Gmail | Backend | 2h |
| 5.4 | Module completed notification to super-admin | Backend | 2h |
| 5.5 | New member joined notification to super-admin | Backend | 1h |
| 5.6 | Weekly digest email to super-admin (cron via Supabase Edge Function) | Backend | 4h |
| 5.7 | Track milestone email to member (completed all modules in a track) | Backend | 2h |
| 5.8 | Create `notifications` table + in-app notification bell | DB + Frontend | 4h |
| 5.9 | Notification preferences page (opt-in/out per notification type) | Frontend | 3h |
| 5.10 | Email delivery logging and retry logic | Backend | 2h |

**Deliverable:** Automated emails for approvals, completions, milestones, and weekly digests.

---

### Sprint 6: Analytics & Polish (Week 11-12)

**Goal:** Super-admin analytics and overall polish.

| # | Task | Type | Est |
|---|------|------|-----|
| 6.1 | Install Recharts, build reusable chart components | Frontend | 3h |
| 6.2 | Completion trends line chart (weekly/monthly) | Frontend + Backend | 3h |
| 6.3 | Track popularity bar chart (enrollments per category) | Frontend + Backend | 2h |
| 6.4 | Member activity heatmap (daily activity grid) | Frontend + Backend | 3h |
| 6.5 | Average completion time per module stat | Backend | 2h |
| 6.6 | Drop-off rate analysis (started but never completed) | Backend | 2h |
| 6.7 | Module management UI (`/admin/modules`) - CRUD for categories + modules | Frontend | 4h |
| 6.8 | Drag-and-drop reordering for categories/modules | Frontend | 3h |
| 6.9 | Admin dashboard responsive design + dark theme consistency | Frontend | 3h |
| 6.10 | End-to-end testing for super-admin flows | Testing | 4h |

**Deliverable:** Full analytics dashboard, module management UI, production-ready.

---

## 8. Architecture Diagram

```
Member Flow:
  Google Sign-In (Gmail) -> /auth/callback -> Profile auto-created (role: member)
  -> /skillbuilder (landing) -> /skillbuilder/dashboard
  -> Request Enrollment -> Wait for super-admin approval -> Start module
  -> Submit documentation -> Auto-verified -> Done

Super-Admin Flow:
  Google Sign-In (Gmail) -> /auth/callback -> /admin
  -> View pending enrollments -> Approve/Reject
  -> View leaderboard -> Export CSV
  -> Manage members -> Invite Gmail / Promote / Deactivate
  -> View analytics -> Track trends

Email Flow:
  Event trigger (approval/completion/milestone)
  -> Server action / Edge Function
  -> Resend API / Supabase email
  -> Member's Gmail inbox
```

---

## 9. File Structure (New)

```
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx              # Super-admin shell + sidebar
│   │   ├── page.tsx                # Overview dashboard
│   │   ├── leaderboard/
│   │   │   └── page.tsx
│   │   ├── members/
│   │   │   └── page.tsx
│   │   ├── enrollments/
│   │   │   └── page.tsx
│   │   ├── modules/
│   │   │   └── page.tsx
│   │   └── analytics/
│   │       └── page.tsx
│   ├── auth/
│   │   ├── callback/
│   │   │   └── route.ts            # Google OAuth code exchange
│   │   └── login/
│   │       └── page.tsx            # Updated with Google SSO button
│   └── skillbuilder/
│       └── ...                     # Existing + enrollment request UI
├── actions/
│   ├── invite-member.ts            # Already exists (Supabase invite link)
│   ├── request-enrollment.ts
│   ├── approve-enrollment.ts
│   ├── reject-enrollment.ts
│   ├── promote-member.ts
│   ├── deactivate-member.ts
│   └── bulk-invite.ts              # Loops existing inviteMemberAction
├── services/
│   ├── admin.service.ts            # Super-admin data fetching
│   ├── leaderboard.service.ts      # Leaderboard queries
│   ├── email.service.ts            # Transactional email to Gmail
│   └── notification.service.ts     # In-app notifications
└── types/
    ├── admin.types.ts
    └── database.types.ts           # Updated with new tables
```

---

## 10. Success Metrics

| Metric | Target |
|--------|--------|
| Google SSO adoption | 90% of active users sign in via Google/Gmail |
| Enrollment request turnaround | < 24 hours average approval time |
| Super-admin dashboard usage | Super-admin visits dashboard 3+ times/week |
| Leaderboard engagement | 50% of members check leaderboard weekly |
| Email open rate | > 60% for enrollment notifications |

---

## 11. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Google OAuth setup complexity | Blocks all auth | Sprint 1 is auth-only; fallback to email/password remains |
| Enrollment gating slows members | Frustration, drop-off | Auto-approve option per module; SLA for super-admin response |
| Email deliverability to Gmail | Members miss notifications | Use Resend (high deliverability); in-app notifications as backup |
| Scope creep on analytics | Delays launch | Sprint 6 is non-blocking; ship without analytics if needed |
| RLS policy errors | Data leaks | Thorough RLS testing; audit log for all super-admin actions |
| Single super-admin bottleneck | Slow approvals if unavailable | Allow multiple super-admins; bulk approve features |

---

## 12. Open Questions

1. Should certain modules be auto-approved (no super-admin gate)?
2. Should the public leaderboard be opt-in per member (privacy)?
3. What email service to use - Resend, SendGrid, or Supabase Edge Functions?
4. Do we need a mobile-responsive admin dashboard or is desktop-only acceptable for super-admins?
5. How many super-admins initially? Just president, or all core officers?
