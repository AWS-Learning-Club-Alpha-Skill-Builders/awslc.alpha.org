"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Linkedin, Mail, Globe, Facebook } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function CoreMembers() {
  const sectionRef = useRef<HTMLElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  // Drag state
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  
  // Touch state for mobile
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [isHorizontalScrolling, setIsHorizontalScrolling] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial state for mobile compatibility
      gsap.set(".member-card", {
        x: 100,
        opacity: 0,
      })

      // Create the animation with better mobile support
      const tl = gsap.to(".member-card", {
        x: 0,
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
          gsap.set(".member-card", { clearProps: "x,opacity" })
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

  // Drag to scroll functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return
    setIsDragging(true)
    setStartX(e.pageX)
    setScrollLeft(scrollContainerRef.current.scrollLeft)
    scrollContainerRef.current.style.cursor = 'grabbing'
    scrollContainerRef.current.style.scrollSnapType = 'none'
    e.preventDefault()
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab'
      scrollContainerRef.current.style.scrollSnapType = 'x mandatory'
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return
    e.preventDefault()
    
    const currentX = e.pageX
    const deltaX = startX - currentX
    const newScrollLeft = scrollLeft + deltaX
    
    scrollContainerRef.current.scrollLeft = newScrollLeft
  }

  // Touch handlers for mobile with direction detection
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return
    
    const touch = e.touches[0]
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
    })
    setIsHorizontalScrolling(false)
    setScrollLeft(scrollContainerRef.current.scrollLeft)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart || !scrollContainerRef.current) return
    
    const touch = e.touches[0]
    const deltaX = touchStart.x - touch.clientX
    const deltaY = touchStart.y - touch.clientY
    
    // Determine if user intends to scroll horizontally or vertically
    // Use a threshold to determine intent (10px minimum movement)
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)
    
    // If horizontal movement is greater than vertical, allow horizontal scroll
    if (absDeltaX > absDeltaY && absDeltaX > 10) {
      if (!isHorizontalScrolling) {
        setIsHorizontalScrolling(true)
      }
      e.preventDefault()
      const newScrollLeft = scrollLeft + deltaX
      scrollContainerRef.current.scrollLeft = newScrollLeft
    } else if (absDeltaY > absDeltaX && absDeltaY > 10) {
      // User is scrolling vertically - don't interfere
      setTouchStart(null)
      setIsHorizontalScrolling(false)
      return
    }
  }

  const handleTouchEnd = () => {
    setTouchStart(null)
    setIsHorizontalScrolling(false)
  }


  const members = [
    {
      name: "Catherine Notado",
      role: "Founder, University Captain, and Chief Executive Officer",
      description: "Leading the AWS Learning Club with vision and passion for cloud education.",
      image: "/board-members/notado.webp",
      linkedin: "https://www.linkedin.com/in/catherine-notado-679a29246",
      email: "notadocath@gmail.com",
      facebook: "https://www.facebook.com/profile.php?id=100009325386830",
    },
    {
      name: "Emmanuel Toraja Fabella",
      role: "Executive Secretary and Founding Member",
      description: "Ensuring smooth operations and organizational excellence.",
      image: "/board-members/fabella.webp",
      linkedin: "https://www.linkedin.com/in/emmanuel-fabella/",
      email: "emmanuelfabella606@gmail.com",
      facebook: "https://www.facebook.com/1emmanuelfabella1",
    },
    {
      name: "Ram Christopher Broqueza Baarde",
      role: "Co-Founder, Co-Captain, and Chief Finance Officer",
      description: "Strategic financial management and co-leadership of the club.",
      image: "/board-members/baarde.webp",
      linkedin: "https://www.linkedin.com/in/rambaarde-software",
      email: "ramchrist20@gmail.com",
      blog: "https://blogsrambaarde.vercel.app/",
      facebook: "https://www.facebook.com/ramchristopher.software/",
    },
    {
      name: "Jin Anthony Serna Pradas",
      role: "Chief Operations Officer and Founding Member",
      description: "Overseeing daily operations and ensuring club efficiency.",
      image: "/board-members/pradas.webp",
      linkedin: "https://www.linkedin.com/in/jin-anthony-pradas/",
      email: "jinanthonyy@gmail.com",
      facebook: "https://www.facebook.com/jinanthonyy",
    },
    {
      name: "Ashlie Mae Ignacio Orlanda",
      role: "Vice-Chief Operations Officer and Founding Member",
      description: "Supporting operations and driving organizational excellence.",
      image: "/board-members/orlanda.webp",
      email: "orlandaashliemaei@gmail.com",
      facebook: "https://www.facebook.com/strawbelie",
    },
    {
      name: "Mary Angela Kristel Garganera",
      role: "Executive Secretary of Operations and Founding Member",
      description: "Managing operational documentation and administrative excellence.",
      image: "/board-members/garganera.webp",
      linkedin: "https://www.linkedin.com/in/mary-angela-kristel-garganera-a210942ba",
      email: "maryangelakristel@gmail.com",
      facebook: "https://www.facebook.com/mary.angela.kristel",
    },
    {
      name: "Jogiofernesto Ardales",
      role: "Chief Marketing Officer and Founding Member",
      description: "Leading marketing strategies and brand promotion.",
      image: "/board-members/ardales.webp",
      linkedin: "https://www.linkedin.com/in/jogiofernesto-jr-ardales",
      email: "giofernesto@gmail.com",
      facebook: "https://www.facebook.com/gionardo.da.vinci",
    },
    {
      name: "David Aldreen Flores Marquez",
      role: "Vice-Chief Marketing Officer and Founding Member",
      description: "Supporting marketing initiatives and community outreach.",
      image: "/board-members/marquez.webp",
      linkedin: "https://www.linkedin.com/in/david-aldreen-marquez-135683394/",
      email: "aldreendavidmarquez@gmail.com",
      facebook: "https://www.facebook.com/DavidAldreenFloresMarquez",
    },
    {
      name: "Jhannelle Cabana",
      role: "Chief Relations Officer and Founding Member",
      description: "Building partnerships and managing external relationships.",
      image: "/board-members/cabana.webp",
      linkedin: "https://www.linkedin.com/in/jhannelle-cabana-b85787273",
      email: "jhannellecabana14@gmail.com",
      facebook: "https://www.facebook.com/elluna.xi",
    },
    {
      name: "Kyla Nicole Gagui",
      role: "Chief Creatives Officer and Founding Member",
      description: "Leading creative direction and visual content development.",
      image: "/board-members/gagui.webp",
      linkedin: "https://ph.linkedin.com/in/gagui-kyla-nicole-m-89424338a",
      email: "kylanicole1330@gmail.com",
      facebook: "https://www.facebook.com/kylezxnj",
    },
    {
      name: "Kristine Jamelle Ignas",
      role: "BUILDHERS+ Ambassador and Founding Member",
      description: "Representing the club in BUILDHERS+ initiatives and partnerships.",
      image: "/board-members/ignas.webp",
      linkedin: "https://www.linkedin.com/in/kristine-jamelle-ignas-6b2457303",
      email: "jamelleignas29@gmail.com",
      facebook: "https://www.facebook.com/kristinejamelle.ignas",
    },
    {
      name: "Jihad Fariq Tejam",
      role: "Skillbuilders Chairperson and Founding Member",
      description: "Leading skill development programs and educational initiatives.",
      image: "/board-members/tejam.webp",
      linkedin: "https://www.linkedin.com/in/tejam-jihad",
      email: "jihadtejam@gmail.com",
      facebook: "https://www.facebook.com/Ghadfariq.tejam",
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
            className="flex gap-4 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent hover:scrollbar-thumb-secondary-light cursor-grab select-none"
            style={{ scrollbarWidth: "thin" }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {members.map((member, index) => (
              <div
                key={index}
                className="member-card flex-shrink-0 w-72 sm:w-80 snap-start border border-border bg-surface/50 rounded-lg overflow-hidden hover:border-accent transition-all duration-300 group"
              >
                <div className="relative h-80 bg-secondary overflow-hidden">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-accent text-sm font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{member.description}</p>
                  <div className="flex gap-3">
                    {member.facebook && (
                      <a
                        href={member.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
                        aria-label="Facebook"
                      >
                        <Facebook size={16} />
                      </a>
                    )}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
                        aria-label="LinkedIn"
                      >
                        <Linkedin size={16} />
                      </a>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
                        aria-label="Email"
                      >
                        <Mail size={16} />
                      </a>
                    )}
                    {member.blog && (
                      <a
                        href={member.blog}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
                        aria-label="Blog"
                      >
                        <Globe size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Hint */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            <span className="hidden sm:inline">← Scroll or drag to see all members →</span>
            <span className="sm:hidden">← Swipe to see all members →</span>
          </p>
        </div>
      </div>
    </section>
  )
}
