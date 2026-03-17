"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import {
	ChevronDown,
	LogOut,
	Menu,
	Settings,
	X,
} from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { AnimatePresence, motion } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/services/supabase-client.service"

const LEFT_NAV_LINKS = [
	{ href: "#about", label: "About" },
	{ href: "#vision", label: "Vision" },
	{ href: "#members", label: "Team" },
	{ href: "#contact", label: "Connect" },
]

const RIGHT_NAV_LINKS = [
	{ href: "/events", label: "Events" },
	{ href: "/skillbuilder", label: "Skillbuilder" },
]

interface NavigationProps {
	initialAuth?: {
		authenticated: boolean
		label: string
	}
}

export default function Navigation({
	initialAuth,
}: NavigationProps = {}) {
	const pathname = usePathname()
	const router = useRouter()
	const [isScrolled, setIsScrolled] = useState(false)
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
	const [activeSection, setActiveSection] = useState("")
	const [isDarkSection, setIsDarkSection] = useState(false)
	const [isAuthenticated, setIsAuthenticated] = useState(
		initialAuth?.authenticated ?? false,
	)
	const [accountLabel, setAccountLabel] = useState(
		initialAuth?.label ?? "Account",
	)
	const [isAccountOpen, setIsAccountOpen] = useState(false)
	const navRef = useRef<HTMLElement>(null)
	const accountRef = useRef<HTMLDivElement>(null)

	const desktopLinks = [...LEFT_NAV_LINKS, ...RIGHT_NAV_LINKS]
	const mobileLinks = [...LEFT_NAV_LINKS, ...RIGHT_NAV_LINKS]

	useEffect(() => {
		gsap.registerPlugin(ScrollTrigger)
	}, [])

	useEffect(() => {
		const supabase = getSupabaseBrowserClient()

		const formatAccountLabel = async (
			email: string | null | undefined,
			userId: string | null | undefined,
		) => {
			if (!email || !userId) return "Account"
			const baseName = email.split("@")[0] || "Account"
			const { data } = await supabase
				.from("profiles")
				.select("full_name")
				.eq("id", userId)
				.maybeSingle()
			const fullName = data?.full_name?.trim()
			return fullName && fullName.length > 0 ? fullName : baseName
		}

		const loadSession = async () => {
			const { data: { user } } = await supabase.auth.getUser()
			setIsAuthenticated(Boolean(user))
			if (user) {
				const label = await formatAccountLabel(
					user.email,
					user.id,
				)
				setAccountLabel(label)
			} else {
				setAccountLabel("Account")
			}
		}

		void loadSession()

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (_event, session) => {
			setIsAuthenticated(Boolean(session))
			if (session?.user) {
				const label = await formatAccountLabel(
					session.user.email,
					session.user.id,
				)
				setAccountLabel(label)
			} else {
				setAccountLabel("Account")
			}
		})

		return () => {
			subscription.unsubscribe()
		}
	}, [])

	useEffect(() => {
		const checkTheme = () => {
			const darkSections =
				document.querySelectorAll('[data-theme="dark"]')
			const navHeight = 80

			for (const section of darkSections) {
				const rect = section.getBoundingClientRect()
				if (
					rect.top <= navHeight &&
					rect.bottom >= navHeight
				) {
					setIsDarkSection(true)
					return
				}
			}
			setIsDarkSection(false)
		}

		window.addEventListener("scroll", checkTheme, {
			passive: true,
		})
		checkTheme()

		return () =>
			window.removeEventListener("scroll", checkTheme)
	}, [])

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20)
		}
		window.addEventListener("scroll", handleScroll, {
			passive: true,
		})
		return () =>
			window.removeEventListener("scroll", handleScroll)
	}, [])

	useEffect(() => {
		if (!navRef.current) return

		let lastDirection = -1
		const ctx = gsap.context(() => {
			ScrollTrigger.create({
				start: "top -100",
				onUpdate: (self) => {
					if (isMobileMenuOpen) {
						gsap.set(navRef.current, {
							yPercent: 0,
						})
						return
					}
					if (self.direction !== lastDirection) {
						lastDirection = self.direction
						gsap.to(navRef.current, {
							yPercent:
								self.direction === 1 ? -100 : 0,
							duration: 0.3,
							ease: "power2.out",
						})
					}
				},
			})
		})

		return () => ctx.revert()
	}, [isMobileMenuOpen])

	useEffect(() => {
		const sections = [
			"about",
			"vision",
			"members",
			"contact",
		]
		const observers: IntersectionObserver[] = []

		for (const id of sections) {
			const el = document.getElementById(id)
			if (!el) continue

			const observer = new IntersectionObserver(
				(entries) => {
					for (const entry of entries) {
						if (entry.isIntersecting) {
							setActiveSection(`#${id}`)
						}
					}
				},
				{ threshold: 0.3 },
			)
			observer.observe(el)
			observers.push(observer)
		}

		const matchedRoute = RIGHT_NAV_LINKS.find((link) =>
			pathname.startsWith(link.href),
		)
		if (matchedRoute) {
			setActiveSection(matchedRoute.href)
		}

		return () => {
			for (const obs of observers) obs.disconnect()
		}
	}, [pathname])

	useEffect(() => {
		document.body.style.overflow = isMobileMenuOpen
			? "hidden"
			: ""
		if (isMobileMenuOpen && navRef.current) {
			gsap.set(navRef.current, { yPercent: 0 })
		}
		return () => {
			document.body.style.overflow = ""
		}
	}, [isMobileMenuOpen])

	useEffect(() => {
		const handleOutsideClick = (event: MouseEvent) => {
			const target = event.target as Node
			if (accountRef.current && !accountRef.current.contains(target)) {
				setIsAccountOpen(false)
			}
		}

		document.addEventListener("mousedown", handleOutsideClick)
		return () => {
			document.removeEventListener("mousedown", handleOutsideClick)
		}
	}, [])

	const closeMobileMenu = useCallback(() => {
		setIsMobileMenuOpen(false)
		setIsAccountOpen(false)
	}, [])

	const handleSignOut = useCallback(async () => {
		setIsAccountOpen(false)
		setIsMobileMenuOpen(false)
		setAccountLabel("Account")
		const { signOutAction } = await import("@/actions/sign-out")
		await signOutAction()
	}, [])

	const textColor = isDarkSection
		? "text-white"
		: "text-[#232f3e]"
	const hoverColor = "hover:text-[#ff9900]"
	const activeColor = "text-[#ff9900]"
	const bgStyle = isScrolled
		? isDarkSection
			? "bg-[#0d1117]/80 backdrop-blur-xl border-b border-white/5"
			: "bg-white/80 backdrop-blur-xl border-b border-black/5 shadow-lg shadow-black/[0.03]"
		: "bg-transparent"

	function resolveLinkHref(href: string) {
		if (!href.startsWith("#")) return href
		return pathname === "/" ? href : `/${href}`
	}

	function linkClass(href: string) {
		return `link-underline text-sm font-medium transition-colors duration-300 ${
			activeSection === href
				? activeColor
				: `${textColor} ${hoverColor}`
		}`
	}

	return (
		<>
			<nav
				ref={navRef}
				className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${bgStyle}`}
			>
				<div className="px-4 sm:px-6 lg:px-8">
					<div className="flex items-center h-16 lg:h-20">
						<a
							href="/"
							className="flex items-center gap-2.5 group shrink-0"
						>
							<div className="relative w-10 h-10 lg:w-11 lg:h-11 transition-transform duration-300 group-hover:scale-110">
								<Image
									src="/Logo (2).png"
									alt="AWS Learning Club Logo"
									fill
									priority
									className="object-contain"
								/>
							</div>
							<div>
								<div
									className={`text-xs sm:text-sm lg:text-base font-bold transition-colors duration-500 ${textColor}`}
								>
									AWS Learning Club - Alpha
								</div>
								<div
									className="text-[10px] sm:text-xs text-[#ff9900] font-medium"
								>
									Rizal Technological University
								</div>
							</div>
						</a>

						<div className="hidden md:flex items-center gap-8 ml-auto">
							<div className="flex items-center gap-7">
								{LEFT_NAV_LINKS.map((link) => (
									<a
										key={link.href}
										href={resolveLinkHref(link.href)}
										className={linkClass(link.href)}
									>
										{link.label}
									</a>
								))}
							</div>

							<div className="w-px h-5 bg-white/20" />

							<div className="flex items-center gap-7">
								{RIGHT_NAV_LINKS.map((link) => (
									<Link
										key={link.href}
										href={link.href}
										className={linkClass(link.href)}
									>
										{link.label}
									</Link>
								))}

								<div ref={accountRef} className="relative">
									{isAuthenticated ? (
										<>
											<button
												type="button"
												onClick={() =>
													setIsAccountOpen((prev) => !prev)
												}
												className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${textColor} ${hoverColor}`}
											>
												{accountLabel}
												<ChevronDown
													className={`w-4 h-4 transition-transform ${
														isAccountOpen
															? "rotate-180"
															: ""
													}`}
												/>
											</button>

											{isAccountOpen && (
												<div className="absolute right-0 mt-2 w-44 rounded-md border bg-white text-[#232f3e] shadow-lg overflow-hidden">
													<Link
														href="/settings"
														className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50"
														onClick={() =>
															setIsAccountOpen(false)
														}
													>
														<Settings className="w-4 h-4" />
														Settings
													</Link>
													<button
														type="button"
														onClick={handleSignOut}
														className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50"
													>
														<LogOut className="w-4 h-4" />
														Sign out
													</button>
												</div>
											)}
										</>
									) : (
										<Link
											href="/auth/login"
											className={linkClass("/auth/login")}
										>
											Login
										</Link>
									)}
								</div>
							</div>
						</div>

						<div className="flex justify-end ml-auto md:hidden">
							<button
								onClick={() =>
									setIsMobileMenuOpen(!isMobileMenuOpen)
								}
								className={`relative z-[60] p-2 transition-colors ${
									isMobileMenuOpen
										? "text-white"
										: `${textColor} ${hoverColor}`
								}`}
								aria-label="Toggle menu"
							>
								{isMobileMenuOpen ? (
									<X size={24} />
								) : (
									<Menu size={24} />
								)}
							</button>
						</div>
					</div>
				</div>
			</nav>

			<AnimatePresence>
				{isMobileMenuOpen && (
					<motion.div
						initial={{ clipPath: "circle(0% at 95% 3%)" }}
						animate={{
							clipPath: "circle(150% at 95% 3%)",
						}}
						exit={{ clipPath: "circle(0% at 95% 3%)" }}
						transition={{
							duration: 0.6,
							ease: [0.77, 0, 0.175, 1],
						}}
						className="fixed inset-0 z-[55] bg-[#232f3e] flex flex-col items-center justify-center"
					>
						<button
							onClick={closeMobileMenu}
							className="absolute top-5 right-5 p-2 text-white hover:text-[#ff9900] transition-colors"
							aria-label="Close menu"
						>
							<X size={28} />
						</button>

						<div className="flex flex-col items-center gap-8">
							{mobileLinks.map((link, i) => (
								<motion.a
									key={link.href}
									href={resolveLinkHref(link.href)}
									onClick={closeMobileMenu}
									initial={{ y: 40, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									transition={{
										delay: 0.15 + i * 0.07,
										duration: 0.45,
										ease: [0.25, 1, 0.5, 1],
									}}
									className="urban-starblues text-4xl text-white hover:text-[#ff9900] transition-colors duration-300"
								>
									{link.label}
								</motion.a>
							))}

							{isAuthenticated ? (
								<>
									<motion.a
										href="/settings"
										onClick={closeMobileMenu}
										initial={{ y: 40, opacity: 0 }}
										animate={{ y: 0, opacity: 1 }}
										transition={{
											delay: 0.15 + mobileLinks.length * 0.07,
											duration: 0.45,
											ease: [0.25, 1, 0.5, 1],
										}}
										className="urban-starblues text-4xl text-white hover:text-[#ff9900] transition-colors duration-300"
									>
										Settings
									</motion.a>
									<motion.button
										type="button"
										onClick={handleSignOut}
										initial={{ y: 40, opacity: 0 }}
										animate={{ y: 0, opacity: 1 }}
										transition={{
											delay: 0.22 + mobileLinks.length * 0.07,
											duration: 0.45,
											ease: [0.25, 1, 0.5, 1],
										}}
										className="urban-starblues text-4xl text-white hover:text-[#ff9900] transition-colors duration-300"
									>
										Sign out
									</motion.button>
								</>
							) : (
								<motion.a
									href="/auth/login"
									onClick={closeMobileMenu}
									initial={{ y: 40, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									transition={{
										delay:
											0.15 + mobileLinks.length * 0.07,
										duration: 0.45,
										ease: [0.25, 1, 0.5, 1],
									}}
									className="urban-starblues text-4xl text-white hover:text-[#ff9900] transition-colors duration-300"
								>
									Login
								</motion.a>
							)}
						</div>

						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 0.3 }}
							transition={{ delay: 0.6 }}
							className="absolute bottom-10"
						>
							<Image
								src="/Logo (2).png"
								alt="AWS Learning Club Logo"
								width={48}
								height={48}
								className="opacity-50 brightness-0 invert"
							/>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	)
}
