'use server'

import { z } from 'zod'
import { requireAuthenticatedUserId } from '@/actions/_auth-guards'
import { requireEnrollment } from '@/actions/_enrollment-guard'
import { getSupabaseServerClient } from '@/services/supabase-server.service'

const payloadSchema = z.object({
	moduleId: z.string().uuid(),
})

export async function startModuleAction(moduleIdInput: string) {
	const parsed = payloadSchema.safeParse({ moduleId: moduleIdInput })
	if (!parsed.success) {
		return {
			ok: false as const,
			message: 'Invalid module selected.',
		}
	}

	const userId = await requireAuthenticatedUserId()
	const moduleId = parsed.data.moduleId

	const enrolled = await requireEnrollment(
		userId,
		moduleId,
	)
	if (!enrolled.ok) {
		return enrolled
	}

	const supabase = await getSupabaseServerClient()

	const currentRes = await supabase
		.from('module_progress')
		.select('status')
		.eq('user_id', userId)
		.eq('module_id', moduleId)
		.maybeSingle()

	if (currentRes.error) {
		return {
			ok: false as const,
			message: currentRes.error.message,
		}
	}

	if (currentRes.data?.status === 'done') {
		return {
			ok: true as const,
			message: 'Module is already completed.',
		}
	}

	const upsertRes = await supabase.from('module_progress').upsert(
		{
			user_id: userId,
			module_id: moduleId,
			status: 'in-progress',
			started_at: new Date().toISOString(),
			completed_at: null,
		},
		{
			onConflict: 'user_id,module_id',
		},
	)

	if (upsertRes.error) {
		return {
			ok: false as const,
			message: upsertRes.error.message,
		}
	}

	return {
		ok: true as const,
		message: 'Module marked as in progress.',
	}
}
