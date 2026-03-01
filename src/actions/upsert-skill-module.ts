'use server'

import { z } from 'zod'
import { requireAdminUserId } from '@/actions/_auth-guards'
import { getSupabaseServerClient } from '@/services/supabase-server.service'

const schema = z.object({
	id: z.string().uuid().optional(),
	categoryId: z.string().uuid(),
	slug: z
		.string()
		.trim()
		.min(2)
		.max(120)
		.regex(/^[a-z0-9-]+$/),
	title: z.string().trim().min(2).max(200),
	nextworkUrl: z.string().url().max(2048),
	description: z.string().trim().max(1000).optional(),
	displayOrder: z.number().int().min(0).default(0),
	verificationHints: z.array(z.string().trim().min(1).max(100)).default([]),
})

export async function upsertSkillModuleAction(payload: unknown) {
	await requireAdminUserId()

	const parsed = schema.safeParse(payload)
	if (!parsed.success) {
		return {
			ok: false as const,
			message: parsed.error.issues[0]?.message ?? 'Invalid module payload.',
		}
	}

	const supabase = await getSupabaseServerClient()
	const row = {
		id: parsed.data.id,
		category_id: parsed.data.categoryId,
		slug: parsed.data.slug,
		title: parsed.data.title,
		nextwork_url: parsed.data.nextworkUrl,
		description: parsed.data.description ?? null,
		display_order: parsed.data.displayOrder,
		verification_hints: parsed.data.verificationHints,
		is_active: true,
	}

	const res = await supabase
		.from('skill_modules')
		.upsert(row, { onConflict: 'id', ignoreDuplicates: false })

	if (res.error) {
		return {
			ok: false as const,
			message: res.error.message,
		}
	}

	return {
		ok: true as const,
		message: 'Module saved.',
	}
}
