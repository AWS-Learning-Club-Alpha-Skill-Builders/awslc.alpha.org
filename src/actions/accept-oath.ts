'use server'

import { requireAuthenticatedUserId } from './_auth-guards'
import { getSupabaseServerClient } from '@/services/supabase-server.service'

export async function acceptOathAction(): Promise<{
	ok: boolean
	message: string
}> {
	const userId = await requireAuthenticatedUserId()
	const supabase = await getSupabaseServerClient()

	const { error } = await supabase
		.from('profiles')
		.update({
			has_accepted_oath: true,
			updated_at: new Date().toISOString(),
		})
		.eq('id', userId)

	if (error) {
		return {
			ok: false,
			message: 'Failed to save your agreement. Please try again.',
		}
	}

	return {
		ok: true,
		message: 'Agreement accepted.',
	}
}
