"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const MARQUEE_ITEMS = [
	"AWS Learning Club",
	"Cloud Computing",
	"Day One Mentality",
	"Build & Learn",
	"Innovation",
	"Community",
	"RTU",
	"Certifications",
	"Workshops",
]

function MarqueeRow({
	direction,
	speed,
	className,
}: {
	direction: "left" | "right"
	speed: number
	className?: string
}) {
	const rowRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const el = rowRef.current
		if (!el) return

		const totalWidth = el.scrollWidth / 2

		gsap.set(el, {
			x: direction === "left" ? 0 : -totalWidth,
		})

		const tween = gsap.to(el, {
			x: direction === "left" ? -totalWidth : 0,
			duration: speed,
			ease: "none",
			repeat: -1,
		})

		// Speed up/slow down based on scroll direction
		ScrollTrigger.create({
			onUpdate: (self) => {
				const velocity = Math.abs(self.getVelocity())
				const factor = Math.min(velocity / 1000, 3)
				gsap.to(tween, {
					timeScale: 1 + factor,
					duration: 0.3,
					overwrite: true,
				})
			},
		})

		return () => {
			tween.kill()
		}
	}, [direction, speed])

	const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]

	return (
		<div className="overflow-hidden">
			<div
				ref={rowRef}
				className={`flex whitespace-nowrap ${className}`}
			>
				{items.map((item, i) => (
					<span
						key={`${item}-${i}`}
						className="flex items-center gap-6 px-6"
					>
						<span className="text-3xl sm:text-4xl lg:text-5xl
							font-black uppercase tracking-tight">
							{item}
						</span>
						<span
							className="w-3 h-3 rounded-full
								bg-[#ff9900] shrink-0"
						/>
					</span>
				))}
			</div>
		</div>
	)
}

export default function Marquee() {
	const sectionRef = useRef<HTMLElement>(null)

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.from(sectionRef.current, {
				opacity: 0,
				duration: 0.8,
				scrollTrigger: {
					trigger: sectionRef.current,
					start: "top 90%",
				},
			})
		}, sectionRef)

		return () => ctx.revert()
	}, [])

	return (
		<section
			ref={sectionRef}
			data-theme="dark"
			className="section-dark py-10 sm:py-14 lg:py-16
				overflow-hidden select-none"
		>
			<MarqueeRow
				direction="left"
				speed={40}
				className="text-white/90 mb-4"
			/>
			<MarqueeRow
				direction="right"
				speed={50}
				className="text-white/30"
			/>
		</section>
	)
}
