"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { AnimatePresence, motion } from "framer-motion"

gsap.registerPlugin(ScrollTrigger)

const NAV_LINKS = [
	{ href: "#about", label: "About" },
	{ href: "#vision", label: "Vision" },
	{ href: "/events", label: "Events" },
	{ href: "#members", label: "Team" },
	{ href: "#contact", label: "Connect" },
]

export default function Navigation() {
	const [isScrolled, setIsScrolled] = useState(false)
	const [isMobileMenuOpen, setIsMobileMenuOpen] =
		useState(false)
	const [activeSection, setActiveSection] = useState("")
	const [isDarkSection, setIsDarkSection] = useState(false)
	const navRef = useRef<HTMLElement>(null)

	// Detect dark sections for dynamic nav theming
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
		window.addEventListener("scroll", handleScroll)
		return () =>
			window.removeEventListener("scroll", handleScroll)
	}, [])

	// Hide on scroll down, show on scroll up
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

	// Track active section
	useEffect(() => {
		const sections = [
			"about",
			"vision",
			"events",
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

		return () => {
			for (const obs of observers) obs.disconnect()
		}
	}, [])

	// Lock body scroll and force nav visible when menu open
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

	const closeMobileMenu = useCallback(() => {
		setIsMobileMenuOpen(false)
	}, [])

	// Derived styles based on dark/light section
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

	return (
		<>
			<nav
				ref={navRef}
				className={`fixed top-0 left-0 right-0 z-50
					transition-all duration-500 ${bgStyle}`}
			>
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="relative flex items-center justify-between h-16 lg:h-20">
						{/* Logo */}
						<a
							href="#"
							className="flex items-center gap-2.5 group z-10"
						>
							<div className="relative w-10 h-10 lg:w-11 lg:h-11 transition-transform duration-300 group-hover:scale-110">
								<Image
									src="/Logo (2).png"
									alt="AWS Learning Club Logo"
									fill
									className="object-contain"
								/>
							</div>
							<div>
								<div
									className={`text-xs sm:text-sm lg:text-base
										font-bold transition-colors duration-500
										${textColor}`}
								>
									AWS Learning Club - Alpha
								</div>
								<div
									className="text-[10px] sm:text-xs
										text-[#ff9900] font-medium"
								>
									Rizal Technological University
								</div>
							</div>
						</a>

						{/* Desktop Navigation */}
						<div className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
							{NAV_LINKS.map((link) => (
								<a
									key={link.href}
									href={link.href}
									className={`link-underline text-sm
										font-medium transition-colors
										duration-300 ${
											activeSection === link.href
												? activeColor
												: `${textColor} ${hoverColor}`
										}`}
								>
									{link.label}
								</a>
							))}
						</div>

						{/* Mobile Menu Button */}
						<button
							onClick={() =>
								setIsMobileMenuOpen(!isMobileMenuOpen)
							}
							className={`md:hidden relative z-[60] p-2
								transition-colors ${
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
			</nav>

			{/* Fullscreen Mobile Menu */}
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
						className="fixed inset-0 z-[55] bg-[#232f3e]
							flex flex-col items-center justify-center"
					>
						{/* Close button */}
						<button
							onClick={closeMobileMenu}
							className="absolute top-5 right-5
								p-2 text-white
								hover:text-[#ff9900]
								transition-colors"
							aria-label="Close menu"
						>
							<X size={28} />
						</button>

						<div className="flex flex-col items-center gap-10">
							{NAV_LINKS.map((link, i) => (
								<motion.a
									key={link.href}
									href={link.href}
									onClick={closeMobileMenu}
									initial={{ y: 40, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									transition={{
										delay: 0.2 + i * 0.08,
										duration: 0.5,
										ease: [0.25, 1, 0.5, 1],
									}}
									className="urban-starblues text-5xl
										text-white hover:text-[#ff9900]
										transition-colors duration-300"
								>
									{link.label}
								</motion.a>
							))}
						</div>

						{/* Logo at bottom */}
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
