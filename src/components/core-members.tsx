"use client"

import { useEffect, useRef } from "react"
import { Github, Linkedin, Mail } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function CoreMembers() {
  const sectionRef = useRef<HTMLElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".member-card", {
        x: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const members = [
    {
      name: "Maria Santos",
      role: "Club President",
      description: "AWS Solutions Architect Associate. Passionate about cloud infrastructure and DevOps.",
      image: "/professional-woman-portrait.png",
    },
    {
      name: "Juan Dela Cruz",
      role: "Vice President",
      description: "AWS Developer Associate. Specializes in serverless architectures and full-stack development.",
      image: "/professional-man-portrait.png",
    },
    {
      name: "Sofia Reyes",
      role: "Technical Lead",
      description: "AWS SysOps Administrator. Expert in cloud security and infrastructure automation.",
      image: "/professional-woman-tech.jpg",
    },
    {
      name: "Carlos Mendoza",
      role: "Events Coordinator",
      description: "AWS Cloud Practitioner. Organizes workshops and community engagement activities.",
      image: "/professional-man-smiling.png",
    },
    {
      name: "Ana Garcia",
      role: "Content Creator",
      description: "AWS Developer Associate. Creates learning materials and technical documentation.",
      image: "/professional-woman-creative.png",
    },
    {
      name: "Miguel Torres",
      role: "Community Manager",
      description: "AWS Cloud Practitioner. Manages social media and member engagement.",
      image: "/professional-man-friendly.jpg",
    },
  ]

  return (
    <section id="members" ref={sectionRef} className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Core <span className="text-accent">Team</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Meet the dedicated leaders driving our mission to empower students with AWS skills.
          </p>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent hover:scrollbar-thumb-secondary-light"
            style={{ scrollbarWidth: "thin" }}
          >
            {members.map((member, index) => (
              <div
                key={index}
                className="member-card flex-shrink-0 w-80 snap-start border border-border bg-surface/50 rounded-lg overflow-hidden hover:border-accent transition-all duration-300 group"
              >
                <div className="relative h-80 bg-secondary overflow-hidden">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-accent text-sm font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{member.description}</p>
                  <div className="flex gap-3">
                    <a
                      href="#"
                      className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
                      aria-label="GitHub"
                    >
                      <Github size={16} />
                    </a>
                    <a
                      href="#"
                      className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin size={16} />
                    </a>
                    <a
                      href="#"
                      className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
                      aria-label="Email"
                    >
                      <Mail size={16} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Hint */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">← Scroll to see all members →</p>
        </div>
      </div>
    </section>
  )
}
