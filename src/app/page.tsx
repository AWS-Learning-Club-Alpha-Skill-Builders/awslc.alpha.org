import {
  Navigation,
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

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
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