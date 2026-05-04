import 'server-only'

import { getSupabaseAdminClient } from '@/services/supabase-admin.service'
import { getCurrentUser } from '@/services/auth.service'
import type {
	AdminOverviewStats,
	LeaderboardEntry,
	MemberRow,
	CategoryCompletionStat,
	WeeklyActivityPoint,
	SubmittedDocumentsBundle,
	SubmittedDocumentRow,
	SubmittedDocumentsStats,
} from '@/types/admin.types'

/**
 * Server-side guard: verifies the current user's email
 * is in the NEXT_PUBLIC_SUPERADMIN_EMAIL allowlist.
 * Called at the service layer as defense-in-depth
 * (layout also checks, but we don't trust the UI alone).
 */
async function assertSuperAdmin(): Promise<void> {
	const user = await getCurrentUser()
	if (!user?.email) {
		throw new Error('Unauthorized: not authenticated.')
	}

	const allowed = (
		process.env.NEXT_PUBLIC_SUPERADMIN_EMAIL ?? ''
	)
		.toLowerCase()
		.split(',')
		.map((e) => e.trim())
		.filter(Boolean)

	if (!allowed.includes(user.email.toLowerCase())) {
		throw new Error('Forbidden: not a super-admin.')
	}
}

type SupabaseAdminClient = ReturnType<
	typeof getSupabaseAdminClient
>

type ProfileRecord = {
	id: string
	email: string
	full_name: string | null
	role: 'member' | 'admin' | 'super-admin'
	is_approved: boolean
	has_accepted_oath: boolean
	avatar_url: string | null
	created_at: string
}

type ModuleRecord = {
	id: string
	category_id: string
	title: string
	slug: string
	nextwork_url: string
	display_order: number
}

type CategoryRecord = {
	id: string
	name: string
	emoji: string | null
	theme_key: string | null
	display_order: number
}

type ProgressRecord = {
	user_id: string
	module_id: string
	status: 'todo' | 'in-progress' | 'done'
	started_at: string | null
	completed_at: string | null
	created_at: string
	updated_at: string
}

type SubmissionRecord = {
	id: string
	user_id: string
	module_id: string
	documentation_url: string
	verification_status: 'pending' | 'verified' | 'failed'
	verification_reason: string | null
	verified_at: string | null
	created_at: string
	updated_at: string
}

function buildFullName(
	authUser:
		| {
				user_metadata?: {
					full_name?: string | null
					name?: string | null
				}
		  }
		| null
		| undefined,
) {
	return (
		authUser?.user_metadata?.full_name ??
		authUser?.user_metadata?.name ??
		null
	)
}

async function loadProfilesWithFallback(
	supabase: SupabaseAdminClient,
): Promise<ProfileRecord[]> {
	const { data, error } = await supabase
		.from('profiles')
		.select(
			'id, email, full_name, role, is_approved, has_accepted_oath, avatar_url, created_at',
		)
		.order('created_at', { ascending: false })

	if (error) {
		throw new Error(`Failed to fetch profiles: ${error.message}`)
	}

	const profiles = (data ?? []) as ProfileRecord[]

	const missingNameProfiles = profiles.filter(
		(profile) => !profile.full_name,
	)

	const authNameMap = new Map<string, string>()

	if (missingNameProfiles.length > 0) {
		const results = await Promise.allSettled(
			missingNameProfiles.map((profile) =>
				supabase.auth.admin.getUserById(profile.id),
			),
		)

		for (const result of results) {
			if (result.status !== 'fulfilled') continue
			const authUser = result.value.data.user
			if (!authUser) continue

			const name = buildFullName(authUser)
			if (name) {
				authNameMap.set(authUser.id, name)
				supabase
					.from('profiles')
					.update({ full_name: name })
					.eq('id', authUser.id)
					.then()
			}
		}
	}

	return profiles.map((profile) => ({
		...profile,
		full_name:
			profile.full_name ??
			authNameMap.get(profile.id) ??
			null,
	}))
}

