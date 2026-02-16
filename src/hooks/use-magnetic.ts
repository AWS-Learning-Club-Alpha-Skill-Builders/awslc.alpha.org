"use client"

import { useEffect, type RefObject } from "react"
import gsap from "gsap"

export function useMagnetic(
	ref: RefObject<HTMLElement | null>,
	strength = 0.3,
) {
	useEffect(() => {
		const el = ref.current
		if (!el) return

		const prefersReducedMotion =
			window.matchMedia(
				'(prefers-reduced-motion: reduce)',
			).matches
		if (prefersReducedMotion) return

		function handleMove(e: MouseEvent) {
			if (!el) return
			const rect = el.getBoundingClientRect()
			const x =
				e.clientX - rect.left - rect.width / 2
			const y =
				e.clientY - rect.top - rect.height / 2
			gsap.to(el, {
				x: x * strength,
				y: y * strength,
				duration: 0.3,
				ease: "power2.out",
			})
		}

		function handleLeave() {
			if (!el) return
			gsap.to(el, {
				x: 0,
				y: 0,
				duration: 0.5,
				ease: "elastic.out(1, 0.3)",
			})
		}

		el.addEventListener("mousemove", handleMove)
		el.addEventListener("mouseleave", handleLeave)

		return () => {
			el.removeEventListener("mousemove", handleMove)
			el.removeEventListener(
				"mouseleave",
				handleLeave,
			)
		}
	}, [ref, strength])
}
