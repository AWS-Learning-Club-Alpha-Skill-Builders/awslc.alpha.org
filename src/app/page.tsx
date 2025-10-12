"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Hero from "@/components/hero"
import About from "@/components/about"
import CoreVision from "@/components/core-vision"
import LearningModules from "@/components/learning-modules"
import Events from "@/components/events"
import CoreMembers from "@/components/core-members"
import Testimonials from "@/components/testimonials"
import Footer from "@/components/footer"
import LoginModal from "@/components/login-modal"
import SignupModal from "@/components/signup-modal"

export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSignupOpen, setIsSignupOpen] = useState(false)

  return (
    <main className="min-h-screen">
      <Navigation onLoginClick={() => setIsLoginOpen(true)} onSignupClick={() => setIsSignupOpen(true)} />
      <Hero onGetStartedClick={() => setIsSignupOpen(true)} />
      <About />
      <CoreVision />
      <LearningModules />
      <Events />
      <CoreMembers />
      <Testimonials />
      <Footer />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToSignup={() => {
          setIsLoginOpen(false)
          setIsSignupOpen(true)
        }}
      />
      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onSwitchToLogin={() => {
          setIsSignupOpen(false)
          setIsLoginOpen(true)
        }}
      />
    </main>
  )
}