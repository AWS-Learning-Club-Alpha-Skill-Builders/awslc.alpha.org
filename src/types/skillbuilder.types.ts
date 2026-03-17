export type ModuleStatus = 'todo' | 'in-progress' | 'done'

export interface SkillModuleDto {
	id: string
	categoryId: string
	slug: string
	title: string
	nextworkUrl: string
	description: string
	displayOrder: number
	verificationHints: string[]
	status: ModuleStatus
}

export interface SkillCategoryDto {
	id: string
	slug: string
	name: string
	emoji: string
	themeKey: string
	shortDescription: string
	longDescription: string
	displayOrder: number
	modules: SkillModuleDto[]
}

export interface SkillbuilderSnapshot {
	categories: SkillCategoryDto[]
	totals: {
		categories: number
		modules: number
		done: number
		inProgress: number
		todo: number
	}
}
