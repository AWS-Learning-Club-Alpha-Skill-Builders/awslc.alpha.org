"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function ScrollProgress() {
	const barRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!barRef.current) return

		gsap.to(barRef.current, {
			scaleX: 1,
			ease: "none",
			scrollTrigger: {
				scrub: 0.3,
				start: "top top",
				end: "max",
			},
		})
	}, [])

	return (
		<div
			ref={barRef}
			className="fixed top-0 left-0 right-0 h-[3px]
				bg-[#ff9900] origin-left z-[9998]"
			style={{ transform: "scaleX(0)" }}
		/>
	)
}