export async function getAdminOverviewStats(): Promise<AdminOverviewStats> {
	await assertSuperAdmin()
	const supabase = getSupabaseAdminClient()

	const [
		profilesRes,
		modulesRes,
		progressRes,
		categoriesRes,
	] = await Promise.all([
		supabase.from('profiles').select('id, is_approved, created_at'),
		supabase
			.from('skill_modules')
			.select('id')
			.eq('is_active', true),
		supabase
			.from('module_progress')
			.select('user_id, status, updated_at'),
		supabase
			.from('skill_categories')
			.select('id')
			.eq('is_active', true),
	])

	const profiles = profilesRes.data ?? []
	const modules = modulesRes.data ?? []
	const progress = progressRes.data ?? []

	const oneWeekAgo = new Date()
	oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

	const newMembersThisWeek = profiles.filter(
		(p) => new Date(p.created_at) >= oneWeekAgo,
	).length

	const pendingApprovals = profiles.filter(
		(p) => !p.is_approved,
	).length

	const completed = progress.filter(
		(p) => p.status === 'done',
	).length
	const inProgress = progress.filter(
		(p) => p.status === 'in-progress',
	).length

	const totalPossible = profiles.length * modules.length
	const completionRate =
		totalPossible > 0
			? Math.round((completed / totalPossible) * 100)
			: 0

	const activeUserIds = new Set(
		progress
			.filter(
				(p) =>
					p.updated_at &&
					new Date(p.updated_at) >= oneWeekAgo,
			)
			.map((p) => p.user_id),
	)

	return {
		totalMembers: profiles.length,
		newMembersThisWeek,
		pendingApprovals,
		totalModules: modules.length,
		totalCategories: categoriesRes.data?.length ?? 0,
		completionRate,
		totalCompleted: completed,
		totalInProgress: inProgress,
		activeMembersCount: activeUserIds.size,
	}
}

export async function getLeaderboard(): Promise<
	LeaderboardEntry[]
> {
	await assertSuperAdmin()
	const supabase = getSupabaseAdminClient()

	const [profilesRes, progressRes, modulesRes] =
		await Promise.all([
			supabase
				.from('profiles')
				.select(
					'id, email, full_name, role, is_approved',
				),
			supabase
				.from('module_progress')
				.select(
					'user_id, module_id, status, updated_at',
				),
			supabase
				.from('skill_modules')
				.select('id')
				.eq('is_active', true),
		])

	const profiles = profilesRes.data ?? []
	const progress = progressRes.data ?? []
	const totalModules = modulesRes.data?.length ?? 0

	const progressByUser = new Map<
		string,
		{
			done: number
			inProgress: number
			lastActive: string | null
		}
	>()

	for (const row of progress) {
		const entry = progressByUser.get(row.user_id) ?? {
			done: 0,
			inProgress: 0,
			lastActive: null,
		}

		if (row.status === 'done') {
			entry.done++
		} else if (row.status === 'in-progress') {
			entry.inProgress++
		}

		if (
			row.updated_at &&
			(!entry.lastActive ||
				row.updated_at > entry.lastActive)
		) {
			entry.lastActive = row.updated_at
		}

		progressByUser.set(row.user_id, entry)
	}

	const entries: LeaderboardEntry[] = profiles
		.filter(
			(p) =>
				p.role !== 'admin' &&
				p.role !== 'super-admin' &&
				p.is_approved,
		)
		.map((profile) => {
			const stats = progressByUser.get(profile.id) ?? {
				done: 0,
				inProgress: 0,
				lastActive: null,
			}
			return {
				userId: profile.id,
				email: profile.email,
				fullName: profile.full_name,
				avatarUrl: null,
				modulesCompleted: stats.done,
				modulesInProgress: stats.inProgress,
				totalModules,
				completionRate:
					totalModules > 0
						? Math.round(
								(stats.done / totalModules) * 100,
							)
						: 0,
				lastActiveAt: stats.lastActive,
			}
		})

	entries.sort(
		(a, b) =>
			b.modulesCompleted - a.modulesCompleted ||
			b.modulesInProgress - a.modulesInProgress,
	)

	return entries
}

