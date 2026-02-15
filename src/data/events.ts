export interface Event {
  id: string
  title: string
  description: string
  date: string // ISO date string (YYYY-MM-DD)
  time: string
  location: string
  type: string
  image: string
  registrationLink?: string
}

export const events: Event[] = [
  {
    id: "cloud-practitioner-workshop",
    title: "AWS Cloud Practitioner Workshop",
    description:
      "Get started with AWS fundamentals in this hands-on workshop covering core cloud concepts, AWS services, security, and pricing models. Perfect for beginners looking to earn their first AWS certification.",
    date: "2026-03-15",
    time: "2:00 PM - 5:00 PM",
    location: "Rizal Technological University Computer Lab",
    type: "Workshop",
    image: "/Banner.png",
    registrationLink: "https://meetup.com/placeholder",
  },
  {
    id: "serverless-bootcamp",
    title: "Serverless Architecture Bootcamp",
    description:
      "Dive deep into serverless computing with AWS Lambda, API Gateway, and DynamoDB. Build and deploy a full serverless application from scratch during this intensive bootcamp session.",
    date: "2026-03-22",
    time: "1:00 PM - 6:00 PM",
    location: "Rizal Technological University Auditorium",
    type: "Bootcamp",
    image: "/Banner.png",
    registrationLink: "https://meetup.com/placeholder",
  },
  {
    id: "solutions-architect-study",
    title: "AWS Solutions Architect Study Group",
    description:
      "Weekly collaborative study sessions covering the AWS Solutions Architect Associate exam topics. Review practice questions, discuss architecture patterns, and share learning strategies with peers.",
    date: "2026-04-05",
    time: "10:00 AM - 12:00 PM",
    location: "Rizal Technological University Library",
    type: "Study Group",
    image: "/Banner.png",
    registrationLink: "https://meetup.com/placeholder",
  },
  {
    id: "ai-ml-on-aws",
    title: "AI & Machine Learning on AWS",
    description:
      "Explore AWS AI/ML services including SageMaker, Rekognition, and Comprehend. Learn how to build intelligent applications without deep ML expertise through hands-on demos and exercises.",
    date: "2026-04-12",
    time: "2:00 PM - 5:00 PM",
    location: "Rizal Technological University Computer Lab",
    type: "Workshop",
    image: "/Banner.png",
    registrationLink: "https://meetup.com/placeholder",
  },
  {
    id: "cloud-security-essentials",
    title: "Cloud Security Essentials",
    description:
      "Learn the fundamentals of securing your AWS infrastructure. Covering IAM best practices, VPC security, encryption, and compliance frameworks essential for every cloud practitioner.",
    date: "2026-04-19",
    time: "1:00 PM - 4:00 PM",
    location: "Rizal Technological University Auditorium",
    type: "Seminar",
    image: "/Banner.png",
    registrationLink: "https://meetup.com/placeholder",
  },
  // Past events
  {
    id: "aws-intro-night",
    title: "Introduction to AWS Night",
    description:
      "A fun introductory evening session where students learned what AWS is, explored the management console, and launched their first EC2 instance. Great turnout from freshmen and sophomores.",
    date: "2025-11-10",
    time: "6:00 PM - 8:00 PM",
    location: "Rizal Technological University Function Hall",
    type: "Meetup",
    image: "/Banner.png",
  },
  {
    id: "hackathon-2025",
    title: "AWSLC Alpha Hackathon 2025",
    description:
      "Our first ever hackathon! Teams of 3-5 students built cloud-powered projects over 24 hours. Projects ranged from serverless chatbots to real-time data dashboards. Amazing creativity from all participants.",
    date: "2026-01-18",
    time: "9:00 AM - 9:00 AM (next day)",
    location: "Rizal Technological University Main Building",
    type: "Hackathon",
    image: "/Banner.png",
  },
  {
    id: "resume-building-with-aws",
    title: "Resume Building with AWS Certifications",
    description:
      "Industry professionals shared tips on how AWS certifications boost career prospects. Students learned about certification paths, exam preparation strategies, and how to showcase cloud skills to employers.",
    date: "2026-02-08",
    time: "3:00 PM - 5:00 PM",
    location: "Rizal Technological University Auditorium",
    type: "Talk",
    image: "/Banner.png",
  },
]

/**
 * Format an ISO date string to a readable format.
 * e.g. "2026-03-15" -> "March 15, 2026"
 */
export function formatEventDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/** Check if an event date is in the future (upcoming). */
export function isUpcoming(dateStr: string): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const eventDate = new Date(dateStr + "T00:00:00")
  return eventDate >= today
}

/** Get all upcoming events sorted by date ascending (soonest first). */
export function getUpcomingEvents(): Event[] {
  return events
    .filter((e) => isUpcoming(e.date))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

/** Get all past (held) events sorted by date descending (most recent first). */
export function getPastEvents(): Event[] {
  return events
    .filter((e) => !isUpcoming(e.date))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/** Get the top N upcoming events. */
export function getTopUpcomingEvents(count: number): Event[] {
  return getUpcomingEvents().slice(0, count)
}
