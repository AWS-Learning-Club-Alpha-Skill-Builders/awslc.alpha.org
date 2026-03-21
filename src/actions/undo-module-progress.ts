'use server'

import { z } from 'zod'
import { requireAuthenticatedUserId } from '@/actions/_auth-guards'
import { requireEnrollment } from '@/actions/_enrollment-guard'
import { getSupabaseServerClient } from '@/services/supabase-server.service'

const payloadSchema = z.object({
	moduleId: z.string().uuid(),
})

export async function undoModuleProgressAction(
	moduleIdInput: string,
) {
	const parsed = payloadSchema.safeParse({
		moduleId: moduleIdInput,
	})
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

	if (!currentRes.data) {
		return {
			ok: true as const,
			message: 'Module is already in To Do state.',
		}
	}

	if (currentRes.data.status === 'done') {
		return {
			ok: false as const,
			message: 'Cannot undo a completed module.',
		}
	}

	const deleteRes = await supabase
		.from('module_progress')
		.delete()
		.eq('user_id', userId)
		.eq('module_id', moduleId)

	if (deleteRes.error) {
		return {
			ok: false as const,
			message: deleteRes.error.message,
		}
	}

	return {
		ok: true as const,
		message: 'Module reverted to To Do.',
	}
}
