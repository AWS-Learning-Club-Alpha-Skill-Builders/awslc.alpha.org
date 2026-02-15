"use client"

import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, MapPin, ArrowLeft } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navigation, Footer } from "@/app/(landing)"
import {
  getUpcomingEvents,
  getPastEvents,
  formatEventDate,
  type Event,
} from "@/data/events"

function EventCard({ event, status }: { event: Event; status: "upcoming" | "held" }) {
  return (
    <div className="group border border-border bg-card rounded-xl overflow-hidden hover:border-accent/50 hover:shadow-lg transition-all duration-300">
      {/* Banner image */}
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge
            variant="default"
            className="bg-accent text-accent-foreground text-xs"
          >
            {event.type}
          </Badge>
          {status === "held" && (
            <Badge variant="secondary" className="text-xs">
              Held
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors line-clamp-2">
          {event.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {event.description}
        </p>

        <div className="space-y-2 mb-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 text-accent shrink-0" />
            <span>{formatEventDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 text-accent shrink-0" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-accent shrink-0" />
            <span>{event.location}</span>
          </div>
        </div>

        {status === "upcoming" && event.registrationLink && (
          <a
            href={event.registrationLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              Register Now
            </Button>
          </a>
        )}
      </div>
    </div>
  )
}

export default function EventsPage() {
  const upcoming = getUpcomingEvents()
  const past = getPastEvents()

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Page header */}
      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 border-b border-border bg-surface/20">
        <div className="container mx-auto max-w-6xl">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
            Our <span className="text-accent">Events</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl text-pretty leading-relaxed">
            Join our workshops, bootcamps, and study sessions to accelerate your
            AWS learning journey.
          </p>
        </div>
      </section>

      {/* Events content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <Tabs defaultValue="upcoming">
            <TabsList className="mb-8">
              <TabsTrigger value="upcoming">
                Upcoming
                {upcoming.length > 0 && (
                  <Badge variant="secondary" className="ml-1.5 text-[10px] px-1.5 py-0">
                    {upcoming.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="held">
                Held
                {past.length > 0 && (
                  <Badge variant="secondary" className="ml-1.5 text-[10px] px-1.5 py-0">
                    {past.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {upcoming.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcoming.map((event) => (
                    <EventCard key={event.id} event={event} status="upcoming" />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Calendar className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">
                    No upcoming events at the moment.
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Check back soon or follow us on social media for updates!
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="held">
              {past.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {past.map((event) => (
                    <EventCard key={event.id} event={event} status="held" />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Calendar className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">
                    No past events yet.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </main>
  )
}
