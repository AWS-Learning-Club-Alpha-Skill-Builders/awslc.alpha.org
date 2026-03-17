'use server'

import { z } from 'zod'
import { requireSuperAdminUserId } from '@/actions/_auth-guards'
import { getSupabaseAdminClient } from '@/services/supabase-admin.service'

const schema = z.object({
	memberId: z.string().uuid(),
	categoryId: z.string().uuid(),
})

export async function enrollMemberAction(
	memberId: string,
	categoryId: string,
) {
	const parsed = schema.safeParse({ memberId, categoryId })
	if (!parsed.success) {
		return { ok: false as const, message: 'Invalid input.' }
	}

	const adminUserId = await requireSuperAdminUserId()
	const supabase = getSupabaseAdminClient()

	const { error } = await supabase
		.from('member_enrollments')
		.upsert(
			{
				user_id: parsed.data.memberId,
				category_id: parsed.data.categoryId,
				enrolled_by: adminUserId,
			},
			{ onConflict: 'user_id,category_id' },
		)

	if (error) {
		return { ok: false as const, message: error.message }
	}

	return { ok: true as const, message: 'Enrolled.' }
}

export async function unenrollMemberAction(
	memberId: string,
	categoryId: string,
) {
	const parsed = schema.safeParse({ memberId, categoryId })
	if (!parsed.success) {
		return { ok: false as const, message: 'Invalid input.' }
	}

	await requireSuperAdminUserId()
	const supabase = getSupabaseAdminClient()

	const { error } = await supabase
		.from('member_enrollments')
		.delete()
		.eq('user_id', parsed.data.memberId)
		.eq('category_id', parsed.data.categoryId)

	if (error) {
		return { ok: false as const, message: error.message }
	}

	return { ok: true as const, message: 'Unenrolled.' }
}
