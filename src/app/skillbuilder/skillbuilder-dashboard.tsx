'use client'

import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
	ChevronDown,
	ExternalLink,
	CheckCircle2,
	Clock,
	Circle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { TRACKS, type TrackTheme, type SkillModule, type Track } from '@/data/skillbuilder'
import { Navigation, Footer } from '@/app/(landing)'

// ---------- Types ----------

type MockStatus = 'todo' | 'in-progress' | 'done'

interface TrackThemeConfig {
	headerGradient: string
	expandedBg: string
	accentText: string
	moduleBorderL: string
}

// ---------- Theme map ----------

const TRACK_THEMES: Record<TrackTheme, TrackThemeConfig> = {
	cloud: {
		headerGradient: 'from-sky-800 via-sky-600 to-blue-500',
		expandedBg: 'bg-sky-50/60',
		accentText: 'text-sky-700',
		moduleBorderL: 'border-l-sky-400',
	},
	cybersec: {
		headerGradient: 'from-rose-900 via-red-700 to-red-500',
		expandedBg: 'bg-red-50/60',
		accentText: 'text-red-700',
		moduleBorderL: 'border-l-red-400',
	},
	aiml: {
		headerGradient: 'from-violet-900 via-violet-700 to-purple-500',
		expandedBg: 'bg-violet-50/60',
		accentText: 'text-violet-700',
		moduleBorderL: 'border-l-violet-400',
	},
	data: {
		headerGradient: 'from-emerald-800 via-emerald-600 to-teal-500',
		expandedBg: 'bg-emerald-50/60',
		accentText: 'text-emerald-700',
		moduleBorderL: 'border-l-emerald-400',
	},
	swe: {
		headerGradient: 'from-indigo-900 via-indigo-700 to-blue-500',
		expandedBg: 'bg-indigo-50/60',
		accentText: 'text-indigo-700',
		moduleBorderL: 'border-l-indigo-400',
	},
	iot: {
		headerGradient: 'from-amber-800 via-orange-600 to-amber-400',
		expandedBg: 'bg-amber-50/60',
		accentText: 'text-amber-700',
		moduleBorderL: 'border-l-amber-400',
	},
	gamedev: {
		headerGradient: 'from-rose-800 via-pink-700 to-pink-400',
		expandedBg: 'bg-pink-50/60',
		accentText: 'text-pink-700',
		moduleBorderL: 'border-l-pink-400',
	},
	uiux: {
		headerGradient: 'from-yellow-700 via-yellow-500 to-amber-400',
		expandedBg: 'bg-yellow-50/60',
		accentText: 'text-yellow-700',
		moduleBorderL: 'border-l-yellow-400',
	},
}

// ---------- Deterministic mock status ----------

function getMockStatus(moduleIndex: number): MockStatus {
	const r = moduleIndex % 5
	if (r === 0) return 'done'
	if (r === 1) return 'in-progress'
	return 'todo'
}

// ---------- Status config ----------

const STATUS_CONFIG: Record<
	MockStatus,
	{ label: string; iconClass: string; textClass: string }
> = {
	'todo': {
		label: 'To Do',
		iconClass: 'text-gray-400',
		textClass: 'text-gray-400',
	},
	'in-progress': {
		label: 'In Progress',
		iconClass: 'text-[#ff9900]',
		textClass: 'text-[#ff9900]',
	},
	'done': {
		label: 'Done',
		iconClass: 'text-green-500',
		textClass: 'text-green-600',
	},
}

// ---------- Module card ----------

function ModuleCard({
	module,
	moduleIndex,
	theme,
}: {
	module: SkillModule
	moduleIndex: number
	theme: TrackThemeConfig
}) {
	const status = getMockStatus(moduleIndex)
	const cfg = STATUS_CONFIG[status]

	const StatusIcon =
		status === 'done'
			? CheckCircle2
			: status === 'in-progress'
				? Clock
				: Circle

	return (
		<article
			data-module-card
			className={cn(
				'group relative flex flex-col gap-3 rounded-xl border bg-white',
				'p-4 border-l-[3px] hover:shadow-md transition-all duration-300',
				theme.moduleBorderL,
			)}
		>
			{/* Status icon — top-right, non-functional visual only */}
			<div className="absolute top-3.5 right-3.5" aria-hidden="true">
				<StatusIcon className={cn('w-4 h-4', cfg.iconClass)} />
			</div>

			{/* Module name */}
			<p
				className={cn(
					'text-sm font-semibold leading-snug pr-7',
					status === 'done' && 'line-through text-muted-foreground',
				)}
			>
				{module.name}
			</p>

			{/* Module description */}
			<p className="text-xs text-muted-foreground leading-relaxed flex-1">
				{module.description}
			</p>

			{/* Footer: status label + link */}
			<div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
				<span
					className={cn(
						'inline-flex items-center gap-1.5 text-xs font-medium',
						cfg.textClass,
					)}
					aria-label={`Status: ${cfg.label}`}
				>
					<StatusIcon className={cn('w-3 h-3 shrink-0', cfg.iconClass)} aria-hidden="true" />
					{cfg.label}
				</span>
				<a
					href={module.link}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={`Open ${module.name}`}
					className="text-muted-foreground hover:text-accent transition-colors"
					onClick={(e) => {
						if (module.link === '#') e.preventDefault()
					}}
				>
					<ExternalLink className="w-3.5 h-3.5" />
				</a>
			</div>
		</article>
	)
}

