"use client"

import { useState, useEffect, useRef } from "react"
import { Mail, ArrowRight } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useMagnetic } from "@/hooks/use-magnetic"

gsap.registerPlugin(ScrollTrigger)

function FloatingInput({
	id,
	label,
	type = "text",
	value,
	onChange,
	error,
}: {
	id: string
	label: string
	type?: string
	value: string
	onChange: (v: string) => void
	error?: string
}) {
	const [focused, setFocused] = useState(false)
	const isActive = focused || value.length > 0

	return (
		<div className="relative">
			<input
				id={id}
				type={type}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onFocus={() => setFocused(true)}
				onBlur={() => setFocused(false)}
				className="w-full px-5 py-4 pt-6 bg-white/5
					border border-white/10 rounded-2xl text-base
					text-white focus:outline-none
					focus:border-[#ff9900] transition-colors
					peer"
				placeholder=" "
			/>
			<label
				htmlFor={id}
				className={`absolute left-5 transition-all
					duration-200 pointer-events-none
					${
						isActive
							? "top-2 text-xs text-[#ff9900]"
							: "top-4.5 text-base text-white/30"
					}`}
			>
				{label}
			</label>
			{error && (
				<p className="text-red-400 text-xs mt-1.5">
					{error}
				</p>
			)}
		</div>
	)
}

function FloatingTextarea({
	id,
	label,
	value,
	onChange,
	error,
}: {
	id: string
	label: string
	value: string
	onChange: (v: string) => void
	error?: string
}) {
	const [focused, setFocused] = useState(false)
	const isActive = focused || value.length > 0

	return (
		<div className="relative">
			<textarea
				id={id}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onFocus={() => setFocused(true)}
				onBlur={() => setFocused(false)}
				rows={5}
				className="w-full px-5 py-4 pt-6 bg-white/5
					border border-white/10 rounded-2xl text-base
					text-white focus:outline-none
					focus:border-[#ff9900] transition-colors
					resize-none peer"
				placeholder=" "
			/>
			<label
				htmlFor={id}
				className={`absolute left-5 transition-all
					duration-200 pointer-events-none
					${
						isActive
							? "top-2 text-xs text-[#ff9900]"
							: "top-4.5 text-base text-white/30"
					}`}
			>
				{label}
			</label>
			{error && (
				<p className="text-red-400 text-xs mt-1.5">
					{error}
				</p>
			)}
		</div>
	)
}

export default function Contact() {
	const sectionRef = useRef<HTMLElement>(null)
	const submitBtnRef = useRef<HTMLButtonElement>(null)
	const [name, setName] = useState("")
	const [email, setEmail] = useState("")
	const [subject, setSubject] = useState("")
	const [message, setMessage] = useState("")
	const [errors, setErrors] = useState<{
		name?: string
		email?: string
		subject?: string
		message?: string
	}>({})
	const [isSubmitting, setIsSubmitting] = useState(false)

	useMagnetic(submitBtnRef, 0.15)

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.from(".contact-content", {
				y: 40,
				opacity: 0,
				duration: 0.8,
				ease: "power3.out",
				scrollTrigger: {
					trigger: sectionRef.current,
					start: "top 75%",
				},
			})
		}, sectionRef)

		return () => ctx.revert()
	}, [])

	const validateForm = () => {
		const newErrors: {
			name?: string
			email?: string
			subject?: string
			message?: string
		} = {}

		if (!name.trim()) {
			newErrors.name = "Name is required"
		}

		if (!email.trim()) {
			newErrors.email = "Email is required"
		} else if (!/\S+@\S+\.\S+/.test(email)) {
			newErrors.email = "Email is invalid"
		}

		if (!subject.trim()) {
			newErrors.subject = "Subject is required"
		}

		if (!message.trim()) {
			newErrors.message = "Message is required"
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (validateForm()) {
			setIsSubmitting(true)

			const mailtoLink = `mailto:awslc.alpha@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
				`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
			)}`

			window.location.href = mailtoLink

			setTimeout(() => {
				setName("")
				setEmail("")
				setSubject("")
				setMessage("")
				setErrors({})
				setIsSubmitting(false)
			}, 1000)
		}
	}

	return (
		<section
			id="contact"
			ref={sectionRef}
			data-theme="dark"
			className="section-dark section-padding px-4 sm:px-6
				lg:px-8"
		>
			<div
				className="contact-content container mx-auto
					max-w-6xl"
			>
				<div
					className="grid grid-cols-1 lg:grid-cols-2
						gap-12 lg:gap-20"
				>
					{/* Left: Info */}
					<div className="flex flex-col justify-center">
						<span
							className="text-xs uppercase
								tracking-[0.3em] text-[#ff9900]
								font-medium mb-6 block"
						>
							Get in Touch
						</span>
						<h2
							className="text-3xl sm:text-4xl
								lg:text-5xl xl:text-6xl
								font-bold text-white mb-6
								leading-tight"
						>
							Connect
							<br />
							With Us
						</h2>
						<p
							className="text-lg text-white/50
								leading-relaxed mb-10 max-w-md"
						>
							Have questions or want to join our
							community? We&apos;d love to hear from
							you.
						</p>

						{/* Contact info */}
						<a
							href="mailto:awslc.alpha@gmail.com"
							className="flex items-center gap-3
								text-white/60 hover:text-[#ff9900]
								transition-colors group"
						>
							<div
								className="w-10 h-10 rounded-full
									bg-white/10 flex items-center
									justify-center
									group-hover:bg-[#ff9900]/20
									transition-colors"
							>
								<Mail
									size={18}
									className="text-[#ff9900]"
								/>
							</div>
							<span>awslc.alpha@gmail.com</span>
						</a>
					</div>

					{/* Right: Form */}
					<div>
						<form
							onSubmit={handleSubmit}
							className="space-y-6"
						>
							<div
								className="grid grid-cols-1
									sm:grid-cols-2 gap-6"
							>
								<FloatingInput
									id="contact-name"
									label="Your Name"
									value={name}
									onChange={setName}
									error={errors.name}
								/>
								<FloatingInput
									id="contact-email"
									label="Email Address"
									type="email"
									value={email}
									onChange={setEmail}
									error={errors.email}
								/>
							</div>
							<FloatingInput
								id="contact-subject"
								label="Subject"
								value={subject}
								onChange={setSubject}
								error={errors.subject}
							/>
							<FloatingTextarea
								id="contact-message"
								label="Your message..."
								value={message}
								onChange={setMessage}
								error={errors.message}
							/>
							<button
								ref={submitBtnRef}
								type="submit"
								disabled={isSubmitting}
								className="inline-flex items-center
									gap-2 bg-[#ff9900] text-white
									font-semibold text-base px-8 py-4
									rounded-full hover:bg-[#ec8800]
									transition-colors
									will-change-transform
									disabled:opacity-50
									disabled:cursor-not-allowed"
							>
								{isSubmitting
									? "Sending..."
									: "Send Email"}
								<ArrowRight size={18} />
							</button>
						</form>
					</div>
				</div>
			</div>
		</section>
	)
}
