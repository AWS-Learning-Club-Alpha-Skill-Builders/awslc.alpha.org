"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface Feature {
	number: string
	title: string
	description: string
	align: "left" | "right" | "full"
	dark?: boolean
}

const FEATURES: Feature[] = [
	{
		number: "01",
		title: "Hands-On Learning",
		description:
			"Learn by doing with real AWS services and practical projects that build your portfolio. From EC2 to Lambda, get your hands dirty with the cloud.",
		align: "left",
	},
	{
		number: "02",
		title: "Community Driven",
		description:
			"Connect with fellow learners, share knowledge, and grow together in a supportive environment that values collaboration over competition.",
		align: "right",
	},
	{
		number: "03",
		title: "Career Growth",
		description:
			"Gain industry-relevant skills and AWS certifications to accelerate your tech career. Our members go on to land cloud engineering roles at top companies.",
		align: "full",
		dark: true,
	},
	{
		number: "04",
		title: "Expert Guidance",
		description:
			"Learn from experienced mentors and AWS-certified professionals who guide your journey through the cloud ecosystem.",
		align: "left",
	},
]

function FeatureBlock({ feature }: { feature: Feature }) {
	if (feature.align === "full") {
		return (
			<div
				className="about-feature rounded-2xl bg-[#232f3e]
					p-8 sm:p-12 lg:p-16"
			>
				<div
					className="grid grid-cols-1 lg:grid-cols-2
						gap-8 lg:gap-16 items-center"
				>
					<div>
						<span
							className="text-xs uppercase tracking-[0.3em]
								text-[#ff9900] font-medium mb-4 block"
						>
							{feature.number}
						</span>
						<h3
							className="text-2xl sm:text-3xl lg:text-4xl
								font-bold text-white mb-4"
						>
							{feature.title}
						</h3>
						<p
							className="text-base sm:text-lg text-white/60
								leading-relaxed max-w-md"
						>
							{feature.description}
						</p>
					</div>
					<div
						className="hidden lg:flex items-center
							justify-center"
					>
						<div
							className="urban-starblues text-8xl
								text-[#ff9900] select-none leading-none"
						>
							{feature.number}
						</div>
					</div>
				</div>
			</div>
		)
	}

	const isLeft = feature.align === "left"

	return (
		<div
			className={`about-feature grid grid-cols-1
				lg:grid-cols-12 gap-8 lg:gap-16 items-start`}
		>
			{/* Number column */}
			<div
				className={`lg:col-span-2 ${
					isLeft ? "lg:order-1" : "lg:order-2"
				}`}
			>
				<span
					className="urban-starblues text-6xl sm:text-7xl
						lg:text-8xl text-[#ff9900] select-none
						leading-none"
				>
					{feature.number}
				</span>
			</div>

			{/* Content column */}
			<div
				className={`lg:col-span-5 ${
					isLeft ? "lg:order-2" : "lg:order-1"
				}`}
			>
				<span
					className="text-xs uppercase tracking-[0.3em]
						text-[#ff9900] font-medium mb-4 block"
				>
					{feature.number}
				</span>
				<h3
					className="text-2xl sm:text-3xl lg:text-4xl
						font-bold text-[#232f3e] mb-4"
				>
					{feature.title}
				</h3>
				<p
					className="text-base sm:text-lg text-[#232f3e]/50
						leading-relaxed max-w-md"
				>
					{feature.description}
				</p>
			</div>

			{/* Empty spacer */}
			<div
				className={`hidden lg:block lg:col-span-5 ${
					isLeft ? "lg:order-3" : "lg:order-3"
				}`}
			/>
		</div>
	)
}

export default function About() {
	const sectionRef = useRef<HTMLElement>(null)

	useEffect(() => {
		const ctx = gsap.context(() => {
			const features =
				sectionRef.current?.querySelectorAll(
					".about-feature",
				) || []

			for (const feature of features) {
				gsap.from(feature, {
					y: 60,
					opacity: 0,
					duration: 0.8,
					ease: "power3.out",
					scrollTrigger: {
						trigger: feature,
						start: "top 85%",
						toggleActions:
							"play none none none",
					},
				})
			}
		}, sectionRef)

		return () => ctx.revert()
	}, [])

	return (
		<section
			id="about"
			ref={sectionRef}
			data-theme="light"
			className="section-padding px-4 sm:px-6 lg:px-8"
		>
			<div className="container mx-auto max-w-6xl">
				{/* Section header — asymmetric */}
				<div
					className="grid grid-cols-1 lg:grid-cols-2
						gap-6 mb-20 lg:mb-32"
				>
					<div>
						<span
							className="text-xs uppercase tracking-[0.3em]
								text-[#ff9900] font-medium mb-4 block"
						>
							About Us
						</span>
						<h2
							className="text-3xl sm:text-4xl lg:text-6xl
								font-bold text-[#232f3e] leading-tight"
						>
							Why join
							<br />
							our club?
						</h2>
					</div>
					<div className="flex items-end">
						<p
							className="text-base sm:text-lg
								text-[#232f3e]/50 leading-relaxed
								max-w-md lg:ml-auto"
						>
							We&apos;re building a community of cloud
							enthusiasts who learn by doing, support
							each other, and push the boundaries of
							what students can achieve.
						</p>
					</div>
				</div>

				{/* Features — staggered layout */}
				<div className="space-y-20 lg:space-y-32">
					{FEATURES.map((feature) => (
						<FeatureBlock
							key={feature.number}
							feature={feature}
						/>
					))}
				</div>
			</div>
		</section>
	)
}
