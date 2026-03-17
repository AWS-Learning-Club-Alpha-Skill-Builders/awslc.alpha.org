'use server'

import { getSupabaseServerClient } from '@/services/supabase-server.service'

export async function signOutAction() {
	const supabase = await getSupabaseServerClient()
	await supabase.auth.signOut()
}
