import type { Metadata } from 'next'
import SkillbuilderDashboard from './skillbuilder-dashboard'
import PendingApproval from './pending-approval'
import {
	requireUser,
	getUserRole,
	getIsApproved,
} from '@/services/auth.service'
import { getSkillbuilderSnapshot } from '@/services/skillbuilder.service'

export const metadata: Metadata = {
	title: 'Dashboard | Skillbuilder | AWS Learning Club - Alpha',
	description:
		'Track your progress through AWS SkillBuilder Challenge modules across all department tracks.',
}

export default async function SkillbuilderDashboardPage() {
	const user = await requireUser('/skillbuilder/dashboard')
	const [isApproved, role] = await Promise.all([
		getIsApproved(user.id),
		getUserRole(user.id),
	])

	// Super-admins are always approved
	const superAdminEmails = (
		process.env.NEXT_PUBLIC_SUPERADMIN_EMAIL ?? ''
	)
		.toLowerCase()
		.split(',')
		.map((e) => e.trim())
		.filter(Boolean)

	const isSuperAdmin = superAdminEmails.includes(
		user.email?.toLowerCase() ?? '',
	)

	if (!isApproved && !isSuperAdmin) {
		return (
			<PendingApproval
				userEmail={user.email ?? ''}
			/>
		)
	}

	const snapshot = await getSkillbuilderSnapshot(user.id, isSuperAdmin)
	const initialAuth = {
		authenticated: true,
		label:
			user.user_metadata?.full_name ??
			user.user_metadata?.name ??
			user.email?.split('@')[0] ??
			'Account',
	}

	return (
		<SkillbuilderDashboard
			initialSnapshot={snapshot}
			userEmail={user.email ?? ''}
			initialAuth={initialAuth}
		/>
	)
}
