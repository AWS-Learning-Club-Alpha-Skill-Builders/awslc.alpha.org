"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { Target, Lightbulb, Heart } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function CoreVision() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".vision-item", {
        x: -60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="vision"
      ref={sectionRef}
      className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 border-t border-border bg-surface/20"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Our Core <span className="text-accent">Vision</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              We believe in the power of continuous learning and the Day One mentality. Every day is an opportunity to
              innovate, learn, and build something amazing.
            </p>

            <div className="space-y-6">
              <div className="vision-item flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Vision</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    As a non-academic organization, we envision a long-standing community of passionate learners from universities across the country who embrace innovation and leverage AWS to drive technological advancements.
                  </p>
                </div>
              </div>

              <div className="vision-item flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Mission</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We empower students with AWS skills through inclusive educational initiatives, community service, and networking opportunities to thrive in the digital economy and contribute to industry transformation.
                  </p>
                </div>
              </div>

              <div className="vision-item flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Values</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Collaboration, continuous learning, innovation, and inclusivity guide everything we do.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Banner Image */}
          <div className="relative">
            <div className="border border-border rounded-lg overflow-hidden bg-surface">
              <Image
                src="/Banner.png"
                alt="It's Always Day One Banner"
                width={800}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
