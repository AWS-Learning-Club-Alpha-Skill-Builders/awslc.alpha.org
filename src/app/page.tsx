import {
  Hero,
  Marquee,
  About,
  CoreVision,
  Events,
  CoreMembers,
  Testimonials,
  Contact,
  Footer,
} from "@/app/(landing)"
import ServerNavigation from "@/app/(landing)/shared/server-navigation"

export default function Home() {
  return (
    <main className="min-h-screen">
      <ServerNavigation />
      <Hero />
      <Marquee />
      <About />
      <CoreVision />
      <Events />
      <CoreMembers />
      <Contact />
      <Testimonials />
      <Footer />
    </main>
  )
}