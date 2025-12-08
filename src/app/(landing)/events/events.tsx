"use client"

import { useRef } from "react"
import { Calendar, MapPin, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
// import { useEffect } from "react"
// import gsap from "gsap"
// import { ScrollTrigger } from "gsap/ScrollTrigger"

// gsap.registerPlugin(ScrollTrigger)

interface Event {
  title: string
  date: string
  time: string
  location: string
  attendees: number
  type: string
}

export default function Events() {
  const sectionRef = useRef<HTMLElement>(null)

  // useEffect commented out - no cards to animate
  // useEffect(() => {
  //   const ctx = gsap.context(() => {
  //     // Set initial state for mobile compatibility
  //     gsap.set(".event-card", {
  //       y: 60,
  //       opacity: 0,
  //     })

  //     // Create the animation with better mobile support
  //     const tl = gsap.to(".event-card", {
  //       y: 0,
  //       opacity: 1,
  //       duration: 0.8,
  //       stagger: 0.15,
  //       ease: "power3.out",
  //       scrollTrigger: {
  //         trigger: sectionRef.current,
  //         start: "top 85%",
  //         end: "bottom 15%",
  //         toggleActions: "play none none reverse",
  //         // Add mobile-specific settings
  //         invalidateOnRefresh: true,
  //         refreshPriority: -1,
  //       },
  //       // Fallback: ensure elements are visible even if ScrollTrigger fails
  //       onComplete: () => {
  //         gsap.set(".event-card", { clearProps: "y,opacity" })
  //       }
  //     })

  //     // Mobile fallback: show cards after a delay if ScrollTrigger doesn't fire
  //     const fallbackTimer = setTimeout(() => {
  //       if (tl.scrollTrigger && !tl.scrollTrigger.isActive) {
  //         tl.play()
  //       }
  //     }, 1000)

  //     return () => {
  //       clearTimeout(fallbackTimer)
  //     }
  //   }, sectionRef)

  //   return () => ctx.revert()
  // }, [])

  // Events array commented out to avoid Sanity CMS connections
  // const events = [
  //   {
  //     title: "AWS Cloud Practitioner Workshop",
  //     date: "March 15, 2025",
  //     time: "2:00 PM - 5:00 PM",
  //     location: "Rizal Technological University Computer Lab",
  //     attendees: 45,
  //     type: "Workshop",
  //   },
  //   {
  //     title: "Serverless Architecture Bootcamp",
  //     date: "March 22, 2025",
  //     time: "1:00 PM - 6:00 PM",
  //     location: "Rizal Technological University Auditorium",
  //     attendees: 60,
  //     type: "Bootcamp",
  //   },
  //   {
  //     title: "AWS Solutions Architect Study Group",
  //     date: "Every Saturday",
  //     time: "10:00 AM - 12:00 PM",
  //     location: "Rizal Technological University Library",
  //     attendees: 25,
  //     type: "Study Group",
  //   },
  // ]

  const events: Event[] = []

  return (
    <section
      id="events"
      ref={sectionRef}
      className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 border-t border-border bg-surface/20"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Upcoming <span className="text-accent">Events</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Join our workshops, bootcamps, and study sessions to accelerate your AWS learning journey.
          </p>
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <div
                key={index}
                className="event-card border border-border bg-surface/50 rounded-lg p-6 hover:border-accent transition-all duration-300 group"
              >
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-accent/10 text-accent border border-accent/20">
                    {event.type}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-4 group-hover:text-accent transition-colors">{event.title}</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 text-accent" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 text-accent" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-accent" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4 text-accent" />
                    {event.attendees} attendees
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-border hover:border-accent hover:text-accent bg-transparent"
                >
                  Register Now
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No events</p>
          </div>
        )}
      </div>
    </section>
  )
}