export async function getAllMembers(): Promise<MemberRow[]> {
	await assertSuperAdmin()
	const supabase = getSupabaseAdminClient()

	const [profiles, progressRes] = await Promise.all([
		loadProfilesWithFallback(supabase),
		supabase
			.from('module_progress')
			.select('user_id, status'),
	])

	const progress = progressRes.data ?? []

	const statsByUser = new Map<
		string,
		{ done: number; inProgress: number }
	>()

	for (const row of progress) {
		const entry = statsByUser.get(row.user_id) ?? {
			done: 0,
			inProgress: 0,
		}
		if (row.status === 'done') entry.done++
		else if (row.status === 'in-progress')
			entry.inProgress++
		statsByUser.set(row.user_id, entry)
	}

	return profiles.map((profile) => {
		const stats = statsByUser.get(profile.id) ?? {
			done: 0,
			inProgress: 0,
		}
		return {
			id: profile.id,
			email: profile.email,
			fullName:
				profile.full_name ??
				null,
			avatarUrl: profile.avatar_url,
			role: profile.role,
			isApproved: profile.is_approved ?? false,
			hasAcceptedOath: profile.has_accepted_oath ?? false,
			createdAt: profile.created_at,
			modulesCompleted: stats.done,
			modulesInProgress: stats.inProgress,
		}
	})
}

