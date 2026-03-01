'use server'

import { z } from 'zod'
import { requireAdminUserId } from '@/actions/_auth-guards'
import { getSupabaseServerClient } from '@/services/supabase-server.service'

const schema = z.object({
	id: z.string().uuid().optional(),
	slug: z
		.string()
		.trim()
		.min(2)
		.max(80)
		.regex(/^[a-z0-9-]+$/),
	name: z.string().trim().min(2).max(120),
	emoji: z.string().trim().max(16).optional(),
	themeKey: z.string().trim().max(40).optional(),
	shortDescription: z.string().trim().max(300).optional(),
	longDescription: z.string().trim().max(2000).optional(),
	displayOrder: z.number().int().min(0).default(0),
})

export async function upsertSkillCategoryAction(payload: unknown) {
	await requireAdminUserId()

	const parsed = schema.safeParse(payload)
	if (!parsed.success) {
		return {
			ok: false as const,
			message: parsed.error.issues[0]?.message ?? 'Invalid category payload.',
		}
	}

	const supabase = await getSupabaseServerClient()
	const row = {
		id: parsed.data.id,
		slug: parsed.data.slug,
		name: parsed.data.name,
		emoji: parsed.data.emoji ?? null,
		theme_key: parsed.data.themeKey ?? null,
		short_description: parsed.data.shortDescription ?? null,
		long_description: parsed.data.longDescription ?? null,
		display_order: parsed.data.displayOrder,
		is_active: true,
	}

	const res = await supabase
		.from('skill_categories')
		.upsert(row, { onConflict: 'id', ignoreDuplicates: false })

	if (res.error) {
		return {
			ok: false as const,
			message: res.error.message,
		}
	}

	return {
		ok: true as const,
		message: 'Category saved.',
	}
}
