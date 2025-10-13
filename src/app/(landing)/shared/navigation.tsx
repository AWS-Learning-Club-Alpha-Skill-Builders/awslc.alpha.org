"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavigationProps {
  onLoginClick: () => void
  onSignupClick: () => void
}

export default function Navigation({ onLoginClick, onSignupClick }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#vision", label: "Vision" },
    { href: "#modules", label: "Modules" },
    { href: "#events", label: "Events" },
    { href: "#members", label: "Team" },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 lg:w-12 lg:h-12">
              <Image
                src="/Logo (2).png"
                alt="AWS Learning Club Logo"
                fill
                className="object-contain transition-transform group-hover:scale-110"
              />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm lg:text-base font-semibold text-[#232f3e]">AWS Learning Club</div>
              <div className="text-xs text-muted-foreground">RTU - BONI</div>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#232f3e] hover:text-[#ff9900] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" onClick={onLoginClick} className="text-[#232f3e] hover:text-[#ff9900]">
              Log in
            </Button>
            <Button onClick={onSignupClick} className="bg-[#ff9900] hover:bg-[#ec8800] text-white font-semibold">
              Join Club
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#232f3e] hover:text-[#ff9900] transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-medium text-[#232f3e] hover:text-[#ff9900] transition-colors py-2"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  onClick={() => {
                    onLoginClick()
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full justify-start text-[#232f3e] hover:text-[#ff9900]"
                >
                  Log in
                </Button>
                <Button
                  onClick={() => {
                    onSignupClick()
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full bg-[#ff9900] hover:bg-[#ec8800] text-white font-semibold"
                >
                  Join Club
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
