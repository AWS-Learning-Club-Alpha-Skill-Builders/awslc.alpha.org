import 'server-only'

import { getSupabaseAdminClient } from '@/services/supabase-admin.service'
import { getCurrentUser } from '@/services/auth.service'
import type {
	AdminOverviewStats,
	LeaderboardEntry,
	MemberRow,
	CategoryCompletionStat,
	WeeklyActivityPoint,
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
				.select('id, email, full_name, role'),
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
		.filter((p) => p.role !== 'admin' && p.role !== 'super-admin')
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

	const [profilesRes, progressRes] = await Promise.all([
		supabase
			.from('profiles')
			.select('id, email, full_name, role, is_approved, avatar_url, created_at')
			.order('created_at', { ascending: false }),
		supabase
			.from('module_progress')
			.select('user_id, status'),
	])

	const profiles = profilesRes.data ?? []
	const progress = progressRes.data ?? []

	// For profiles missing full_name, try to get it
	// from Supabase Auth user metadata (e.g. Google OAuth)
	const missingNameIds = profiles
		.filter((p) => !p.full_name)
		.map((p) => p.id)

	const authNameMap = new Map<string, string>()

	if (missingNameIds.length > 0) {
		const { data: authUsers } =
			await supabase.auth.admin.listUsers({
				perPage: 1000,
			})

		if (authUsers?.users) {
			for (const authUser of authUsers.users) {
				if (!missingNameIds.includes(authUser.id))
					continue
				const name =
					authUser.user_metadata?.full_name ??
					authUser.user_metadata?.name ??
					null
				if (name) {
					authNameMap.set(authUser.id, name)
					// Backfill the profile so this
					// lookup isn't needed next time
					supabase
						.from('profiles')
						.update({ full_name: name })
						.eq('id', authUser.id)
						.then()
				}
			}
		}
	}

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
				authNameMap.get(profile.id) ??
				null,
			avatarUrl: profile.avatar_url,
			role: profile.role,
			isApproved: profile.is_approved ?? false,
			createdAt: profile.created_at,
			modulesCompleted: stats.done,
			modulesInProgress: stats.inProgress,
		}
	})
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
