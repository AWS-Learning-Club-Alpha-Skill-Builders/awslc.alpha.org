'use server'

import { z } from 'zod'
import { requireSuperAdminUserId } from '@/actions/_auth-guards'
import { getSupabaseAdminClient } from '@/services/supabase-admin.service'

const schema = z.object({
	memberId: z.string().uuid(),
})

export async function deleteMemberAction(memberId: string) {
	const parsed = schema.safeParse({ memberId })
	if (!parsed.success) {
		return {
			ok: false as const,
			message: 'Invalid input.',
		}
	}

	await requireSuperAdminUserId()
	const supabaseAdmin = getSupabaseAdminClient()
	const id = parsed.data.memberId

	// Delete related data first
	await supabaseAdmin
		.from('module_submissions')
		.delete()
		.eq('member_id', id)

	await supabaseAdmin
		.from('module_progress')
		.delete()
		.eq('member_id', id)

	await supabaseAdmin
		.from('member_enrollments')
		.delete()
		.eq('member_id', id)

	// Delete the profile
	const { error: profileError } = await supabaseAdmin
		.from('profiles')
		.delete()
		.eq('id', id)

	if (profileError) {
		return {
			ok: false as const,
			message: profileError.message,
		}
	}

	// Delete the auth user
	const { error: authError } =
		await supabaseAdmin.auth.admin.deleteUser(id)

	if (authError) {
		return {
			ok: false as const,
			message: `Profile deleted but auth cleanup failed: ${authError.message}`,
		}
	}

	return {
		ok: true as const,
		message: 'Member deleted successfully.',
	}
}
