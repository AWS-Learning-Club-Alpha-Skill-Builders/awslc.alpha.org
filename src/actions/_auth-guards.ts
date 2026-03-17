'use server'

import { getCurrentUser } from '@/services/auth.service'

export async function requireAuthenticatedUserId() {
	const user = await getCurrentUser()
	if (!user) {
		throw new Error('You must be signed in to perform this action.')
	}
	return user.id
}

function isSuperAdminEmail(email: string): boolean {
	const allowed = (
		process.env.NEXT_PUBLIC_SUPERADMIN_EMAIL ?? ''
	)
		.toLowerCase()
		.split(',')
		.map((e) => e.trim())
		.filter(Boolean)
	return allowed.includes(email.toLowerCase())
}

export async function requireAdminUserId() {
	const user = await getCurrentUser()
	if (!user?.email) {
		throw new Error('You must be signed in to perform this action.')
	}
	if (!isSuperAdminEmail(user.email)) {
		throw new Error('Only admins can perform this action.')
	}
	return user.id
}

export async function requireSuperAdminUserId() {
	const user = await getCurrentUser()
	if (!user?.email) {
		throw new Error('You must be signed in to perform this action.')
	}
	if (!isSuperAdminEmail(user.email)) {
		throw new Error(
			'Only super-admins can perform this action.',
		)
	}
	return user.id
}
