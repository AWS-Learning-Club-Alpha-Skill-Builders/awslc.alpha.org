"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronDown } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useMagnetic } from "@/hooks/use-magnetic"

gsap.registerPlugin(ScrollTrigger)

function SplitText({
	text,
	className,
	containerRef,
}: {
	text: string
	className?: string
	containerRef: React.RefObject<HTMLSpanElement | null>
}) {
	return (
		<span ref={containerRef} className={className} aria-label={text}>
			{text.split("").map((char, i) => (
				<span
					key={`${char}-${i}`}
					className="inline-block split-char"
					style={{ whiteSpace: char === " " ? "pre" : undefined }}
					aria-hidden="true"
				>
					{char === " " ? "\u00A0" : char}
				</span>
			))}
		</span>
	)
}

export default function Hero() {
	const sectionRef = useRef<HTMLElement>(null)
	const logoRef = useRef<HTMLDivElement>(null)
	const headingLineRef = useRef<HTMLSpanElement>(null)
	const dayOneRef = useRef<HTMLSpanElement>(null)
	const subtitleRef = useRef<HTMLParagraphElement>(null)
	const ctaRef = useRef<HTMLDivElement>(null)
	const blob1Ref = useRef<HTMLDivElement>(null)
	const blob2Ref = useRef<HTMLDivElement>(null)
	const blob3Ref = useRef<HTMLDivElement>(null)
	const scrollIndicatorRef = useRef<HTMLDivElement>(null)
	const primaryBtnRef = useRef<HTMLAnchorElement>(null)
	const secondaryBtnRef = useRef<HTMLAnchorElement>(null)

	useMagnetic(primaryBtnRef, 0.3)
	useMagnetic(secondaryBtnRef, 0.2)

	useEffect(() => {
		const ctx = gsap.context(() => {
			const tl = gsap.timeline({ delay: 1.8 })

			// Initial states
			gsap.set(logoRef.current, {
				scale: 0.6,
				opacity: 0,
			})
			gsap.set(".split-char", {
				y: 80,
				opacity: 0,
				rotateX: -90,
			})
			gsap.set(subtitleRef.current, { y: 40, opacity: 0 })
			gsap.set(ctaRef.current, { y: 40, opacity: 0 })
			gsap.set(scrollIndicatorRef.current, { opacity: 0 })

			// Animate blobs
			gsap.to(blob1Ref.current, {
				x: 40,
				y: -30,
				duration: 8,
				repeat: -1,
				yoyo: true,
				ease: "sine.inOut",
			})
			gsap.to(blob2Ref.current, {
				x: -30,
				y: 40,
				duration: 10,
				repeat: -1,
				yoyo: true,
				ease: "sine.inOut",
			})
			gsap.to(blob3Ref.current, {
				x: 20,
				y: 20,
				duration: 6,
				repeat: -1,
				yoyo: true,
				ease: "sine.inOut",
			})

			// Logo entrance
			tl.to(logoRef.current, {
				scale: 1,
				opacity: 1,
				duration: 1,
				ease: "elastic.out(1, 0.5)",
			})

			// "It's Always" character reveal
			const line1Chars =
				headingLineRef.current?.querySelectorAll(
					".split-char",
				) || []
			tl.to(
				line1Chars,
				{
					y: 0,
					opacity: 1,
					rotateX: 0,
					duration: 0.8,
					stagger: 0.03,
					ease: "power3.out",
				},
				"-=0.5",
			)

			// "Day One" dramatic reveal
			const dayOneChars =
				dayOneRef.current?.querySelectorAll(
					".split-char",
				) || []
			tl.to(
				dayOneChars,
				{
					y: 0,
					opacity: 1,
					rotateX: 0,
					duration: 1,
					stagger: 0.05,
					ease: "back.out(1.7)",
				},
				"-=0.4",
			)

			// Subtitle
			tl.to(
				subtitleRef.current,
				{
					y: 0,
					opacity: 1,
					duration: 1,
					ease: "power3.out",
				},
				"-=0.6",
			)

			// CTA buttons
			tl.to(
				ctaRef.current,
				{
					y: 0,
					opacity: 1,
					duration: 0.8,
					ease: "power3.out",
				},
				"-=0.7",
			)

			// Scroll indicator
			tl.to(
				scrollIndicatorRef.current,
				{ opacity: 1, duration: 0.6 },
				"-=0.3",
			)

			// Infinite bounce for scroll indicator
			gsap.to(scrollIndicatorRef.current, {
				y: 10,
				duration: 1.2,
				repeat: -1,
				yoyo: true,
				ease: "sine.inOut",
				delay: 3.5,
			})

			// Parallax on scroll
			ScrollTrigger.create({
				trigger: sectionRef.current,
				start: "top top",
				end: "bottom top",
				scrub: 1,
				onUpdate: (self) => {
					const progress = self.progress
					if (logoRef.current) {
						gsap.set(logoRef.current, {
							y: progress * -50,
						})
					}
					if (headingLineRef.current) {
						gsap.set(headingLineRef.current, {
							y: progress * -60,
						})
					}
					if (dayOneRef.current) {
						gsap.set(dayOneRef.current, {
							y: progress * -40,
						})
					}
					if (subtitleRef.current) {
						gsap.set(subtitleRef.current, {
							y: progress * -20,
						})
					}
					if (blob1Ref.current) {
						gsap.set(blob1Ref.current, {
							y: progress * 100,
						})
					}
					if (blob2Ref.current) {
						gsap.set(blob2Ref.current, {
							y: progress * -60,
						})
					}
				},
			})

			// Mobile fallback
			const fallback = setTimeout(() => {
				gsap.set(".split-char", {
					clearProps: "y,opacity,rotateX",
				})
				gsap.set(
					[
						logoRef.current,
						subtitleRef.current,
						ctaRef.current,
						scrollIndicatorRef.current,
					],
					{ clearProps: "all" },
				)
			}, 5000)

			return () => clearTimeout(fallback)
		}, sectionRef)

		return () => ctx.revert()
	}, [])

	return (
		<section
			ref={sectionRef}
			className="relative min-h-screen flex items-center
				justify-center overflow-hidden bg-white"
		>
			{/* Gradient blobs */}
			<div
				ref={blob1Ref}
				className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw]
					max-w-[600px] max-h-[600px] rounded-full
					bg-[#ff9900]/15 blur-[80px] pointer-events-none"
			/>
			<div
				ref={blob2Ref}
				className="absolute bottom-[10%] right-[10%] w-[35vw] h-[35vw]
					max-w-[500px] max-h-[500px] rounded-full
					bg-[#232f3e]/10 blur-[80px] pointer-events-none"
			/>
			<div
				ref={blob3Ref}
				className="absolute top-[50%] left-[50%] w-[20vw] h-[20vw]
					max-w-[300px] max-h-[300px] rounded-full
					bg-[#ff9900]/10 blur-[60px] pointer-events-none
					-translate-x-1/2 -translate-y-1/2"
			/>

			{/* Subtle grid pattern */}
			<div
				className="absolute inset-0
					bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)]
					bg-[size:4rem_4rem]
					[mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_40%,transparent_100%)]
					opacity-30"
			/>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				<div
					className="flex flex-col items-center
						text-center pt-24 pb-20 lg:pt-0 lg:pb-0
						min-h-screen justify-center"
				>
					{/* Logo */}
					<div
						ref={logoRef}
						className="relative w-32 h-32 sm:w-40 sm:h-40
							lg:w-48 lg:h-48 mb-8 lg:mb-12"
					>
						<Image
							src="/Logo (2).png"
							alt="AWS Learning Club Logo"
							fill
							className="object-contain drop-shadow-2xl"
							priority
						/>
					</div>

					{/* Eyebrow */}
					<div className="mb-6 lg:mb-8">
						<span
							className="text-[10px] sm:text-xs uppercase
								tracking-[0.3em] text-[#ff9900]
								font-medium"
						>
							AWS Learning Club - Alpha
						</span>
					</div>

					{/* Heading */}
					<h1
						className="mb-6 lg:mb-10"
						style={{ perspective: "1000px" }}
					>
						<span className="block">
							<SplitText
								text="It's Always"
								containerRef={headingLineRef}
								className="text-4xl sm:text-5xl
									lg:text-[clamp(3.5rem,7vw,7rem)]
									font-bold text-[#232f3e]
									leading-[0.95] block"
							/>
						</span>
						<span className="block mt-1 lg:mt-2">
							<SplitText
								text="Day One"
								containerRef={dayOneRef}
								className="urban-starblues
									text-6xl sm:text-8xl
									lg:text-[clamp(5rem,12vw,13rem)]
									text-[#ff9900] leading-[0.85]
									block"
							/>
						</span>
					</h1>

					{/* Subtitle */}
					<p
						ref={subtitleRef}
						className="text-sm sm:text-base lg:text-lg
							text-[#232f3e]/50 max-w-lg leading-relaxed
							mb-8 lg:mb-12"
					>
						Join the first AWS cloud community at Rizal
						Technological University. Build real-world
						projects, learn from peers, and accelerate
						your cloud career.
					</p>

					{/* CTA Buttons */}
					<div
						ref={ctaRef}
						className="flex flex-col sm:flex-row
							items-center gap-3 sm:gap-4
							w-full sm:w-auto"
					>
						<a
							ref={primaryBtnRef}
							href="#contact"
							className="inline-flex items-center
								justify-center gap-2
								bg-[#ff9900] text-white font-semibold
								text-sm sm:text-base px-6 sm:px-8
								py-3 sm:py-4 rounded-full
								hover:bg-[#ec8800] transition-colors
								duration-300 will-change-transform
								w-full sm:w-auto"
						>
							Join our Community
							<svg
								width="20"
								height="20"
								viewBox="0 0 20 20"
								fill="none"
								className="transition-transform
									group-hover:translate-x-1"
							>
								<path
									d="M4 10h12m0 0l-4-4m4 4l-4 4"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</a>
						<a
							ref={secondaryBtnRef}
							href="#about"
							className="inline-flex items-center
								justify-center gap-2
								border-2 border-[#232f3e] text-[#232f3e]
								font-semibold text-sm sm:text-base
								px-6 sm:px-8 py-3 sm:py-4
								rounded-full hover:bg-[#232f3e]
								hover:text-white transition-colors
								duration-300 will-change-transform
								w-full sm:w-auto"
						>
							Learn More
						</a>
					</div>
				</div>
			</div>

			{/* Scroll indicator */}
			<div
				ref={scrollIndicatorRef}
				className="absolute bottom-8 left-1/2
					-translate-x-1/2 flex flex-col items-center
					gap-2 z-10"
			>
				<span
					className="text-xs uppercase tracking-[0.2em]
						text-[#232f3e]/40 font-medium"
				>
					Scroll
				</span>
				<ChevronDown
					size={20}
					className="text-[#ff9900]"
				/>
			</div>
		</section>
	)
}
