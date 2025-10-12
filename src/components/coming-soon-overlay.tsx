"use client"

import { Button } from "@/components/ui/button"

export default function ComingSoonOverlay() {

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Blurred Background Overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      
      {/* Content Container */}
      <div className="relative z-10 max-w-lg mx-auto px-6 text-center">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8">

          {/* Logo */}
          <div className="mb-6">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <img
                src="/Logo (2).png"
                alt="AWS Learning Club Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Main Content */}
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-[#232f3e]">
            Coming <span className="text-[#ff9900]">Soon</span>
          </h1>
          
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            We're putting the finishing touches on our AWS Learning Club website. 
            Stay tuned for an amazing learning experience!
          </p>

          {/* Action Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              className="bg-[#ff9900] hover:bg-[#ec8800] text-white font-semibold px-6 py-2"
              onClick={() => window.open('mailto:awslc.alpha@gmail.com?subject=Stay Updated - AWS Learning Club&body=Hi! I would like to stay updated about AWS Learning Club activities and events.')}
            >
              Stay Updated
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              AWS Learning Club - Alpha | RTU-BONI
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
