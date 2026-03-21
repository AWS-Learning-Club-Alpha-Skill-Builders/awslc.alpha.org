import type { DriveStep, Config } from 'driver.js'

export const DRIVER_THEME: Config = {
	showProgress: true,
	animate: true,
	allowClose: true,
	overlayColor: 'rgba(0, 0, 0, 0.7)',
	stagePadding: 8,
	stageRadius: 12,
	popoverClass: 'admin-tour-popover',
	nextBtnText: 'Next',
	prevBtnText: 'Back',
	doneBtnText: 'Got it!',
	progressText: '{{current}} of {{total}}',
}

export const OVERVIEW_STEPS: DriveStep[] = [
	{
		element: '[data-tour="stat-cards"]',
		popover: {
			title: 'Quick Stats',
			description:
				'Key metrics at a glance — total members, pending approvals, modules completed, and overall completion rate.',
			side: 'bottom',
			align: 'center',
		},
	},
	{
		element: '[data-tour="charts"]',
		popover: {
			title: 'Activity Charts',
			description:
				'Track weekly module completions and see how each department track is performing.',
			side: 'top',
			align: 'center',
		},
	},
	{
		element: '[data-tour="top-members"]',
		popover: {
			title: 'Top Members',
			description:
				'A mini leaderboard showing the top 5 members. Click "View all" to see the full leaderboard.',
			side: 'top',
			align: 'center',
		},
	},
]

export const MEMBERS_STEPS: DriveStep[] = [
	{
		element: '[data-tour="invite-btn"]',
		popover: {
			title: 'Step 1: Invite Members',
			description:
				'Start here! Click to invite new members by email. They will receive a sign-up link to join the Skillbuilder.',
			side: 'left',
			align: 'center',
		},
	},
	{
		element: '[data-tour="member-tabs"]',
		popover: {
			title: 'Filter by Status',
			description:
				'Switch between All, Pending, and Approved tabs. The orange badge shows how many are waiting for your approval.',
			side: 'bottom',
			align: 'start',
		},
	},
	{
		element: '[data-tour="member-search"]',
		popover: {
			title: 'Search Members',
			description:
				'Type a name or email to quickly find a specific member.',
			side: 'bottom',
			align: 'start',
		},
	},
	{
		element: '[data-tour="member-table"]',
		popover: {
			title: 'Member Table',
			description:
				'View all members with their status, module progress, and join date.',
			side: 'top',
			align: 'center',
		},
	},
	{
		element: '[data-tour="approve-btn"]',
		popover: {
			title: 'Step 2: Approve Pending Members',
			description:
				'When a new member signs up, they appear as "Pending". Click the green Approve button to grant them access to the Skillbuilder.',
			side: 'left',
			align: 'center',
		},
	},
	{
		element: '[data-tour="enroll-btn"]',
		popover: {
			title: 'Step 3: Enroll in Tracks',
			description:
				'After approving a member, click this book icon to enroll them in learning tracks (Cloud, CyberSec, AI/ML, etc.). Members can only access tracks they are enrolled in.',
			side: 'left',
			align: 'center',
		},
	},
	{
		element: '[data-tour="revoke-btn"]',
		popover: {
			title: 'Revoke Access',
			description:
				'Temporarily remove a member\'s access. Their data is preserved and you can re-approve them later.',
			side: 'left',
			align: 'center',
		},
	},
	{
		element: '[data-tour="delete-btn"]',
		popover: {
			title: 'Delete Member',
			description:
				'Permanently remove a member and all their data. This cannot be undone — use with caution!',
			side: 'left',
			align: 'center',
		},
	},
]

export const SKILLBUILDER_STEPS: DriveStep[] = [
	{
		element: '[data-tour="sb-progress"]',
		popover: {
			title: 'Your Progress',
			description:
				'This shows your overall completion across all tracks — categories enrolled, total modules, how many are in progress, and how many you have completed.',
			side: 'bottom',
			align: 'center',
		},
	},
	{
		element: '[data-tour="sb-tracks"]',
		popover: {
			title: 'Learning Tracks',
			description:
				'These are your enrolled learning tracks. Click on any track card to expand it and see its modules. Locked tracks need admin enrollment.',
			side: 'top',
			align: 'center',
		},
	},
	{
		element: '[data-tour="sb-track-header"]',
		popover: {
			title: 'Expand a Track',
			description:
				'Click this card to expand it. You will see the track description, progress stats, and all the modules inside.',
			side: 'bottom',
			align: 'center',
		},
	},
	{
		element: '[data-tour="sb-module-card"]',
		popover: {
			title: 'Module Card',
			description:
				'Each module has a title, description, and status (To Do, In Progress, or Done). The external link icon opens the Nextwork page for this module.',
			side: 'top',
			align: 'center',
		},
	},
	{
		element: '[data-tour="sb-mark-btn"]',
		popover: {
			title: 'Step 1: Mark In Progress',
			description:
				'Click "Mark In Progress" to start working on a module. This changes the status and tracks your activity.',
			side: 'top',
			align: 'center',
		},
	},
	{
		element: '[data-tour="sb-nextwork-link"]',
		popover: {
			title: 'Step 2: Go to Nextwork',
			description:
				'Click this link icon to open the Nextwork page. Follow the instructions there, complete the activity, and copy your documentation URL.',
			side: 'left',
			align: 'center',
		},
	},
	{
		element: '[data-tour="sb-submit"]',
		popover: {
			title: 'Step 3: Submit Documentation',
			description:
				'Once a module is in progress, paste your Nextwork documentation link here and click "Submit Documentation". An admin will verify and mark it as done.',
			side: 'top',
			align: 'center',
		},
	},
	{
		element: '[data-tour="sb-leaderboard"]',
		popover: {
			title: 'Leaderboard',
			description:
				'See how you rank against other members! Rankings are based on modules completed.',
			side: 'top',
			align: 'center',
		},
	},
]

export const LEADERBOARD_STEPS: DriveStep[] = [
	{
		element: '[data-tour="lb-search"]',
		popover: {
			title: 'Search Leaderboard',
			description:
				'Search for a specific member by name or email.',
			side: 'bottom',
			align: 'start',
		},
	},
	{
		element: '[data-tour="lb-table"]',
		popover: {
			title: 'Rankings',
			description:
				'Members are ranked by modules completed. Top 3 get medal icons. You can also see their completion rate and last active time.',
			side: 'top',
			align: 'center',
		},
	},
]
