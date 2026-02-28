import { useState, useEffect } from 'react'

export type ModuleStatus = 'todo' | 'in-progress' | 'done'

export interface ModuleProgress {
	status: ModuleStatus
	deadline?: string
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
				setProgress(JSON.parse(stored) as ProgressMap)
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
			[moduleId]: { ...prev[moduleId] ?? DEFAULT_PROGRESS, status },
		}))
	}

	function setDeadline(moduleId: string, deadline: string): void {
		setProgress((prev) => ({
			...prev,
			[moduleId]: {
				...prev[moduleId] ?? DEFAULT_PROGRESS,
				deadline: deadline || undefined,
			},
		}))
	}

	function getModuleProgress(moduleId: string): ModuleProgress {
		return progress[moduleId] ?? DEFAULT_PROGRESS
	}

	return { progress, updateStatus, setDeadline, getModuleProgress }
}
