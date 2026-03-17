import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/services/supabase-server.service'
import { getSupabaseAdminClient } from '@/services/supabase-admin.service'

export async function GET(request: Request) {
	const requestUrl = new URL(request.url)
	const code = requestUrl.searchParams.get('code')
	const next = requestUrl.searchParams.get('next')

	if (!code) {
		return NextResponse.redirect(
			new URL('/auth/login', requestUrl.origin),
		)
	}

	const supabase = await getSupabaseServerClient()
	const { error } =
		await supabase.auth.exchangeCodeForSession(code)

	if (error) {
		return NextResponse.redirect(
			new URL('/auth/login', requestUrl.origin),
		)
	}

	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		return NextResponse.redirect(
			new URL('/auth/login', requestUrl.origin),
		)
	}

	const userEmail = user.email?.toLowerCase() ?? ''

	// Auto-create profile if it doesn't exist yet
	const supabaseAdmin = getSupabaseAdminClient()
	const { data: existingProfile } = await supabaseAdmin
		.from('profiles')
		.select('id, is_approved')
		.eq('id', user.id)
		.maybeSingle()

	const superAdminEmails = (
		process.env.NEXT_PUBLIC_SUPERADMIN_EMAIL ?? ''
	)
		.toLowerCase()
		.split(',')
		.map((e) => e.trim())
		.filter(Boolean)

	const isSuperAdmin = superAdminEmails.includes(userEmail)

	if (!existingProfile) {
		// First sign-in: create profile
		// Super-admins are auto-approved, members are not
		await supabaseAdmin.from('profiles').insert({
			id: user.id,
			email: userEmail,
			full_name:
				user.user_metadata?.full_name ??
				user.user_metadata?.name ??
				null,
			avatar_url:
				user.user_metadata?.avatar_url ??
				user.user_metadata?.picture ??
				null,
			role: isSuperAdmin ? 'super-admin' : 'member',
			is_approved: isSuperAdmin,
		})
	}

	// Explicit next param takes priority
	if (next) {
		return NextResponse.redirect(
			new URL(next, requestUrl.origin),
		)
	}

	// Route by role
	const destination = isSuperAdmin
		? '/admin'
		: '/skillbuilder/dashboard'

	return NextResponse.redirect(
		new URL(destination, requestUrl.origin),
	)
}
