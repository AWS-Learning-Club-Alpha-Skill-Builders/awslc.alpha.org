"use client"

import { useState } from "react"
import {
  Navigation,
  Hero,
  About,
  CoreVision,
  LearningModules,
  Events,
  CoreMembers,
  Testimonials,
  Footer,
  LoginModal,
  SignupModal,
} from "@/app/(landing)"

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