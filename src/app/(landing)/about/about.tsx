"use client"

import { useEffect, useRef } from "react"
import { Award, BookOpen, Rocket, Users } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial state for mobile compatibility
      gsap.set(".about-card", {
        y: 60,
        opacity: 0,
      })

      // Create the animation with better mobile support
      const tl = gsap.to(".about-card", {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse",
          // Add mobile-specific settings
          invalidateOnRefresh: true,
          refreshPriority: -1,
        },
        // Fallback: ensure elements are visible even if ScrollTrigger fails
        onComplete: () => {
          gsap.set(".about-card", { clearProps: "y,opacity" })
        }
      })

      // Mobile fallback: show cards after a delay if ScrollTrigger doesn't fire
      const fallbackTimer = setTimeout(() => {
        if (tl.scrollTrigger && !tl.scrollTrigger.isActive) {
          tl.play()
        }
      }, 1000)

      return () => {
        clearTimeout(fallbackTimer)
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const features = [
    {
      icon: BookOpen,
      title: "Hands-On Learning",
      description: "Learn by doing with real AWS services and practical projects that build your portfolio.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Connect with fellow learners, share knowledge, and grow together in a supportive environment.",
    },
    {
      icon: Rocket,
      title: "Career Growth",
      description: "Gain industry-relevant skills and AWS certifications to accelerate your tech career.",
    },
    {
      icon: Award,
      title: "Expert Guidance",
      description: "Learn from experienced mentors and AWS-certified professionals who guide your journey.",
    },
  ]

  return (
    <section id="about" ref={sectionRef} className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            About <span className="text-accent">Our Club</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            AWS Learning Club - Alpha is a student-led community at Rizal Technological University dedicated to mastering cloud computing
            through collaborative learning and hands-on experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="about-card border border-border bg-surface/30 rounded-lg p-8 hover:border-accent transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
