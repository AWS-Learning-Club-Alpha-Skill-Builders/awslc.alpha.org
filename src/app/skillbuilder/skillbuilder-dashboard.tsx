'use client'

import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
	CheckCircle2,
	ChevronDown,
	Circle,
	Clock,
	ExternalLink,
	LogOut,
} from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'
import { Navigation, Footer } from '@/app/(landing)'
import { startModuleAction } from '@/actions/start-module'
import { submitModuleDocumentationAction } from '@/actions/submit-module-documentation'
import { signOutAction } from '@/actions/sign-out'
import type {
	ModuleStatus,
	SkillbuilderSnapshot,
	SkillCategoryDto,
	SkillModuleDto,
} from '@/types/skillbuilder.types'

interface SkillbuilderDashboardProps {
	initialSnapshot: SkillbuilderSnapshot
	userEmail: string
}

interface ThemeConfig {
	headerGradient: string
	expandedBg: string
	accentText: string
	moduleBorderL: string
}

const TRACK_THEMES: Record<string, ThemeConfig> = {
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
	default: {
		headerGradient: 'from-slate-800 via-slate-600 to-slate-500',
		expandedBg: 'bg-slate-50/60',
		accentText: 'text-slate-700',
		moduleBorderL: 'border-l-slate-400',
	},
}

