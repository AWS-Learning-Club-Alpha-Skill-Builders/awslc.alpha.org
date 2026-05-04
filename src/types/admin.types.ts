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
	hasAcceptedOath: boolean
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

export interface SubmittedDocumentMember {
	id: string
	email: string
	fullName: string | null
	avatarUrl: string | null
	role: 'member' | 'admin' | 'super-admin'
	isApproved: boolean
	hasAcceptedOath: boolean
	createdAt: string
}

export interface SubmittedDocumentCategory {
	id: string
	name: string
	emoji: string
	themeKey: string
	displayOrder: number
}

export interface SubmittedDocumentModule {
	id: string
	title: string
	slug: string
	nextworkUrl: string
	categoryId: string
	categoryName: string
	categoryEmoji: string
	categoryThemeKey: string
	categoryDisplayOrder: number
	displayOrder: number
}

export interface SubmittedDocumentProgress {
	status: 'todo' | 'in-progress' | 'done'
	startedAt: string | null
	completedAt: string | null
	createdAt: string
	updatedAt: string
}

export interface SubmittedDocumentRow {
	submissionId: string
	submittedAt: string
	updatedAt: string
	documentationUrl: string
	verificationStatus: 'pending' | 'verified' | 'failed'
	verificationReason: string | null
	verifiedAt: string | null
	member: SubmittedDocumentMember
	module: SubmittedDocumentModule
	progress: SubmittedDocumentProgress | null
	isVisibleByDefault: boolean
}

export interface SubmittedDocumentsStats {
	totalSubmissions: number
	visibleSubmissions: number
	hiddenSubmissions: number
	verifiedSubmissions: number
	failedSubmissions: number
	pendingSubmissions: number
	totalMembersWithSubmissions: number
	eligibleMembersWithSubmissions: number
}

export interface SubmittedDocumentsBundle {
	submissions: SubmittedDocumentRow[]
	stats: SubmittedDocumentsStats
}
