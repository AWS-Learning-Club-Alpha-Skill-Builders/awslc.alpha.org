'use server'

import { z } from 'zod'
import { requireSuperAdminUserId } from '@/actions/_auth-guards'
import { getSupabaseAdminClient } from '@/services/supabase-admin.service'

const inviteSchema = z.object({
	email: z.string().email().max(255),
})

export async function inviteMemberAction(emailInput: string) {
	const parsed = inviteSchema.safeParse({ email: emailInput.trim().toLowerCase() })
	if (!parsed.success) {
		return {
			ok: false as const,
			message: parsed.error.issues[0]?.message ?? 'Invalid email',
		}
	}

	const adminUserId = await requireSuperAdminUserId()
	const supabaseAdmin = getSupabaseAdminClient()

	const inviteRecordResult = await supabaseAdmin.from('invites').upsert(
		{
			email: parsed.data.email,
			invited_by: adminUserId,
			status: 'pending',
		},
		{
			onConflict: 'email',
		},
	)

	if (inviteRecordResult.error) {
		return {
			ok: false as const,
			message: inviteRecordResult.error.message,
		}
	}

	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
	const inviteResult = await supabaseAdmin.auth.admin.inviteUserByEmail(parsed.data.email, {
		redirectTo: `${siteUrl}/auth/accept-invite`,
	})

	if (inviteResult.error) {
		return {
			ok: false as const,
			message: inviteResult.error.message,
		}
	}

	return {
		ok: true as const,
		message: 'Invite sent successfully.',
	}
}