const STATUS_CONFIG: Record<ModuleStatus, { label: string; iconClass: string; textClass: string }> = {
	'todo': {
		label: 'To Do',
		iconClass: 'text-gray-400',
		textClass: 'text-gray-500',
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

function moduleStatusIcon(status: ModuleStatus) {
	if (status === 'done') return CheckCircle2
	if (status === 'in-progress') return Clock
	return Circle
}

function calculateCategoryStats(modules: SkillModuleDto[]) {
	const done = modules.filter((item) => item.status === 'done').length
	const inProgress = modules.filter((item) => item.status === 'in-progress').length
	const todo = modules.filter((item) => item.status === 'todo').length
	const total = modules.length
	const percent = total > 0 ? Math.round((done / total) * 100) : 0
	return { done, inProgress, todo, total, percent }
}

function ModuleCard({
	module,
	theme,
	onStartModule,
	onSubmitDocumentation,
	linkValue,
	onDocumentationLinkChange,
	message,
	isPending,
}: {
	module: SkillModuleDto
	theme: ThemeConfig
	onStartModule: (moduleId: string) => void
	onSubmitDocumentation: (moduleId: string, url: string) => void
	linkValue: string
	onDocumentationLinkChange: (moduleId: string, value: string) => void
	message?: string
	isPending: boolean
}) {
	const status = module.status
	const cfg = STATUS_CONFIG[status]
	const Icon = moduleStatusIcon(status)

	return (
		<article
			data-module-card
			className={cn(
				'group relative flex flex-col gap-3 rounded-xl border bg-white p-4',
				'border-l-[3px] shadow-sm hover:shadow-md transition-all',
				theme.moduleBorderL,
			)}
		>
			<div className='absolute top-3.5 right-3.5' aria-hidden='true'>
				<Icon className={cn('w-4 h-4', cfg.iconClass)} />
			</div>

			<p className={cn('text-sm font-semibold leading-snug pr-7', status === 'done' && 'line-through text-muted-foreground')}>
				{module.title}
			</p>
			<p className='text-xs text-muted-foreground leading-relaxed'>{module.description}</p>

			<div className='mt-auto space-y-3 pt-3 border-t border-border/60'>
				<div className='flex items-center justify-between'>
					<span className={cn('inline-flex items-center gap-1.5 text-xs font-medium', cfg.textClass)}>
						<Icon className={cn('w-3 h-3 shrink-0', cfg.iconClass)} />
						{cfg.label}
					</span>
					<a
						href={module.nextworkUrl}
						target='_blank'
						rel='noopener noreferrer'
						className='text-muted-foreground hover:text-accent transition-colors'
					>
						<ExternalLink className='w-3.5 h-3.5' />
					</a>
				</div>

				{status === 'todo' && (
					<button
						type='button'
						disabled={isPending}
						onClick={() => onStartModule(module.id)}
						className='w-full rounded-md bg-[#232f3e] py-2 text-xs font-semibold text-white hover:bg-[#1a2535] disabled:opacity-60'
					>
						Mark In Progress
					</button>
				)}

				{status === 'in-progress' && (
					<div className='space-y-2'>
						<input
							type='url'
							value={linkValue}
							onChange={(event) =>
								onDocumentationLinkChange(module.id, event.target.value)
							}
							placeholder='Paste your Nextwork documentation link'
							className='w-full rounded-md border px-3 py-2 text-xs focus:border-[#ff9900] outline-none'
						/>
						<button
							type='button'
							disabled={isPending || linkValue.trim().length === 0}
							onClick={() => onSubmitDocumentation(module.id, linkValue)}
							className='w-full rounded-md bg-[#ff9900] py-2 text-xs font-semibold text-white hover:bg-[#e68900] disabled:opacity-60'
						>
							Submit Documentation
						</button>
					</div>
				)}

				{status === 'done' && (
					<p className='text-xs text-green-700 rounded-md bg-green-50 border border-green-100 px-2 py-1.5'>
						Completion verified.
					</p>
				)}

				{message && (
					<p className='text-xs text-muted-foreground rounded-md bg-muted/40 px-2 py-1.5'>
						{message}
					</p>
				)}
			</div>
		</article>
	)
}

export default function SkillbuilderDashboard({
	initialSnapshot,
	userEmail,
}: SkillbuilderDashboardProps) {
	const router = useRouter()
	const [openCategoryId, setOpenCategoryId] = useState<string | null>(null)
	const [docLinksByModule, setDocLinksByModule] = useState<Record<string, string>>({})
	const [messagesByModule, setMessagesByModule] = useState<Record<string, string>>({})
	const [globalMessage, setGlobalMessage] = useState<string | null>(null)
	const [isPending, startTransition] = useTransition()
	const heroRef = useRef<HTMLElement>(null)
	const tracksRef = useRef<HTMLDivElement>(null)

	const totals = initialSnapshot.totals
	const overallPct = totals.modules > 0 ? Math.round((totals.done / totals.modules) * 100) : 0

	const categories = useMemo(
		() => [...initialSnapshot.categories].sort((a, b) => a.displayOrder - b.displayOrder),
		[initialSnapshot.categories],
	)

	useEffect(() => {
		gsap.registerPlugin(ScrollTrigger)
	}, [])

	useEffect(() => {
		if (!heroRef.current) return
		const el = heroRef.current
		const heroTargets = [
			el.querySelector('[data-hero-badge]'),
			el.querySelector('[data-hero-title]'),
			el.querySelector('[data-hero-subtitle]'),
			el.querySelector('[data-hero-progress]'),
			...Array.from(el.querySelectorAll('[data-hero-copy]')),
		].filter(Boolean)

		if (heroTargets.length === 0) return
		gsap.set(heroTargets, { opacity: 0, y: 20 })

		// Align intro animation with the PageLoader timeline on first page load.
		// On client-side navigations, performance.now() is already past this point,
		// so delay resolves to 0 and animation starts immediately.
		const LOADER_MS = 2300
		const elapsedMs = performance.now()
		const delayS = Math.max(0, (LOADER_MS - elapsedMs) / 1000)

		const tl = gsap.timeline({
			delay: delayS,
			defaults: { ease: 'power2.out' },
		}).to(heroTargets, {
			opacity: 1,
			y: 0,
			duration: 0.55,
			stagger: 0.1,
		})

		return () => {
			tl.kill()
		}
	}, [])

	useEffect(() => {
		if (!tracksRef.current) return
		const cards = Array.from(
			tracksRef.current.querySelectorAll('[data-category-card]'),
		)
		if (cards.length === 0) return

		gsap.set(cards, { opacity: 0, y: 32 })
		const triggers = ScrollTrigger.batch(cards, {
			onEnter: (elements) => {
				gsap.to(elements, {
					opacity: 1,
					y: 0,
					duration: 0.5,
					stagger: 0.08,
					ease: 'power2.out',
				})
			},
			start: 'top 88%',
			once: true,
		})

		return () => {
			triggers.forEach((trigger) => trigger.kill())
		}
	}, [categories.length])

	useEffect(() => {
		if (!openCategoryId || !tracksRef.current) return

		// Wait for expanded panel render before selecting module cards.
		const frame = window.requestAnimationFrame(() => {
			if (!tracksRef.current) return
			const selector = `[data-category-id="${openCategoryId}"] [data-module-card]`
			const moduleCards = Array.from(
				tracksRef.current.querySelectorAll(selector),
			)
			if (moduleCards.length === 0) return

			gsap.fromTo(
				moduleCards,
				{ opacity: 0, y: 20 },
				{
					opacity: 1,
					y: 0,
					duration: 0.4,
					stagger: 0.05,
					ease: 'power2.out',
					delay: 0.08,
				},
			)
		})

		return () => {
			window.cancelAnimationFrame(frame)
		}
	}, [openCategoryId])

	function handleDocumentationLinkChange(moduleId: string, value: string) {
		setDocLinksByModule((prev) => ({
			...prev,
			[moduleId]: value,
		}))
	}

	function handleStartModule(moduleId: string) {
		startTransition(async () => {
			const result = await startModuleAction(moduleId)
			setMessagesByModule((prev) => ({
				...prev,
				[moduleId]: result.message,
			}))
			router.refresh()
		})
	}

	function handleSubmitDocumentation(moduleId: string, url: string) {
		startTransition(async () => {
			const result = await submitModuleDocumentationAction(moduleId, url)
			setMessagesByModule((prev) => ({
				...prev,
				[moduleId]: result.message,
			}))
			if (result.ok) {
				setDocLinksByModule((prev) => ({
					...prev,
					[moduleId]: '',
				}))
			}
			router.refresh()
		})
	}

	function handleSignOut() {
		startTransition(async () => {
			await signOutAction()
			router.replace('/auth/login')
			router.refresh()
		})
	}

	return (
		<>
			<Navigation />
			<main className='min-h-screen bg-[#f0f4f8]'>
				<section
					ref={heroRef}
					data-theme='dark'
					className='min-h-[100svh] pt-28 pb-14 px-4 sm:px-6 lg:px-8 flex items-center bg-gradient-to-br from-[#232f3e] via-[#1a2535] to-[#0d1117]'
				>
					<div className='container mx-auto max-w-6xl text-white'>
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-10 items-start'>
							<div>
								<p
									data-hero-badge
									className='inline-flex text-xs uppercase tracking-widest text-[#ff9900] font-semibold'
								>
									AWS Alpha Program
								</p>
								<h1
									data-hero-title
									className='text-4xl sm:text-5xl font-bold mt-2'
								>
									Skillbuilder
								</h1>
								<p
									data-hero-subtitle
									className='text-white/65 mt-3 text-sm'
								>
									Signed in as {userEmail}
								</p>
								<div
									data-hero-progress
									className='mt-8 rounded-2xl border border-white/10 bg-white/5 p-6'
								>
									<div className='flex items-end justify-between mb-3'>
										<span className='text-white/60 text-xs uppercase tracking-wider'>
											Overall Progress
										</span>
										<span className='text-3xl font-bold tabular-nums'>{overallPct}%</span>
									</div>
									<div className='h-2.5 bg-white/10 rounded-full overflow-hidden mb-5'>
										<div
											className='h-full rounded-full bg-[#ff9900]'
											style={{ width: `${overallPct}%` }}
										/>
									</div>
									<div className='grid grid-cols-4 gap-4 pt-4 border-t border-white/10 text-xs'>
										<div>
											<div className='text-xl font-bold'>{totals.categories}</div>
											<div className='text-white/55'>Categories</div>
										</div>
										<div>
											<div className='text-xl font-bold'>{totals.modules}</div>
											<div className='text-white/55'>Modules</div>
										</div>
										<div>
											<div className='text-xl font-bold text-[#ff9900]'>{totals.inProgress}</div>
											<div className='text-white/55'>In Progress</div>
										</div>
										<div>
											<div className='text-xl font-bold text-green-400'>{totals.done}</div>
											<div className='text-white/55'>Completed</div>
										</div>
									</div>
								</div>
							</div>
							<div className='lg:pl-8 lg:border-l lg:border-white/10'>
								<div className='flex justify-end mb-4'>
									<button
										type='button'
										disabled={isPending}
										onClick={handleSignOut}
										className='inline-flex items-center gap-2 rounded-md border border-white/20 px-3 py-2 text-xs font-semibold hover:bg-white/10'
									>
										<LogOut className='w-4 h-4' />
										Sign out
									</button>
								</div>
								<h2
									data-hero-copy
									className='text-xl font-bold text-white mb-5 leading-snug'
								>
									What is AWS Alpha Skillbuilder?
								</h2>
								<p
									data-hero-copy
									className='text-white/65 text-base leading-relaxed mb-5'
								>
									AWS Alpha Skillbuilder is a structured learning roadmap built by the{' '}
									<strong className='text-white font-semibold'>
										AWS Learning Club at Rizal Technological University
									</strong>
									. It organizes Cloud, AI/ML, CyberSecurity, Data Science, and more
									into practical module tracks so you always know what to learn next.
								</p>
								<p
									data-hero-copy
									className='text-white/65 text-base leading-relaxed mb-5'
								>
									Each track contains hands-on modules and resources. Click a track
									card below, mark modules as in progress, and submit your Nextwork
									documentation to verify completion.
								</p>
								<p
									data-hero-copy
									className='text-white/40 text-sm leading-relaxed'
								>
									Progress tracking and submissions are now tied to your account and
									saved securely with Supabase.
								</p>
							</div>
						</div>
					</div>
				</section>

				<section className='py-10 px-4 sm:px-6 lg:px-8'>
					<div className='container mx-auto max-w-6xl space-y-5'>
						{globalMessage && (
							<p className='rounded-md border bg-white px-3 py-2 text-sm text-muted-foreground shadow-sm'>
								{globalMessage}
							</p>
						)}

						<div ref={tracksRef} className='space-y-4'>
							{categories.map((category) => {
								const theme = TRACK_THEMES[category.themeKey] ?? TRACK_THEMES.default
								const isOpen = openCategoryId === category.id
								const stats = calculateCategoryStats(category.modules)

								return (
									<div
										key={category.id}
										data-category-card
										data-category-id={category.id}
										className={cn(
											'rounded-2xl overflow-hidden border border-white/10 shadow-sm transition-shadow',
											isOpen && 'shadow-xl',
										)}
									>
										<button
											type='button'
											onClick={() =>
												setOpenCategoryId((prev) =>
													prev === category.id ? null : category.id,
												)
											}
											className={cn(
												'w-full text-left px-6 py-5 bg-gradient-to-r text-white',
												'flex items-center gap-5 transition-all hover:brightness-110',
												theme.headerGradient,
											)}
										>
											<span className='text-4xl shrink-0'>{category.emoji}</span>
											<div className='flex-1'>
												<h2 className='text-lg font-bold'>{category.name}</h2>
												<p className='text-sm text-white/80 mt-0.5 hidden sm:block'>
													{category.shortDescription}
												</p>
												<div className='mt-3 flex items-center gap-3 max-w-xs'>
													<div className='flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden'>
														<div
															className='h-full bg-white/90 rounded-full'
															style={{ width: `${stats.percent}%` }}
														/>
													</div>
													<span className='text-xs text-white/80 tabular-nums'>
														{stats.done}/{stats.total}
													</span>
												</div>
											</div>
											<div className='text-right'>
												<div className='text-2xl font-bold tabular-nums'>{stats.percent}%</div>
												<ChevronDown
													className={cn(
														'w-5 h-5 text-white/80 mt-2 ml-auto transition-transform duration-300',
														isOpen && 'rotate-180',
													)}
												/>
											</div>
										</button>

										<div
											className={cn(
												'grid transition-all duration-500 ease-in-out',
												isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
											)}
										>
											<div className={cn('overflow-hidden', theme.expandedBg)}>
												<div className='px-6 py-7'>
												<p className='text-sm text-muted-foreground leading-relaxed mb-6 italic'>
													{category.longDescription}
												</p>
												<div className='flex flex-wrap gap-4 mb-7 text-sm'>
													<div className='flex items-center gap-1.5'>
														<CheckCircle2 className='w-4 h-4 text-green-500' />
														<span className={cn('font-semibold', theme.accentText)}>
															{stats.done}
														</span>
														<span className='text-muted-foreground'>completed</span>
													</div>
													<div className='flex items-center gap-1.5'>
														<Clock className='w-4 h-4 text-[#ff9900]' />
														<span className='font-semibold text-[#ff9900]'>{stats.inProgress}</span>
														<span className='text-muted-foreground'>in progress</span>
													</div>
													<div className='flex items-center gap-1.5'>
														<Circle className='w-4 h-4 text-gray-400' />
														<span className='font-semibold text-gray-500'>{stats.todo}</span>
														<span className='text-muted-foreground'>to do</span>
													</div>
												</div>

												<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
													{category.modules.map((module) => (
														<ModuleCard
															key={module.id}
															module={module}
															theme={theme}
															onStartModule={handleStartModule}
															onSubmitDocumentation={handleSubmitDocumentation}
															linkValue={docLinksByModule[module.id] ?? ''}
															onDocumentationLinkChange={handleDocumentationLinkChange}
															message={messagesByModule[module.id]}
															isPending={isPending}
														/>
													))}
												</div>
											</div>
											</div>
										</div>
									</div>
								)
							})}
						</div>
					</div>
				</section>
				<Footer />
			</main>
		</>
	)
}