export async function getSubmittedDocuments(): Promise<SubmittedDocumentsBundle> {
	await assertSuperAdmin()
	const supabase = getSupabaseAdminClient()

	const [
		profiles,
		submissionsRes,
		modulesRes,
		categoriesRes,
		progressRes,
	] = await Promise.all([
		loadProfilesWithFallback(supabase),
		supabase
			.from('module_submissions')
			.select(
				'id, user_id, module_id, documentation_url, verification_status, verification_reason, verified_at, created_at, updated_at',
			)
			.order('created_at', { ascending: false }),
		supabase
			.from('skill_modules')
			.select(
				'id, category_id, title, slug, nextwork_url, display_order',
			)
			.order('display_order', { ascending: true }),
		supabase
			.from('skill_categories')
			.select(
				'id, name, emoji, theme_key, display_order',
			)
			.order('display_order', { ascending: true }),
		supabase
			.from('module_progress')
			.select(
				'user_id, module_id, status, started_at, completed_at, created_at, updated_at',
			),
	])

	if (submissionsRes.error) {
		throw new Error(
			`Failed to fetch submissions: ${submissionsRes.error.message}`,
		)
	}
	if (modulesRes.error) {
		throw new Error(
			`Failed to fetch modules: ${modulesRes.error.message}`,
		)
	}
	if (categoriesRes.error) {
		throw new Error(
			`Failed to fetch categories: ${categoriesRes.error.message}`,
		)
	}
	if (progressRes.error) {
		throw new Error(
			`Failed to fetch progress: ${progressRes.error.message}`,
		)
	}

	const profilesById = new Map(
		profiles.map((profile) => [profile.id, profile]),
	)

	const modules = modulesRes.data ?? []
	const moduleById = new Map<string, ModuleRecord>(
		modules.map((module) => [module.id, module]),
	)

	const categories = categoriesRes.data ?? []
	const categoryById = new Map<string, CategoryRecord>(
		categories.map((category) => [category.id, category]),
	)

	const progressByPair = new Map<string, ProgressRecord>()
	for (const row of progressRes.data ?? []) {
		progressByPair.set(
			`${row.user_id}:${row.module_id}`,
			row,
		)
	}

	const submissions = (submissionsRes.data ?? []).map(
		(submission: SubmissionRecord) => {
			const profile = profilesById.get(submission.user_id)
			const moduleRecord = moduleById.get(submission.module_id)
			const category = moduleRecord
				? categoryById.get(moduleRecord.category_id)
				: null
			const progress = progressByPair.get(
				`${submission.user_id}:${submission.module_id}`,
			)

			const memberName = profile?.full_name ?? null
			const memberEmail = profile?.email ?? 'Unknown member'
			const memberRole = profile?.role ?? 'member'
			const memberApproved = profile?.is_approved ?? false
			const memberOath =
				profile?.has_accepted_oath ?? false

			const moduleTitle = moduleRecord?.title ?? 'Unknown module'
			const moduleSlug = moduleRecord?.slug ?? ''
			const moduleUrl = moduleRecord?.nextwork_url ?? ''
			const categoryName = category?.name ?? 'Uncategorized'
			const categoryEmoji = category?.emoji ?? '📦'
			const categoryTheme = category?.theme_key ?? 'default'
			const categoryOrder = category?.display_order ?? 0
			const moduleOrder = moduleRecord?.display_order ?? 0

			const member = {
				id: submission.user_id,
				email: memberEmail,
				fullName: memberName,
				avatarUrl: profile?.avatar_url ?? null,
				role: memberRole,
				isApproved: memberApproved,
				hasAcceptedOath: memberOath,
				createdAt: profile?.created_at ?? submission.created_at,
			}

			const moduleData = {
				id: submission.module_id,
				title: moduleTitle,
				slug: moduleSlug,
				nextworkUrl: moduleUrl,
				categoryId: moduleRecord?.category_id ?? 'unknown',
				categoryName,
				categoryEmoji,
				categoryThemeKey: categoryTheme,
				categoryDisplayOrder: categoryOrder,
				displayOrder: moduleOrder,
			}

			return {
				submissionId: submission.id,
				submittedAt: submission.created_at,
				updatedAt: submission.updated_at,
				documentationUrl: submission.documentation_url,
				verificationStatus: submission.verification_status,
				verificationReason:
					submission.verification_reason ?? null,
				verifiedAt: submission.verified_at ?? null,
				member,
				module: moduleData,
				progress: progress
					? {
							status: progress.status,
							startedAt: progress.started_at ?? null,
							completedAt:
								progress.completed_at ?? null,
							createdAt: progress.created_at,
							updatedAt: progress.updated_at,
						}
					: null,
				isVisibleByDefault: memberApproved && memberOath,
			} satisfies SubmittedDocumentRow
		},
	)

	const visibleSubmissions = submissions.filter(
		(row) => row.isVisibleByDefault,
	)
	const visibleMemberIds = new Set(
		visibleSubmissions.map((row) => row.member.id),
	)
	const hiddenSubmissions = submissions.length - visibleSubmissions.length
	const verifiedSubmissions = visibleSubmissions.filter(
		(row) => row.verificationStatus === 'verified',
	).length
	const failedSubmissions = visibleSubmissions.filter(
		(row) => row.verificationStatus === 'failed',
	).length
	const pendingSubmissions = visibleSubmissions.filter(
		(row) => row.verificationStatus === 'pending',
	).length

	const stats: SubmittedDocumentsStats = {
		totalSubmissions: submissions.length,
		visibleSubmissions: visibleSubmissions.length,
		hiddenSubmissions,
		verifiedSubmissions,
		failedSubmissions,
		pendingSubmissions,
		totalMembersWithSubmissions: new Set(
			submissions.map((row) => row.member.id),
		).size,
		eligibleMembersWithSubmissions: visibleMemberIds.size,
	}

	return {
		submissions,
		stats,
	}
}

export async function getCategoryCompletionStats(): Promise<
	CategoryCompletionStat[]
