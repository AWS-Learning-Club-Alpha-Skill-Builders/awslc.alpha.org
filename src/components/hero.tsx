"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Cloud, Code, Users } from "lucide-react"
import gsap from "gsap"

interface HeroProps {
  onGetStartedClick: () => void
}

export default function Hero({ onGetStartedClick }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      })

      gsap.from(subtitleRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: "power3.out",
      })

      gsap.from(buttonsRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.4,
        ease: "power3.out",
      })

      gsap.from(statsRef.current?.children || [], {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.6,
        stagger: 0.1,
        ease: "power3.out",
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-white via-orange-50/30 to-white"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)] opacity-40" />

      <div className="container mx-auto relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Logo Badge */}
          <div className="inline-block mb-8">
            <div className="relative w-24 h-24 lg:w-32 lg:h-32 mx-auto">
              <Image
                src="/Logo (2).png"
                alt="AWS Learning Club Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Main Heading */}
          <h1 ref={titleRef} className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 text-balance text-[#232f3e]">
            It's Always <span className="text-[#ff9900] urban-starblues">Day One</span>
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto text-pretty leading-relaxed"
          >
            Join AWS Learning Club - Alpha at RTU-BONI. Learn cloud computing, build real-world projects, and accelerate
            your career with hands-on AWS training.
          </p>

          {/* CTA Buttons */}
          <div ref={buttonsRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Button
              size="lg"
              onClick={onGetStartedClick}
              className="bg-[#ff9900] hover:bg-[#ec8800] text-white font-semibold text-base px-8 py-6 group"
            >
              Get Started
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-[#232f3e] text-[#232f3e] hover:bg-[#232f3e] hover:text-white text-base px-8 py-6 bg-transparent"
            >
              <a href="#about">Learn More</a>
            </Button>
          </div>

          {/* Stats Grid */}
          <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-[#ff9900] hover:shadow-lg transition-all">
              <Cloud className="w-8 h-8 text-[#ff9900] mb-3 mx-auto" />
              <div className="text-3xl font-bold mb-2 text-[#232f3e]">50+</div>
              <div className="text-sm text-muted-foreground">Active Members</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-[#ff9900] hover:shadow-lg transition-all">
              <Code className="w-8 h-8 text-[#ff9900] mb-3 mx-auto" />
              <div className="text-3xl font-bold mb-2 text-[#232f3e]">20+</div>
              <div className="text-sm text-muted-foreground">Projects Built</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-[#ff9900] hover:shadow-lg transition-all">
              <Users className="w-8 h-8 text-[#ff9900] mb-3 mx-auto" />
              <div className="text-3xl font-bold mb-2 text-[#232f3e]">15+</div>
              <div className="text-sm text-muted-foreground">Workshops Held</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