// ---------- Category accordion card ----------

function CategoryCard({
	track,
	isOpen,
	onToggle,
}: {
	track: Track
	isOpen: boolean
	onToggle: () => void
}) {
	const theme = TRACK_THEMES[track.themeKey]
	const modulesGridRef = useRef<HTMLDivElement>(null)

	// Stagger-animate module cards when accordion opens — pre-hide to prevent flash
	useEffect(() => {
		if (!modulesGridRef.current) return
		const cards = modulesGridRef.current.querySelectorAll('[data-module-card]')

		if (!isOpen) {
			// Reset so they're ready for next open
			gsap.set(cards, { opacity: 0, y: 20 })
			return
		}

		gsap.to(cards, {
			opacity: 1,
			y: 0,
			duration: 0.4,
			stagger: 0.05,
			ease: 'power2.out',
			delay: 0.22,
		})
	}, [isOpen])

	const doneCount = track.modules.filter((_, i) => getMockStatus(i) === 'done').length
	const inProgressCount = track.modules.filter((_, i) => getMockStatus(i) === 'in-progress').length
	const todoCount = track.modules.filter((_, i) => getMockStatus(i) === 'todo').length
	const total = track.modules.length
	const pct = total === 0 ? 0 : Math.round((doneCount / total) * 100)

	return (
		<div
			data-category-card
			className={cn(
				'rounded-2xl overflow-hidden border border-white/10 shadow-sm',
				'transition-shadow duration-300',
				isOpen && 'shadow-xl',
			)}
		>
			{/* Card header — always visible, acts as toggle button */}
			<button
				onClick={onToggle}
				aria-expanded={isOpen}
				aria-controls={`track-panel-${track.id}`}
				className={cn(
					'w-full text-left relative overflow-hidden',
					'bg-gradient-to-r px-6 py-5',
					'flex items-center gap-5',
					'transition-all duration-300 hover:brightness-110',
					theme.headerGradient,
				)}
			>
				{/* Decorative emoji watermark */}
				<span
					className="absolute right-16 top-1/2 -translate-y-1/2 text-[5rem] opacity-[0.08] select-none pointer-events-none leading-none"
					aria-hidden="true"
				>
					{track.emoji}
				</span>

				{/* Emoji icon */}
				<span className="text-4xl shrink-0 drop-shadow-sm" aria-hidden="true">
					{track.emoji}
				</span>

				{/* Track info + progress */}
				<div className="flex-1 min-w-0">
					<h2 className="text-lg font-bold text-white leading-tight">
						{track.name}
					</h2>
					<p className="text-sm text-white/75 mt-0.5 line-clamp-1 hidden sm:block">
						{track.shortDescription}
					</p>

					{/* Inline progress bar */}
					<div className="mt-3 flex items-center gap-3 max-w-xs">
						<div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
							<div
								className="h-full bg-white/90 rounded-full transition-all duration-700"
								style={{ width: `${pct}%` }}
							/>
						</div>
						<span className="text-xs text-white/70 tabular-nums shrink-0">
							{doneCount}/{total}
						</span>
					</div>
				</div>

				{/* Percent + chevron */}
				<div className="flex flex-col items-end gap-2 shrink-0 z-10">
					<span className="text-2xl font-bold text-white tabular-nums">
						{pct}%
					</span>
					<ChevronDown
						className={cn(
							'w-5 h-5 text-white/80 transition-transform duration-300',
							isOpen && 'rotate-180',
						)}
					/>
				</div>
			</button>

			{/* Expandable panel — CSS grid trick for smooth animation */}
			<div
				id={`track-panel-${track.id}`}
				role="region"
				aria-labelledby={`track-${track.id}`}
				className={cn(
					'grid transition-all duration-500 ease-in-out',
					isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
				)}
			>
				<div className={cn('overflow-hidden', theme.expandedBg)}>
					<div className="px-6 py-7">
						{/* Long description */}
						<p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-2xl italic">
							{track.longDescription}
						</p>

						{/* Progress stats row */}
						<div className="flex flex-wrap items-center gap-4 mb-7">
							<div className="flex items-center gap-1.5 text-sm">
								<CheckCircle2 className="w-4 h-4 text-green-500" aria-hidden="true" />
								<span className={cn('font-semibold', theme.accentText)}>
									{doneCount}
								</span>
								<span className="text-muted-foreground">completed</span>
							</div>
							<div className="flex items-center gap-1.5 text-sm">
								<Clock className="w-4 h-4 text-[#ff9900]" aria-hidden="true" />
								<span className="font-semibold text-[#ff9900]">{inProgressCount}</span>
								<span className="text-muted-foreground">in progress</span>
							</div>
							<div className="flex items-center gap-1.5 text-sm">
								<Circle className="w-4 h-4 text-gray-400" aria-hidden="true" />
								<span className="font-semibold text-gray-500">{todoCount}</span>
								<span className="text-muted-foreground">to do</span>
							</div>
						</div>

					{/* Module cards grid */}
					<div ref={modulesGridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{track.modules.map((mod, i) => (
							<ModuleCard
								key={mod.id}
								module={mod}
								moduleIndex={i}
								theme={theme}
							/>
						))}
					</div>
					</div>
				</div>
			</div>
		</div>
	)
}

// ---------- Main dashboard ----------

export default function SkillbuilderDashboard() {
	const [openTrackId, setOpenTrackId] = useState<string | null>(null)
	const heroRef = useRef<HTMLElement>(null)
	const tracksRef = useRef<HTMLDivElement>(null)

	function handleToggle(trackId: string) {
		setOpenTrackId((prev) => (prev === trackId ? null : trackId))
	}

	const totalModules = TRACKS.reduce((sum, t) => sum + t.modules.length, 0)
	const totalDone = TRACKS.reduce(
		(sum, t) =>
			sum + t.modules.filter((_, i) => getMockStatus(i) === 'done').length,
		0,
	)
	const overallPct = totalModules === 0 ? 0 : Math.round((totalDone / totalModules) * 100)

	// Register GSAP plugin client-side only
	useEffect(() => {
		gsap.registerPlugin(ScrollTrigger)
	}, [])

	// Hero entrance animation — use direct element refs to guarantee targeting.
	// Delay accounts for the PageLoader (text 0.6s + bar 1.0s + slide 0.8s + exit 0.3s ≈ 2.3s).
	// On subsequent client-side navigations the loader is gone, so delay resolves to 0.
	useEffect(() => {
		if (!heroRef.current) return
		const el = heroRef.current

		const badge    = el.querySelector('[data-hero-badge]')
		const title    = el.querySelector('[data-hero-title]')
		const subtitle = el.querySelector('[data-hero-subtitle]')
		const progress = el.querySelector('[data-hero-progress]')
		const copy     = el.querySelectorAll('[data-hero-copy]')

		if (!badge || !title || !subtitle || !progress) return

		gsap.set(badge,    { opacity: 0, y: 20 })
		gsap.set(title,    { opacity: 0, y: 30 })
		gsap.set(subtitle, { opacity: 0, y: 20 })
		gsap.set(progress, { opacity: 0, y: 24 })
		gsap.set(copy,     { opacity: 0, y: 24 })

		const LOADER_MS = 2300
		const elapsedMs = performance.now()
		const delayS = Math.max(0, (LOADER_MS - elapsedMs) / 1000)

		const tl = gsap.timeline({ delay: delayS, defaults: { ease: 'power2.out' } })
			.to(badge,    { opacity: 1, y: 0, duration: 0.6 })
			.to(title,    { opacity: 1, y: 0, duration: 0.6 }, '-=0.35')
			.to(subtitle, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
			.to(progress, { opacity: 1, y: 0, duration: 0.6 }, '-=0.25')
			.to(copy,     { opacity: 1, y: 0, duration: 0.5, stagger: 0.14 }, '-=0.3')

		return () => { tl.kill() }
	}, [])

	// Category cards scroll-reveal — direct element refs to guarantee targeting
	useEffect(() => {
		if (!tracksRef.current) return
		const cards = Array.from(
			tracksRef.current.querySelectorAll('[data-category-card]'),
		)
		if (cards.length === 0) return

		gsap.set(cards, { opacity: 0, y: 40 })

		const triggers = ScrollTrigger.batch(cards, {
			onEnter: (elements) => {
				gsap.to(elements, {
					opacity: 1,
					y: 0,
					duration: 0.55,
					stagger: 0.08,
					ease: 'power2.out',
				})
			},
			start: 'top 88%',
			once: true,
		})

		return () => { triggers.forEach((t) => t.kill()) }
	}, [])

	return (
		<>
			<Navigation />

			<main className="min-h-screen bg-[#f0f4f8]">
				{/* Hero section */}
				<section
					ref={heroRef}
					data-theme="dark"
					className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-[#232f3e] via-[#1a2535] to-[#0d1117]"
				>
					{/* Dot grid background pattern */}
					<div
						className="absolute inset-0 opacity-20 pointer-events-none"
						style={{
							backgroundImage:
								'radial-gradient(circle at 1px 1px, rgba(255,153,0,0.4) 1px, transparent 0)',
							backgroundSize: '32px 32px',
						}}
						aria-hidden="true"
					/>

					<div className="container mx-auto max-w-6xl relative">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
							{/* Left column: title + overall progress */}
							<div>
							<div data-hero-badge className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff9900]/10 border border-[#ff9900]/30 mb-6">
								<span className="w-1.5 h-1.5 rounded-full bg-[#ff9900]" aria-hidden="true" />
								<span className="text-[#ff9900] text-xs font-semibold uppercase tracking-wider">
									AWS Alpha Program
								</span>
							</div>

							<h1 data-hero-title className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
								AWS Alpha{' '}
								<span className="text-[#ff9900]">Skillbuilder</span>
							</h1>

							<p data-hero-subtitle className="text-white/60 text-base mb-10">
								Explore tracks, expand categories, and start building cloud skills
							</p>

							{/* Overall progress card */}
							<div data-hero-progress className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
									<div className="flex items-end justify-between mb-3">
										<span className="text-white/50 text-xs font-medium uppercase tracking-wider">
											Overall Progress
										</span>
										<span className="text-3xl font-bold text-white tabular-nums">
											{overallPct}%
										</span>
									</div>

									{/* Main progress bar */}
									<div className="h-2.5 bg-white/10 rounded-full overflow-hidden mb-5">
										<div
											className="h-full bg-[#ff9900] rounded-full transition-all duration-700"
											style={{ width: `${overallPct}%` }}
										/>
									</div>

									{/* Stats grid */}
									<div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
										<div>
											<div className="text-xl font-bold text-white tabular-nums">
												{TRACKS.length}
											</div>
											<div className="text-white/40 text-xs mt-0.5">Tracks</div>
										</div>
										<div>
											<div className="text-xl font-bold text-white tabular-nums">
												{totalModules}
											</div>
											<div className="text-white/40 text-xs mt-0.5">Modules</div>
										</div>
										<div>
											<div className="text-xl font-bold text-green-400 tabular-nums">
												{totalDone}
											</div>
											<div className="text-white/40 text-xs mt-0.5">Completed</div>
										</div>
									</div>
								</div>
							</div>

						{/* Right column: explanatory copy */}
						<div className="lg:pl-8 lg:border-l lg:border-white/10">
							<h2 data-hero-copy className="text-xl font-bold text-white mb-5 leading-snug">
								What is AWS Alpha Skillbuilder?
							</h2>
							<p data-hero-copy className="text-white/65 text-base leading-relaxed mb-5">
								AWS Alpha Skillbuilder is a structured learning roadmap built by the{' '}
								<strong className="text-white font-semibold">
									AWS Learning Club at Rizal Technological University
								</strong>
								. It organizes Cloud, AI/ML, CyberSecurity, Data Science, and more into
								practical module tracks — so you always know what to learn next.
							</p>
							<p data-hero-copy className="text-white/65 text-base leading-relaxed mb-5">
								Each track contains hands-on modules with curated resources. Browse the
								category cards below, click one to expand it, and dive into modules at
								your own pace.
							</p>
							<p data-hero-copy className="text-white/40 text-sm leading-relaxed">
								Progress tracking and completion detection are coming soon. For now,
								explore the tracks and start building your skills.
							</p>
						</div>
						</div>
					</div>
				</section>

				{/* Learning tracks accordion section */}
				<section className="py-12 px-4 sm:px-6 lg:px-8">
					<div className="container mx-auto max-w-6xl">
						<div className="flex items-baseline gap-3 mb-7">
							<h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
								Learning Tracks
							</h2>
							<span className="text-xs text-muted-foreground/60">
								— click a track to explore modules
							</span>
						</div>

					<div ref={tracksRef} className="flex flex-col gap-4">
						{TRACKS.map((track) => (
							<CategoryCard
								key={track.id}
								track={track}
								isOpen={openTrackId === track.id}
								onToggle={() => handleToggle(track.id)}
							/>
						))}
					</div>
					</div>
				</section>

				<Footer />
			</main>
		</>
	)
}
