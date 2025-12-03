"use client"

import { useState } from "react"
import {
  Navigation,
  Hero,
  About,
  CoreVision,
  Events,
  CoreMembers,
  Testimonials,
  Footer,
  SignupModal,
} from "@/app/(landing)"

export default function Home() {
  const [isSignupOpen, setIsSignupOpen] = useState(false)

  return (
    <main className="min-h-screen">
      <Navigation onSignupClick={() => setIsSignupOpen(true)} />
      <Hero onGetStartedClick={() => setIsSignupOpen(true)} />
      <About />
      <CoreVision />
      <Events />
      <CoreMembers />
      <Testimonials />
      <Footer />

      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
      />
    </main>
  )
}