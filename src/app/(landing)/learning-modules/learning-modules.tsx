"use client"

import { useEffect, useRef } from "react"
import { Database, Globe, Lock, Server, Cpu, Cloud } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function LearningModules() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial state for mobile compatibility
      gsap.set(".module-card", {
        y: 60,
        opacity: 0,
      })

      // Create the animation with better mobile support
      const tl = gsap.to(".module-card", {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
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
          gsap.set(".module-card", { clearProps: "y,opacity" })
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

  const modules = [
    {
      icon: Cloud,
      title: "AWS Fundamentals",
      description: "Master the basics of cloud computing and AWS core services.",
      topics: ["EC2", "S3", "IAM", "VPC"],
    },
    {
      icon: Server,
      title: "Compute Services",
      description: "Learn to deploy and manage applications on AWS compute platforms.",
      topics: ["Lambda", "ECS", "Elastic Beanstalk"],
    },
    {
      icon: Database,
      title: "Database Solutions",
      description: "Explore AWS database services for different use cases.",
      topics: ["RDS", "DynamoDB", "Aurora"],
    },
    {
      icon: Lock,
      title: "Security & Identity",
      description: "Implement security best practices and identity management.",
      topics: ["IAM", "Cognito", "KMS", "WAF"],
    },
    {
      icon: Globe,
      title: "Networking & CDN",
      description: "Build scalable and secure network architectures.",
      topics: ["CloudFront", "Route 53", "VPC"],
    },
    {
      icon: Cpu,
      title: "DevOps & CI/CD",
      description: "Automate deployments and implement DevOps practices.",
      topics: ["CodePipeline", "CloudFormation"],
    },
  ]

  return (
    <section id="modules" ref={sectionRef} className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Learning <span className="text-accent">Modules</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Comprehensive curriculum covering essential AWS services and cloud computing concepts through hands-on
            projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => {
            const Icon = module.icon
            return (
              <div
                key={index}
                className="module-card border border-border bg-surface/30 rounded-lg p-6 hover:border-accent transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">{module.description}</p>
                <div className="flex flex-wrap gap-2">
                  {module.topics.map((topic, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