> {
	await assertSuperAdmin()
	const supabase = getSupabaseAdminClient()

	const [categoriesRes, modulesRes, progressRes] =
		await Promise.all([
			supabase
				.from('skill_categories')
				.select(
					'id, name, emoji, theme_key, display_order',
				)
				.eq('is_active', true)
				.order('display_order', { ascending: true }),
			supabase
				.from('skill_modules')
				.select('id, category_id')
				.eq('is_active', true),
			supabase
				.from('module_progress')
				.select('module_id, status'),
		])

	const categories = categoriesRes.data ?? []
	const modules = modulesRes.data ?? []
	const progress = progressRes.data ?? []

	const moduleToCategory = new Map<string, string>()
	const modulesPerCategory = new Map<string, number>()

	for (const mod of modules) {
		moduleToCategory.set(mod.id, mod.category_id)
		modulesPerCategory.set(
			mod.category_id,
			(modulesPerCategory.get(mod.category_id) ?? 0) + 1,
		)
	}

	const statsByCategory = new Map<
		string,
		{ completed: number; inProgress: number }
	>()

	for (const row of progress) {
		const catId = moduleToCategory.get(row.module_id)
		if (!catId) continue

		const entry = statsByCategory.get(catId) ?? {
			completed: 0,
			inProgress: 0,
		}
		if (row.status === 'done') entry.completed++
		else if (row.status === 'in-progress')
			entry.inProgress++
		statsByCategory.set(catId, entry)
	}

	return categories.map((cat) => {
		const stats = statsByCategory.get(cat.id) ?? {
			completed: 0,
			inProgress: 0,
		}
		return {
			categoryName: cat.name,
			emoji: cat.emoji ?? '📚',
			themeKey: cat.theme_key ?? 'default',
			completed: stats.completed,
			inProgress: stats.inProgress,
			total: modulesPerCategory.get(cat.id) ?? 0,
		}
	})
}

export async function getWeeklyActivity(): Promise<
	WeeklyActivityPoint[]
> {
	await assertSuperAdmin()
	const supabase = getSupabaseAdminClient()

	const twelveWeeksAgo = new Date()
	twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84)

	const { data } = await supabase
		.from('module_progress')
		.select('updated_at')
		.eq('status', 'done')
		.gte('updated_at', twelveWeeksAgo.toISOString())

	const rows = data ?? []
	const weekMap = new Map<string, number>()

	for (let i = 11; i >= 0; i--) {
		const d = new Date()
		d.setDate(d.getDate() - i * 7)
		const key = getWeekKey(d)
		weekMap.set(key, 0)
	}

	for (const row of rows) {
		if (!row.updated_at) continue
		const key = getWeekKey(new Date(row.updated_at))
		if (weekMap.has(key)) {
			weekMap.set(key, (weekMap.get(key) ?? 0) + 1)
		}
	}

	return Array.from(weekMap.entries()).map(
		([week, completions]) => ({
			week,
			completions,
		}),
	)
}

export async function getAllCategories(): Promise<
	{ id: string; name: string; emoji: string }[]
> {
	await assertSuperAdmin()
	const supabase = getSupabaseAdminClient()

	const { data, error } = await supabase
		.from('skill_categories')
		.select('id, name, emoji')
		.eq('is_active', true)
		.order('display_order', { ascending: true })

	if (error) {
		throw new Error(
			`Failed to fetch categories: ${error.message}`,
		)
	}

	return (data ?? []).map((c) => ({
		id: c.id,
		name: c.name,
		emoji: c.emoji ?? '📚',
	}))
}

export async function getMemberEnrollments(
	memberId: string,
): Promise<string[]> {
	await assertSuperAdmin()
	const supabase = getSupabaseAdminClient()

	const { data, error } = await supabase
		.from('member_enrollments')
		.select('category_id')
		.eq('user_id', memberId)

	if (error) {
		throw new Error(
			`Failed to fetch enrollments: ${error.message}`,
		)
	}

	return (data ?? []).map(
		(r: { category_id: string }) => r.category_id,
	)
}

function getWeekKey(date: Date): string {
	const d = new Date(date)
	d.setDate(d.getDate() - d.getDay())
	const month = String(d.getMonth() + 1).padStart(2, '0')
	const day = String(d.getDate()).padStart(2, '0')
	return `${month}/${day}`
}
