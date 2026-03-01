"use client"

import {
	Linkedin,
	Mail,
	Facebook,
	Twitter,
	Instagram,
} from "lucide-react"
import Image from "next/image"

const SOCIAL_LINKS = [
	{
		href: "https://www.facebook.com/AWSLearningClubAlpha",
		label: "Facebook",
		icon: Facebook,
	},
	{
		href: "https://x.com/awslc_alpha",
		label: "Twitter",
		icon: Twitter,
	},
	{
		href: "https://linkedin.com/company/aws-learning-club-alpha",
		label: "LinkedIn",
		icon: Linkedin,
	},
	{
		href: "https://instagram.com/awslc.alpha",
		label: "Instagram",
		icon: Instagram,
	},
]

export default function Footer() {
	return (
		<footer
			data-theme="dark"
			className="section-darker py-16 px-4 sm:px-6 lg:px-8"
		>
			<div className="container mx-auto max-w-6xl">
				{/* Large decorative heading */}
				<div
					className="text-center mb-16"
				>
					<div
						className="urban-starblues text-4xl
							sm:text-6xl lg:text-8xl xl:text-9xl
							text-[#ff9900]/15 select-none
							leading-[0.9] whitespace-nowrap
							py-1"
					>
						AWS Learning Club
					</div>
				</div>

				{/* Gradient top border */}
				<div
					className="h-px mb-12 bg-gradient-to-r
						from-transparent via-[#ff9900]/30
						to-transparent"
				/>

				<div
					className="grid grid-cols-1 md:grid-cols-4
						gap-10 lg:gap-16 mb-12"
				>
					{/* Brand */}
					<div className="md:col-span-2">
						<div
							className="flex items-center gap-3
								mb-4"
						>
							<div className="relative w-10 h-10">
								<Image
									src="/Logo (2).png"
									alt="AWS Learning Club Logo"
									fill
									className="object-contain"
								/>
							</div>
							<div>
								<div
									className="text-base font-semibold
										text-white"
								>
									AWS Learning Club - Alpha
								</div>
								<div
									className="text-xs
										text-white/40"
								>
									Rizal Technological University
								</div>
							</div>
						</div>
						<p
							className="text-sm text-white/40
								leading-relaxed mb-6 max-w-sm"
						>
							Empowering students with AWS skills and
							cloud computing knowledge through
							hands-on learning and community
							collaboration.
						</p>

						{/* Social icons */}
						<div className="flex gap-3">
							{SOCIAL_LINKS.map((social) => {
								const Icon = social.icon
								return (
									<a
										key={social.label}
										href={social.href}
										target="_blank"
										rel="noopener noreferrer"
										className="w-10 h-10 rounded-full
											border border-white/10
											flex items-center
											justify-center text-white/50
											hover:border-[#ff9900]
											hover:text-[#ff9900]
											hover:scale-110
											transition-all duration-300"
										aria-label={social.label}
									>
										<Icon size={16} />
									</a>
								)
							})}
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h3
							className="font-semibold text-white
								mb-4 text-sm uppercase
								tracking-wider"
						>
							Quick Links
						</h3>
						<ul className="space-y-3">
							<li>
								<a
									href="#about"
									className="text-sm text-white/50
										hover:text-[#ff9900]
										transition-colors"
								>
									About Us
								</a>
							</li>
							<li>
								<a
									href="/events"
									className="text-sm text-white/50
										hover:text-[#ff9900]
										transition-colors"
								>
									Events
								</a>
							</li>
							<li>
								<a
									href="#members"
									className="text-sm text-white/50
										hover:text-[#ff9900]
										transition-colors"
								>
									Our Team
								</a>
							</li>
						</ul>
					</div>

					{/* Contact */}
					<div>
						<h3
							className="font-semibold text-white
								mb-4 text-sm uppercase
								tracking-wider"
						>
							Contact
						</h3>
						<ul className="space-y-3">
							<li
								className="flex items-center gap-2
									text-sm text-white/50"
							>
								<Mail
									size={14}
									className="text-[#ff9900]"
								/>
								<a
									href="mailto:awslc.alpha@gmail.com"
									className="hover:text-[#ff9900]
										transition-colors"
								>
									awslc.alpha@gmail.com
								</a>
							</li>
							<li
								className="text-sm text-white/50"
							>
								Rizal Technological University
							</li>
							<li
								className="text-sm text-white/50"
							>
								Boni Avenue, Mandaluyong City
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom Bar */}
				<div
					className="pt-8 border-t border-white/10
						flex flex-col sm:flex-row items-center
						justify-between gap-4"
				>
					<p className="text-sm text-white/30">
						&copy; {new Date().getFullYear()} AWS
						Learning Club - Alpha. All rights
						reserved.
					</p>
					<div
						className="urban-starblues text-white/10
							text-lg select-none"
					>
						Day One
					</div>
				</div>
			</div>
		</footer>
	)
}
