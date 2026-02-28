import { useState, useEffect } from 'react'

export type ModuleStatus = 'todo' | 'in-progress' | 'done'

export interface ModuleProgress {
	status: ModuleStatus
}

type ProgressMap = Record<string, ModuleProgress>

const STORAGE_KEY = 'awslc-skillbuilder-progress'

const DEFAULT_PROGRESS: ModuleProgress = { status: 'todo' }

export function useSkillbuilder() {
	const [progress, setProgress] = useState<ProgressMap>({})

	useEffect(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY)
			if (stored) {
				const parsed = JSON.parse(stored) as Record<string, { status?: string }>
				const normalized: ProgressMap = {}
				for (const [id, obj] of Object.entries(parsed)) {
					const s = obj?.status
					normalized[id] = {
						status: (s === 'todo' || s === 'in-progress' || s === 'done'
							? s
							: 'todo') as ModuleStatus,
					}
				}
				setProgress(normalized)
			}
		} catch {
			// ignore malformed storage
		}
	}, [])

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
		} catch {
			// ignore storage errors (private browsing, quota)
		}
	}, [progress])

	function updateStatus(moduleId: string, status: ModuleStatus): void {
		setProgress((prev) => ({
			...prev,
			[moduleId]: { status },
		}))
	}

	function getModuleProgress(moduleId: string): ModuleProgress {
		const p = progress[moduleId]
		return p ? { status: p.status } : DEFAULT_PROGRESS
	}

	return { progress, updateStatus, getModuleProgress }
}
