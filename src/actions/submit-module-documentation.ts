'use server'

import { z } from 'zod'
import { requireAuthenticatedUserId } from '@/actions/_auth-guards'
import { requireEnrollment } from '@/actions/_enrollment-guard'
import { getSupabaseServerClient } from '@/services/supabase-server.service'
import { verifyNextworkDocumentation } from '@/services/verification.service'

function toStringArray(value: unknown): string[] {
	if (!Array.isArray(value)) {
		return []
	}
	return value.filter((item): item is string => typeof item === 'string')
}

const payloadSchema = z.object({
	moduleId: z.string().uuid(),
	documentationUrl: z.string().url().max(2048),
})

export async function submitModuleDocumentationAction(
	moduleIdInput: string,
	documentationUrlInput: string,
) {
	const parsed = payloadSchema.safeParse({
		moduleId: moduleIdInput,
		documentationUrl: documentationUrlInput.trim(),
	})

	if (!parsed.success) {
		return {
			ok: false as const,
			message: parsed.error.issues[0]?.message ?? 'Invalid submission payload.',
		}
	}

	const userId = await requireAuthenticatedUserId()

	const enrolled = await requireEnrollment(
		userId,
		parsed.data.moduleId,
	)
	if (!enrolled.ok) {
		return enrolled
	}

	const supabase = await getSupabaseServerClient()

	const moduleRes = await supabase
		.from('skill_modules')
		.select('id, title, slug, nextwork_url, verification_hints')
		.eq('id', parsed.data.moduleId)
		.eq('is_active', true)
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
		verificationHints: toStringArray(moduleRes.data.verification_hints),
		documentationUrl: parsed.data.documentationUrl,
	})

	const submissionRes = await supabase.from('module_submissions').insert({
		user_id: userId,
		module_id: parsed.data.moduleId,
		documentation_url: parsed.data.documentationUrl,
		verification_status: verification.isVerified ? 'verified' : 'failed',
		verification_reason: verification.reason,
		verified_at: verification.isVerified ? new Date().toISOString() : null,
	})

	if (submissionRes.error) {
		return {
			ok: false as const,
			message: submissionRes.error.message,
		}
	}

	if (!verification.isVerified) {
		await supabase.from('module_progress').upsert(
			{
				user_id: userId,
				module_id: parsed.data.moduleId,
				status: 'in-progress',
				started_at: new Date().toISOString(),
			},
			{ onConflict: 'user_id,module_id' },
		)

		return {
			ok: false as const,
			message: verification.reason,
		}
	}

	const progressRes = await supabase.from('module_progress').upsert(
		{
			user_id: userId,
			module_id: parsed.data.moduleId,
			status: 'done',
			completed_at: new Date().toISOString(),
			started_at: new Date().toISOString(),
		},
		{ onConflict: 'user_id,module_id' },
	)

	if (progressRes.error) {
		return {
			ok: false as const,
			message: progressRes.error.message,
		}
	}

	return {
		ok: true as const,
		message: 'Submission verified and module marked done.',
	}
}
