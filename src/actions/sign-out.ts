'use server'

import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/services/supabase-server.service'

export async function signOutAction() {
	const supabase = await getSupabaseServerClient()
	await supabase.auth.signOut()
	redirect('/skillbuilder')
}
