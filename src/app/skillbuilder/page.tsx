import type { Metadata } from 'next'
import SkillbuilderDashboard from './skillbuilder-dashboard'

export const metadata: Metadata = {
	title: 'Skillbuilder | AWS Learning Club - Alpha',
	description:
		'Track your progress through AWS SkillBuilder Challenge modules across all department tracks.',
}

export default function SkillbuilderPage() {
	return <SkillbuilderDashboard />
}
