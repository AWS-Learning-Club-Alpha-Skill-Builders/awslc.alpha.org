"use client"

import { useEffect, type RefObject } from "react"
import gsap from "gsap"

export function useTilt(
	ref: RefObject<HTMLElement | null>,
	maxRotation = 12,
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
				(e.clientX - rect.left) / rect.width - 0.5
			const y =
				(e.clientY - rect.top) / rect.height - 0.5
			gsap.to(el, {
				rotateY: x * maxRotation,
				rotateX: -y * maxRotation,
				transformPerspective: 800,
				duration: 0.4,
				ease: "power2.out",
			})
		}

		function handleLeave() {
			if (!el) return
			gsap.to(el, {
				rotateY: 0,
				rotateX: 0,
				duration: 0.6,
				ease: "power3.out",
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
	}, [ref, maxRotation])
}
