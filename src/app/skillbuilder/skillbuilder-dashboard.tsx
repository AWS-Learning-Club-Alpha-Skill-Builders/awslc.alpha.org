'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, CalendarDays } from 'lucide-react'
import gsap from 'gsap'
import { cn } from '@/lib/utils'
import { TRACKS } from '@/data/skillbuilder'
import {
	useSkillbuilder,
	type ModuleStatus,
} from '@/hooks/use-skillbuilder'
import { Footer } from '@/app/(landing)'

const STATUS_CYCLE: ModuleStatus[] = ['todo', 'in-progress', 'done']

interface StatusConfig {
	label: string
	dot: string
	badge: string
}

const STATUS_CONFIG: Record<ModuleStatus, StatusConfig> = {
	'todo': {
		label: 'To Do',
		dot: 'bg-gray-400',
		badge: 'bg-gray-100 text-gray-600 border-gray-200',
	},
	'in-progress': {
		label: 'In Progress',
		dot: 'bg-[#ff9900]',
		badge: 'bg-orange-50 text-[#ff9900] border-orange-200',
	},
	'done': {
		label: 'Done',
		dot: 'bg-green-500',
		badge: 'bg-green-50 text-green-700 border-green-200',
	},
}

function ProgressBar({
	value,
	total,
	color = 'bg-[#ff9900]',
}: {
	value: number
	total: number
	color?: string
}) {
	const pct = total === 0 ? 0 : Math.round((value / total) * 100)
	return (
		<div className="flex items-center gap-3">
			<div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
				<div
					className={cn('h-full rounded-full transition-all duration-500', color)}
					style={{ width: `${pct}%` }}
				/>
			</div>
			<span className="text-xs text-muted-foreground tabular-nums w-10 text-right">
				{value}/{total}
			</span>
		</div>
	)
}

interface ModuleCardProps {
	name: string
	link: string
	status: ModuleStatus
	deadline?: string
	onCycleStatus: () => void
	onSetDeadline: (d: string) => void
}

function ModuleCard({
	name,
	link,
	status,
	deadline,
	onCycleStatus,
	onSetDeadline,
}: ModuleCardProps) {
	const [showDeadline, setShowDeadline] = useState(false)
	const cfg = STATUS_CONFIG[status]

	return (
		<div
			className={cn(
				'module-card group relative flex flex-col gap-3 rounded-xl border bg-white p-4',
				'hover:shadow-md transition-all duration-300',
				status === 'done'
					? 'border-green-200 bg-green-50/30'
					: status === 'in-progress'
						? 'border-orange-200'
						: 'border-border',
			)}
		>
			{/* Module name + external link */}
			<div className="flex items-start justify-between gap-2">
				<p
					className={cn(
						'text-sm font-medium leading-snug flex-1',
						status === 'done' && 'line-through text-muted-foreground',
					)}
				>
					{name}
				</p>
				<a
					href={link}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={`Open ${name}`}
					className="shrink-0 text-muted-foreground hover:text-[#ff9900] transition-colors mt-0.5"
				>
					<ExternalLink className="w-3.5 h-3.5" />
				</a>
			</div>

			{/* Status badge + deadline toggle */}
			<div className="flex items-center gap-2 mt-auto">
				<button
					onClick={onCycleStatus}
					className={cn(
						'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full',
						'border text-xs font-medium transition-all duration-200',
						'hover:opacity-80 active:scale-95 cursor-pointer',
						cfg.badge,
					)}
					aria-label={`Status: ${cfg.label}. Click to change.`}
				>
					<span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
					{cfg.label}
				</button>

				<button
					onClick={() => setShowDeadline((v) => !v)}
					className="ml-auto text-muted-foreground hover:text-[#ff9900] transition-colors"
					aria-label="Set deadline"
				>
					<CalendarDays className="w-3.5 h-3.5" />
				</button>
			</div>

			{/* Deadline input */}
			{showDeadline && (
				<div className="flex items-center gap-2">
					<input
						type="date"
						value={deadline ?? ''}
						onChange={(e) => onSetDeadline(e.target.value)}
						className={cn(
							'flex-1 text-xs border border-border rounded-md px-2 py-1',
							'focus:outline-none focus:ring-1 focus:ring-[#ff9900]',
							'text-foreground bg-white',
						)}
						aria-label="Deadline for this module"
					/>
					{deadline && (
						<button
							onClick={() => onSetDeadline('')}
							className="text-xs text-muted-foreground hover:text-destructive transition-colors"
							aria-label="Clear deadline"
						>
							Clear
						</button>
					)}
				</div>
			)}

			{deadline && !showDeadline && (
				<p className="text-[10px] text-muted-foreground">
					Due {new Date(deadline).toLocaleDateString('en-US', {
						month: 'short',
						day: 'numeric',
						year: 'numeric',
					})}
				</p>
			)}
		</div>
	)
}

