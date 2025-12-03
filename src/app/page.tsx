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
  Contact,
  Footer,
  SignupModal,
} from "@/app/(landing)"

export default function Home() {
  const [isSignupOpen, setIsSignupOpen] = useState(false)

  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <CoreVision />
      <Events />
      <CoreMembers />
      <Testimonials />
      <Contact />
      <Footer />

      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
      />
    </main>
  )
}