export interface AdminOverviewStats {
	totalMembers: number
	newMembersThisWeek: number
	pendingApprovals: number
	totalModules: number
	totalCategories: number
	completionRate: number
	totalCompleted: number
	totalInProgress: number
	activeMembersCount: number
}

export interface LeaderboardEntry {
	userId: string
	email: string
	fullName: string | null
	avatarUrl: string | null
	modulesCompleted: number
	modulesInProgress: number
	totalModules: number
	completionRate: number
	lastActiveAt: string | null
}

export interface MemberRow {
	id: string
	email: string
	fullName: string | null
	avatarUrl: string | null
	role: string
	isApproved: boolean
	createdAt: string
	modulesCompleted: number
	modulesInProgress: number
}

export interface CategoryCompletionStat {
	categoryName: string
	emoji: string
	themeKey: string
	completed: number
	inProgress: number
	total: number
}

export interface WeeklyActivityPoint {
	week: string
	completions: number
}