export default function SkillbuilderDashboard() {
	const [activeTrackId, setActiveTrackId] = useState(TRACKS[0].id)
	const cardsRef = useRef<HTMLDivElement>(null)
	const { updateStatus, setDeadline, getModuleProgress } =
		useSkillbuilder()

	const activeTrack = TRACKS.find((t) => t.id === activeTrackId) ?? TRACKS[0]

	// Count totals
	const totalModules = TRACKS.reduce((sum, t) => sum + t.modules.length, 0)
	const totalDone = TRACKS.reduce(
		(sum, t) =>
			sum +
			t.modules.filter(
				(m) => getModuleProgress(m.id).status === 'done',
			).length,
		0,
	)

	const trackDone = activeTrack.modules.filter(
		(m) => getModuleProgress(m.id).status === 'done',
	).length

	// Animate cards on track change
	useEffect(() => {
		if (!cardsRef.current) return
		const cards = cardsRef.current.querySelectorAll<HTMLElement>('.module-card')
		gsap.fromTo(
			cards,
			{ opacity: 0, y: 16 },
			{
				opacity: 1,
				y: 0,
				duration: 0.35,
				stagger: 0.04,
				ease: 'power2.out',
				clearProps: 'all',
			},
		)
	}, [activeTrackId])

	const handleCycleStatus = useCallback(
		(moduleId: string, current: ModuleStatus) => {
			const idx = STATUS_CYCLE.indexOf(current)
			const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length]
			updateStatus(moduleId, next)
		},
		[updateStatus],
	)

	return (
		<main className="min-h-screen bg-background">
			{/* Header */}
			<section className="pt-12 pb-8 px-4 sm:px-6 lg:px-8 border-b border-border bg-white">
				<div className="container mx-auto max-w-6xl">
					<Link
						href="/"
						className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-[#ff9900] transition-colors mb-6"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to Home
					</Link>

					<div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
						<div className="flex-1">
							<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
								AWS Alpha{' '}
								<span className="text-[#ff9900]">Skillbuilder</span>
							</h1>
							<p className="text-muted-foreground text-base">
								Track your progress through the challenge modules
							</p>
						</div>
					</div>

					{/* Overall progress */}
					<div className="max-w-md">
						<div className="flex items-center justify-between mb-1.5">
							<span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
								Overall Progress
							</span>
							<span className="text-xs font-semibold text-[#ff9900]">
								{totalModules === 0
									? '0%'
									: `${Math.round((totalDone / totalModules) * 100)}%`}
							</span>
						</div>
						<ProgressBar value={totalDone} total={totalModules} />
					</div>
				</div>
			</section>

			{/* Track tabs */}
			<div className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-border">
				<div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
					<div className="flex gap-1 overflow-x-auto scrollbar-none py-2">
						{TRACKS.map((track) => {
							const done = track.modules.filter(
								(m) => getModuleProgress(m.id).status === 'done',
							).length
							const isActive = track.id === activeTrackId
							return (
								<button
									key={track.id}
									onClick={() => setActiveTrackId(track.id)}
									className={cn(
										'shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
										isActive
											? 'bg-[#ff9900] text-white shadow-sm'
											: 'text-muted-foreground hover:text-foreground hover:bg-gray-100',
									)}
								>
									<span aria-hidden="true">{track.emoji}</span>
									<span className="hidden sm:inline">{track.name}</span>
									<span className="sm:hidden">{track.name.split(' ')[0]}</span>
									{done > 0 && (
										<span
											className={cn(
												'text-[10px] rounded-full px-1.5 py-0.5 font-semibold',
												isActive
													? 'bg-white/20 text-white'
													: 'bg-green-100 text-green-700',
											)}
										>
											{done}/{track.modules.length}
										</span>
									)}
								</button>
							)
						})}
					</div>
				</div>
			</div>

			{/* Track content */}
			<section className="py-8 px-4 sm:px-6 lg:px-8">
				<div className="container mx-auto max-w-6xl">
					{/* Track header */}
					<div className="mb-6">
						<div className="flex items-center gap-2 mb-3">
							<span className="text-2xl" aria-hidden="true">
								{activeTrack.emoji}
							</span>
							<h2 className="text-xl font-bold text-foreground">
								{activeTrack.name}
							</h2>
						</div>
						<div className="max-w-xs">
							<div className="flex items-center justify-between mb-1.5">
								<span className="text-xs text-muted-foreground">
									Track progress
								</span>
								<span className="text-xs font-semibold text-green-600">
									{activeTrack.modules.length === 0
										? '0%'
										: `${Math.round((trackDone / activeTrack.modules.length) * 100)}%`}
								</span>
							</div>
							<ProgressBar
								value={trackDone}
								total={activeTrack.modules.length}
								color="bg-green-500"
							/>
						</div>
					</div>

					{/* Module cards grid */}
					<div
						ref={cardsRef}
						className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
					>
						{activeTrack.modules.map((mod) => {
							const prog = getModuleProgress(mod.id)
							return (
								<ModuleCard
									key={mod.id}
									name={mod.name}
									link={mod.link}
									status={prog.status}
									deadline={prog.deadline}
									onCycleStatus={() =>
										handleCycleStatus(mod.id, prog.status)
									}
									onSetDeadline={(d) => setDeadline(mod.id, d)}
								/>
							)
						})}
					</div>
				</div>
			</section>

			<Footer />
		</main>
	)
}
