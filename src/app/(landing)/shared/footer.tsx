import { Github, Linkedin, Mail, Facebook, Twitter } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10">
                <Image
                  src="/Logo (2).png"
                  alt="AWS Learning Club Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <div className="text-base font-semibold">AWS Learning Club - Alpha</div>
                <div className="text-xs text-muted-foreground">RTU - BONI</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Empowering students with AWS skills and cloud computing knowledge through hands-on learning and community
              collaboration.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#modules" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  Learning Modules
                </a>
              </li>
              <li>
                <a href="#events" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  Events
                </a>
              </li>
              <li>
                <a href="#members" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  Our Team
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail size={16} className="text-accent" />
                <a href="mailto:awslc.alpha@gmail.com" className="hover:text-accent transition-colors">
                  awslc.alpha@gmail.com
                </a>
              </li>
              <li className="text-sm text-muted-foreground">Rizal Technological University</li>
              <li className="text-sm text-muted-foreground">Boni Avenue, Mandaluyong City</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AWS Learning Club - Alpha. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
