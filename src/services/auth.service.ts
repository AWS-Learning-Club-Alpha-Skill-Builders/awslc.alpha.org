import 'server-only'

import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/services/supabase-server.service'

export async function getCurrentUser() {
	const supabase = await getSupabaseServerClient()
	const { data, error } = await supabase.auth.getUser()

	if (error || !data.user) {
		return null
	}

	return data.user
}

export async function requireUser(redirectTo?: string) {
	const user = await getCurrentUser()

	if (!user) {
		const next = redirectTo ?? '/skillbuilder'
		redirect(`/auth/login?next=${encodeURIComponent(next)}`)
	}

	return user
}

export async function getUserRole(userId: string) {
	const supabase = await getSupabaseServerClient()
	const { data, error } = await supabase
		.from('profiles')
		.select('role')
		.eq('id', userId)
		.maybeSingle()

	if (error || !data) {
		return 'member' as const
	}

	return data.role
}
