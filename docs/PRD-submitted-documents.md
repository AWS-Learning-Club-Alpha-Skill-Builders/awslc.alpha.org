# PRD: Submitted Documents Admin Page

**Product:** AWS Student Builder Group - Alpha
**Feature:** Super-admin submitted documents review
**Status:** Draft
**Date:** 2026-05-05

## 1. Problem Statement

The app already stores member submission data in `module_submissions`, but there is no dedicated admin page to review or audit submitted documents.

Today, super-admins can see:
- member approval state
- oath acceptance state
- module progress
- leaderboard rankings

They cannot easily see:
- which documentation URL a member submitted
- when the submission happened
- whether the submission was verified or failed
- why a submission failed
- the history of multiple attempts for the same member and module

The result is that submitted documents are effectively hidden inside the backend, even though the data already exists.

## 2. Current Codebase Analysis

The codebase already has the core building blocks for this feature:

- [src/actions/submit-module-documentation.ts](/Users/ramchristopherbaarde/Documents/school/aws/awslc.alpha.org/src/actions/submit-module-documentation.ts) inserts a `module_submissions` row and stores verification status, reason, and timestamp.
- [src/services/verification.service.ts](/Users/ramchristopherbaarde/Documents/school/aws/awslc.alpha.org/src/services/verification.service.ts) verifies a submission link and now accepts public Google Docs or Nextwork links.
- [src/services/admin.service.ts](/Users/ramchristopherbaarde/Documents/school/aws/awslc.alpha.org/src/services/admin.service.ts) already powers the admin overview, leaderboard, and member list with server-side super-admin guards.
- [src/app/admin/admin-shell.tsx](/Users/ramchristopherbaarde/Documents/school/aws/awslc.alpha.org/src/app/admin/admin-shell.tsx) currently exposes only Overview, Leaderboard, and Members.
- [src/app/admin/members/page.tsx](/Users/ramchristopherbaarde/Documents/school/aws/awslc.alpha.org/src/app/admin/members/page.tsx) already loads member data and enrollments, so the admin area is already structured around server-rendered admin pages.
- [src/app/skillbuilder/dashboard/page.tsx](/Users/ramchristopherbaarde/Documents/school/aws/awslc.alpha.org/src/app/skillbuilder/dashboard/page.tsx) already gates members by approval and oath.
- [src/services/auth.service.ts](/Users/ramchristopherbaarde/Documents/school/aws/awslc.alpha.org/src/services/auth.service.ts) exposes both `getIsApproved()` and `getHasAcceptedOath()`.
- [src/actions/approve-member.ts](/Users/ramchristopherbaarde/Documents/school/aws/awslc.alpha.org/src/actions/approve-member.ts) resets oath state when access is revoked.
- [src/types/database.types.ts](/Users/ramchristopherbaarde/Documents/school/aws/awslc.alpha.org/src/types/database.types.ts) already defines `module_submissions` with `documentation_url`, `verification_status`, `verification_reason`, and `verified_at`.

That means the feature is not a greenfield build. It is a missing admin surface over existing submission data.

## 3. Product Goal

Create a super-admin-only page that lets the team inspect submitted documents in one place, without changing the member submission flow.

Primary outcome:
- super-admins can browse, search, and inspect submitted documentation URLs
- the page defaults to showing only members who are both approved and oath-complete
- the page supports history, filtering, and link opening for audits

## 4. Engineering Principles

The implementation should follow these constraints:

- Backward compatibility: do not break the existing member submission flow, auth gating, or admin routes.
- File isolation: keep changes scoped to the admin submissions surface, admin service layer, and supporting types/components instead of rewriting shared systems.
- Value-driven development: ship the smallest useful version first, then add history, export, and re-verification only after the read-only review page works.
- SOLID principles: separate data access, filtering, presentation, and row actions into distinct units so the page stays maintainable.

## 5. Non-Goals

This PRD does not change the member submission workflow.

Not in scope for the first release:
- manual grading or human approval of submissions
- replacing automatic verification
- changing the current module progress flow
- adding a public member-facing submission history page
- rewriting the existing admin dashboard layout
- broad refactors outside the submitted-documents surface

## 6. Visibility Rules

The submitted documents page is super-admin only.

Default row visibility:
- show only users where `profiles.is_approved = true`
- show only users where `profiles.has_accepted_oath = true`

Hidden by default, but optionally revealable through a super-admin-only toggle:
- users who are approved but have not accepted the oath
- users who are pending approval
- super-admin accounts, if needed for debugging or audits

This keeps the page focused on active, eligible members while still allowing investigation when necessary.

## 7. Proposed Route And UX

### Route
- `/admin/submissions`

### Page Title
- `Submitted Documents`

