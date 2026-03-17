import type { Metadata } from 'next'
import SkillbuilderDashboard from './skillbuilder-dashboard'
import { requireUser, getUserRole } from '@/services/auth.service'
import { getSkillbuilderSnapshot } from '@/services/skillbuilder.service'

export const metadata: Metadata = {
	title: 'Skillbuilder | AWS Learning Club - Alpha',
	description:
		'Track your progress through AWS SkillBuilder Challenge modules across all department tracks.',
}

export default async function SkillbuilderPage() {
	const user = await requireUser('/skillbuilder')
	const [snapshot, role] = await Promise.all([
		getSkillbuilderSnapshot(user.id),
		getUserRole(user.id),
	])

	return (
		<SkillbuilderDashboard
			initialSnapshot={snapshot}
			userEmail={user.email ?? ''}
		/>
	)
}
