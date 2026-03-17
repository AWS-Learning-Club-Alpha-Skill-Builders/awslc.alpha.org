import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import SmoothScroll from "@/components/smooth-scroll"
import PageLoader from "@/components/page-loader"
import ScrollProgress from "@/components/scroll-progress"

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
})

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
})

export const metadata: Metadata = {
	metadataBase: new URL(
		(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://awslc.alpha.org')
			.split(',')[0].trim(),
	),
	title:
		"AWS Learning Club - Alpha | Rizal Technological University",
	description:
		"Join the AWS Learning Club - Alpha at Rizal Technological University. Learn cloud computing, build projects, and grow your skills with AWS.",
	generator: "v0.app",
	icons: {
		icon: "/favicon.png",
		apple: "/apple-touch-icon.png",
		shortcut: "/favicon.png",
	},
	openGraph: {
		title:
			"AWS Learning Club - Alpha | Rizal Technological University",
		description:
			"Join the AWS Learning Club - Alpha at Rizal Technological University. Learn cloud computing, build projects, and grow your skills with AWS.",
		images: [
			{
				url: "/Logo (2).png",
				width: 1200,
				height: 630,
				alt: "AWS Learning Club - Alpha Logo",
			},
		],
		siteName: "AWS Learning Club - Alpha",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title:
			"AWS Learning Club - Alpha | Rizal Technological University",
		description:
			"Join the AWS Learning Club - Alpha at Rizal Technological University. Learn cloud computing, build projects, and grow your skills with AWS.",
		images: ["/Logo (2).png"],
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang="en"
			className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			suppressHydrationWarning
		>
			<body suppressHydrationWarning>
				<PageLoader />
				<ScrollProgress />
				<SmoothScroll>{children}</SmoothScroll>
			</body>
		</html>
	)
}