### Page Layout
- summary cards at the top
- filter bar under the summary cards
- main table of submissions
- optional detail drawer or side panel
- optional history view for repeated attempts

### Suggested Table Columns
- member name
- email
- track/category
- module title
- submitted document URL
- verification status
- verification reason
- submitted at
- verified at
- module progress state

### Suggested Row Actions
- open document in a new tab
- copy document URL
- open submission details
- view attempt history
- re-run verification later, if the team wants a manual audit tool in phase 2

## 8. Data And Service Plan

### Existing Data Sources
- `module_submissions`
- `profiles`
- `skill_modules`
- `skill_categories`
- `module_progress`

### Required Query Shape
The admin page should join submission rows with member and module metadata so the page can answer:
- who submitted it
- what they submitted
- which module it belongs to
- whether the member is eligible for the page by approval and oath state

### Suggested Admin Service Additions
Add a new service function in [src/services/admin.service.ts](/Users/ramchristopherbaarde/Documents/school/aws/awslc.alpha.org/src/services/admin.service.ts) such as:
- `getSubmittedDocuments()`
- optionally `getSubmittedDocumentStats()`

### Suggested Data Hardening
If the database does not already have them, add indexes for:
- `module_submissions.user_id`
- `module_submissions.module_id`
- `module_submissions.verification_status`
- `module_submissions.created_at`

If the team wants stricter integrity, add foreign keys or constraints as a follow-up migration.

## 9. Relationship To Existing Flows

The new page should respect the current system instead of replacing it.

Current member flow:
- member logs in with Google
- dashboard is gated by approval
- oath gate blocks users until they accept
- module submission stores the document URL and verification result

Submitted documents page behavior:
- read-only at launch
- admin-facing audit and inspection surface
- does not interfere with the existing submission or verification flow

## 10. Functional Requirements

1. Super-admins can open `/admin/submissions`.
2. The page shows only approved and oath-complete users by default.
3. The page can optionally include hidden users through a toggle.
4. The page lists submission records with member and module context.
5. The page exposes the submitted URL and lets admins open or copy it.
6. The page shows verification status and reason for failed submissions.
7. The page supports search by member name, email, module title, and track.
8. The page supports filters for status, category, and date range.
9. The page can show latest submission per member-module by default, with a history view for repeated attempts.
10. The page respects the existing server-side super-admin guard pattern.

## 11. Sprint Plan

### Sprint 1: Data Contract And Access Rules
Goal: define the submission record shape and the default eligibility rules.

Deliverables:
- add a submission query service in `src/services/admin.service.ts`
- define the joined row shape for member, module, category, and submission data
- add default filtering for approved + oath-complete users
- decide whether the page defaults to latest submission per member-module or all attempts
- add any missing indexes or integrity checks needed for fast filtering
- add the admin nav entry in [src/app/admin/admin-shell.tsx](/Users/ramchristopherbaarde/Documents/school/aws/awslc.alpha.org/src/app/admin/admin-shell.tsx)

### Sprint 2: Submitted Documents Page
Goal: ship the first usable admin page.

Deliverables:
- create [src/app/admin/submissions/page.tsx](/Users/ramchristopherbaarde/Documents/school/aws/awslc.alpha.org/src/app/admin/submissions/page.tsx)
- create a client table component for browsing submissions
- add search, status filter, track filter, and date filter
- add open-link and copy-link actions
- show verification status, reason, and timestamps
- add loading, empty, and no-results states

### Sprint 3: Drill-Down And History
Goal: make the page useful for audits, not just browsing.

Deliverables:
- submission detail drawer or side panel
- history view for repeated attempts
- optional toggle to include pending / oath-incomplete users
- optional re-run verification action for stale or suspicious submissions
- CSV export for submissions

### Sprint 4: QA, Performance, And Launch
Goal: harden the page before release.

Deliverables:
- verify super-admin-only access
- verify approved + oath default filter
- test link rendering and long URL handling
- test large result sets and pagination if needed
- update docs and admin tour copy

## 12. Acceptance Criteria

- Super-admins can see a dedicated submitted documents page.
- Approved and oath-complete users appear by default.
- Ineligible users can be hidden or revealed intentionally, not accidentally.
- Each row clearly shows the submitted URL, module, member, and verification result.
- The page supports opening the document directly.
- The page fits the existing admin shell and server-side guard pattern.

## 13. Risks And Notes

- The app currently stores submission attempts, not a single final document per module, so the UI needs a clear default view strategy.
- The current verification flow is automatic, so this page should be treated as an audit surface first, not a manual moderation queue.
- There is a known codebase cleanup risk where member-deletion cleanup should be verified against the actual `user_id` naming used by submissions and progress records before any destructive admin tools are expanded.
