'use server'

import { getSupabaseServerClient } from '@/services/supabase-server.service'

/**
 * Verifies the user is enrolled in the category that
 * owns the given module. Returns `{ ok: true }` if
 * enrolled, otherwise `{ ok: false, message }`.
 */
export async function requireEnrollment(
	userId: string,
	moduleId: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
	const supabase = await getSupabaseServerClient()

	// Look up which category this module belongs to
	const moduleRes = await supabase
		.from('skill_modules')
		.select('category_id')
		.eq('id', moduleId)
		.maybeSingle()

	if (moduleRes.error || !moduleRes.data) {
		return {
			ok: false,
			message: 'Module not found.',
		}
	}

	const categoryId = moduleRes.data.category_id

	// Check if user is enrolled in that category
	const enrollmentRes = await supabase
		.from('member_enrollments')
		.select('id')
		.eq('user_id', userId)
		.eq('category_id', categoryId)
		.maybeSingle()

	if (enrollmentRes.error || !enrollmentRes.data) {
		return {
			ok: false,
			message:
				'You are not enrolled in this track.',
		}
	}

	return { ok: true }
}
