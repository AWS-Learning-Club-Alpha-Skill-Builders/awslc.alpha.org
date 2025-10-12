"use client"

import { useEffect, useRef } from "react"
import { Quote } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial state for mobile compatibility
      gsap.set(".testimonial-card", {
        y: 60,
        opacity: 0,
      })

      // Create the animation with better mobile support
      const tl = gsap.to(".testimonial-card", {
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
          gsap.set(".testimonial-card", { clearProps: "y,opacity" })
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

  const testimonials = [
    {
      quote:
        "Joining AWS Learning Club was the best decision for my career. I went from zero cloud knowledge to passing my AWS Solutions Architect exam in 6 months!",
      author: "Patricia Lim",
      role: "Computer Science Student",
      company: "RTU-BONI",
    },
    {
      quote:
        "The hands-on projects and supportive community helped me land my first cloud engineering internship. The mentors are incredibly knowledgeable and patient.",
      author: "Roberto Cruz",
      role: "IT Student",
      company: "RTU-BONI",
    },
    {
      quote:
        "I love the collaborative learning environment. The workshops are well-structured, and I've built real projects that I can showcase to employers.",
      author: "Isabella Ramos",
      role: "Information Systems Student",
      company: "RTU-BONI",
    },
  ]

  return (
    <section ref={sectionRef} className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 border-t border-border bg-surface/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Member <span className="text-accent">Stories</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Hear from our members about their learning journey and achievements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-card border border-border bg-surface/50 rounded-lg p-8 hover:border-accent transition-all duration-300"
            >
              <Quote className="w-10 h-10 text-accent mb-4" />
              <p className="text-muted-foreground mb-6 leading-relaxed italic">&quot;{testimonial.quote}&quot;</p>
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                <p className="text-sm text-accent">{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
