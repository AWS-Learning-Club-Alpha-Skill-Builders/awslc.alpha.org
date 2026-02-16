"use client"

import { useEffect, useRef } from "react"
import { ArrowUpRight } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useMagnetic } from "@/hooks/use-magnetic"

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
	const sectionRef = useRef<HTMLElement>(null)
	const linkRef = useRef<HTMLAnchorElement>(null)

	useMagnetic(linkRef, 0.15)

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.from(".contact-heading", {
				y: 60,
				opacity: 0,
				duration: 1,
				ease: "power3.out",
				scrollTrigger: {
					trigger: sectionRef.current,
					start: "top 75%",
				},
			})

			gsap.from(".contact-sub", {
				y: 30,
				opacity: 0,
				duration: 0.8,
				delay: 0.3,
				ease: "power3.out",
				scrollTrigger: {
					trigger: sectionRef.current,
					start: "top 75%",
				},
			})
		}, sectionRef)

		return () => ctx.revert()
	}, [])

	return (
		<section
			id="contact"
			ref={sectionRef}
			data-theme="dark"
			className="section-dark min-h-[70vh]
				flex items-center justify-center
				px-4 sm:px-6 lg:px-8
				py-24 sm:py-32"
		>
			<div className="text-center max-w-4xl mx-auto">
				<a
					ref={linkRef}
					href="mailto:awslc.alpha@gmail.com"
					className="contact-heading group
						inline-block will-change-transform"
				>
					<h2
						className="text-5xl sm:text-7xl
							lg:text-8xl xl:text-9xl
							font-bold text-white
							leading-[1.1]
							group-hover:text-[#ff9900]
							transition-colors duration-500"
					>
						Let&apos;s Connect
						<ArrowUpRight
							className="inline-block ml-2
								sm:ml-4 w-8 h-8
								sm:w-12 sm:h-12
								lg:w-16 lg:h-16
								opacity-40
								group-hover:opacity-100
								group-hover:translate-x-1
								group-hover:-translate-y-1
								transition-all duration-500"
						/>
					</h2>
				</a>
				<p
					className="contact-sub mt-6 sm:mt-8
						text-sm sm:text-base
						text-white/40 tracking-wide"
				>
					awslc.alpha@gmail.com
				</p>
			</div>
		</section>
	)
}
