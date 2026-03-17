'use server'

import { getCurrentUser, getUserRole } from '@/services/auth.service'

export async function requireAuthenticatedUserId() {
	const user = await getCurrentUser()
	if (!user) {
		throw new Error('You must be signed in to perform this action.')
	}
	return user.id
}

export async function requireAdminUserId() {
	const userId = await requireAuthenticatedUserId()
	const role = await getUserRole(userId)
	if (role !== 'admin') {
		throw new Error('Only admins can perform this action.')
	}
	return userId
}
