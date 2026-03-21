import 'server-only'

import type {
	SkillbuilderSnapshot,
	SkillCategoryDto,
	SkillModuleDto,
	ModuleStatus,
	LeaderboardMember,
} from '@/types/skillbuilder.types'
import { getSupabaseServerClient } from '@/services/supabase-server.service'

interface CategoryRow {
	id: string
	slug: string
	name: string
	emoji: string | null
	theme_key: string | null
	short_description: string | null
	long_description: string | null
	display_order: number
}

interface ModuleRow {
	id: string
	category_id: string
	slug: string
	title: string
	nextwork_url: string
	description: string | null
	display_order: number
	verification_hints: string[] | null
}

interface ProgressRow {
	module_id: string
	status: ModuleStatus
}

export async function getSkillbuilderSnapshot(
	userId: string,
	isSuperAdmin = false,
): Promise<SkillbuilderSnapshot> {
	const supabase = await getSupabaseServerClient()

	const [categoriesRes, modulesRes, progressRes, enrollmentsRes] = await Promise.all([
		supabase
			.from('skill_categories')
			.select(
				'id, slug, name, emoji, theme_key, short_description, long_description, display_order',
			)
			.eq('is_active', true)
			.order('display_order', { ascending: true }),
		supabase
			.from('skill_modules')
			.select(
				'id, category_id, slug, title, nextwork_url, description, display_order, verification_hints',
			)
			.eq('is_active', true)
			.order('display_order', { ascending: true }),
		supabase
			.from('module_progress')
			.select('module_id, status')
			.eq('user_id', userId),
		supabase
			.from('member_enrollments')
			.select('category_id')
			.eq('user_id', userId),
	])

	if (categoriesRes.error) {
		throw new Error(`Failed to fetch categories: ${categoriesRes.error.message}`)
	}

	if (modulesRes.error) {
		throw new Error(`Failed to fetch modules: ${modulesRes.error.message}`)
	}

	if (progressRes.error) {
		throw new Error(`Failed to fetch progress: ${progressRes.error.message}`)
	}

	const enrolledCategoryIds = new Set<string>(
		isSuperAdmin
			? (categoriesRes.data as CategoryRow[]).map((c) => c.id)
			: (enrollmentsRes.data ?? []).map(
					(r: { category_id: string }) => r.category_id,
				),
	)

	const statusByModuleId = new Map<string, ModuleStatus>()
	;(progressRes.data as ProgressRow[]).forEach((row) => {
		statusByModuleId.set(row.module_id, row.status)
	})

	const modulesByCategoryId = new Map<string, SkillModuleDto[]>()
	;(modulesRes.data as ModuleRow[]).forEach((row) => {
		const list = modulesByCategoryId.get(row.category_id) ?? []
		list.push({
			id: row.id,
			categoryId: row.category_id,
			slug: row.slug,
			title: row.title,
			nextworkUrl: row.nextwork_url,
			description: row.description ?? '',
			displayOrder: row.display_order,
			verificationHints: row.verification_hints ?? [],
			status: statusByModuleId.get(row.id) ?? 'todo',
		})
		modulesByCategoryId.set(row.category_id, list)
	})

	const categories: SkillCategoryDto[] = (categoriesRes.data as CategoryRow[]).map(
		(category) => {
			const isEnrolled = enrolledCategoryIds.has(
				category.id,
			)
			return {
				id: category.id,
				slug: category.slug,
				name: category.name,
				emoji: category.emoji ?? '📚',
				themeKey: category.theme_key ?? 'cloud',
				shortDescription:
					category.short_description ?? '',
				longDescription:
					category.long_description ?? '',
				displayOrder: category.display_order,
				// Only send module data for enrolled
				// categories. Locked tracks get an empty
				// array — no URLs leak to the client.
				modules: isEnrolled
					? (modulesByCategoryId.get(
							category.id,
						) ?? [])
					: [],
				isEnrolled,
			}
		},
	)

	const enrolledCategories = categories.filter((c) => c.isEnrolled)
	const allModules = enrolledCategories.flatMap((c) => c.modules)
	const done = allModules.filter((module) => module.status === 'done').length
	const inProgress = allModules.filter(
		(module) => module.status === 'in-progress',
	).length
	const todo = allModules.filter((module) => module.status === 'todo').length

	return {
		categories,
		totals: {
			categories: enrolledCategories.length,
			modules: allModules.length,
			done,
			inProgress,
			todo,
		},
	}
}

export async function getMemberLeaderboard(): Promise<
	LeaderboardMember[]
> {
	const supabase = await getSupabaseServerClient()

	const [profilesRes, progressRes, modulesRes] =
		await Promise.all([
			supabase
				.from('profiles')
				.select('id, full_name, is_approved, role'),
			supabase
				.from('module_progress')
				.select('user_id, status'),
			supabase
				.from('skill_modules')
				.select('id')
				.eq('is_active', true),
		])

	const profiles = profilesRes.data ?? []
	const progress = progressRes.data ?? []
	const totalModules = modulesRes.data?.length ?? 0

	const doneByUser = new Map<string, number>()
	for (const row of progress) {
		if (row.status === 'done') {
			doneByUser.set(
				row.user_id,
				(doneByUser.get(row.user_id) ?? 0) + 1,
			)
		}
	}

	const entries: LeaderboardMember[] = profiles
		.filter(
			(p) =>
				p.is_approved &&
				p.role !== 'admin' &&
				p.role !== 'super-admin',
		)
		.map((profile) => {
			const done = doneByUser.get(profile.id) ?? 0
			return {
				userId: profile.id,
				fullName: profile.full_name,
				modulesCompleted: done,
				totalModules,
				completionRate:
					totalModules > 0
						? Math.round(
								(done / totalModules) * 100,
							)
						: 0,
			}
		})
		.filter((e) => e.modulesCompleted > 0)

	entries.sort(
		(a, b) => b.modulesCompleted - a.modulesCompleted,
	)

	return entries
}
