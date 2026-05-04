'use server'

import { z } from 'zod'
import { requireSuperAdminUserId } from '@/actions/_auth-guards'
import { getSupabaseAdminClient } from '@/services/supabase-admin.service'
import { verifyNextworkDocumentation } from '@/services/verification.service'

function toStringArray(value: unknown): string[] {
	if (!Array.isArray(value)) {
		return []
	}
	return value.filter((item): item is string => typeof item === 'string')
}

const schema = z.object({
	submissionId: z.string().uuid(),
})

export async function reverifySubmissionAction(
	submissionId: string,
) {
	const parsed = schema.safeParse({ submissionId })
	if (!parsed.success) {
		return {
			ok: false as const,
			message:
				parsed.error.issues[0]?.message ??
				'Invalid submission payload.',
		}
	}

	await requireSuperAdminUserId()
	const supabase = getSupabaseAdminClient()
	const now = new Date().toISOString()

	const submissionRes = await supabase
		.from('module_submissions')
		.select(
			'id, user_id, module_id, documentation_url',
		)
		.eq('id', parsed.data.submissionId)
		.maybeSingle()

	if (submissionRes.error || !submissionRes.data) {
		return {
			ok: false as const,
			message:
				submissionRes.error?.message ?? 'Submission not found.',
		}
	}

	const moduleRes = await supabase
		.from('skill_modules')
		.select(
			'id, title, slug, nextwork_url, verification_hints',
		)
		.eq('id', submissionRes.data.module_id)
		.maybeSingle()

	if (moduleRes.error || !moduleRes.data) {
		return {
			ok: false as const,
			message: moduleRes.error?.message ?? 'Module not found.',
		}
	}

	const verification = await verifyNextworkDocumentation({
		moduleTitle: moduleRes.data.title,
		moduleSlug: moduleRes.data.slug,
		moduleUrl: moduleRes.data.nextwork_url,
		verificationHints: toStringArray(
			moduleRes.data.verification_hints,
		),
		documentationUrl: submissionRes.data.documentation_url,
	})

	const { error: submissionUpdateError } = await supabase
		.from('module_submissions')
		.update({
			verification_status: verification.isVerified
				? 'verified'
				: 'failed',
			verification_reason: verification.reason,
			verified_at: verification.isVerified ? now : null,
			updated_at: now,
		})
		.eq('id', parsed.data.submissionId)

	if (submissionUpdateError) {
		return {
			ok: false as const,
			message: submissionUpdateError.message,
		}
	}

	const { error: progressError } = await supabase
		.from('module_progress')
		.upsert(
			{
				user_id: submissionRes.data.user_id,
				module_id: submissionRes.data.module_id,
				status: verification.isVerified
					? 'done'
					: 'in-progress',
				started_at: now,
				completed_at: verification.isVerified ? now : null,
			},
			{ onConflict: 'user_id,module_id' },
		)

	if (progressError) {
		return {
			ok: false as const,
			message: progressError.message,
		}
	}

	return {
		ok: true as const,
		message: verification.reason,
	}
}
