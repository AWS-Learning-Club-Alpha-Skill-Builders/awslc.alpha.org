"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useRef } from "react"
import Image from "next/image"

export default function ComingSoonOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const securityKey = useRef(`awslc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)

  useEffect(() => {
    // Maximum security protection
    const createSecureOverlay = () => {
      // Remove any existing overlays
      const existingOverlays = document.querySelectorAll('[data-awslc-overlay="true"]')
      existingOverlays.forEach(overlay => overlay.remove())

      // Create new secure overlay
      const overlay = document.createElement('div')
      overlay.setAttribute('data-awslc-overlay', 'true')
      overlay.setAttribute('data-security-key', securityKey.current)
      overlay.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        z-index: 999999999 !important;
        background: rgba(0,0,0,0.2) !important;
        backdrop-filter: blur(8px) !important;
        -webkit-backdrop-filter: blur(8px) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        pointer-events: auto !important;
        user-select: none !important;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
      `

      const card = document.createElement('div')
      card.setAttribute('data-awslc-card', 'true')
      card.style.cssText = `
        background: rgba(255,255,255,0.95) !important;
        backdrop-filter: blur(12px) !important;
        -webkit-backdrop-filter: blur(12px) !important;
        border-radius: 16px !important;
        padding: 32px !important;
        max-width: 500px !important;
        width: 90% !important;
        text-align: center !important;
        box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25) !important;
        border: 1px solid rgba(255,255,255,0.2) !important;
        position: relative !important;
        z-index: 1000000000 !important;
      `

      // Add content
      card.innerHTML = `
        <div style="margin-bottom: 24px;">
          <img src="/Logo (2).png" alt="AWS Learning Club Logo" style="width: 64px; height: 64px; object-fit: contain; margin: 0 auto 16px;">
        </div>
        <h1 style="font-size: 2rem; font-weight: bold; margin-bottom: 16px; color: #232f3e;">
          Coming <span style="color: #ff9900;">Soon</span>
        </h1>
        <p style="color: #666; margin-bottom: 24px; line-height: 1.6;">
          We're putting the finishing touches on our AWS Learning Club website. Stay tuned for an amazing learning experience!
        </p>
        <button onclick="window.open('mailto:awslc.alpha@gmail.com?subject=Stay Updated - AWS Learning Club&body=Hi! I would like to stay updated about AWS Learning Club activities and events.')" 
                style="background: #ff9900; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; margin-bottom: 24px;">
          Stay Updated
        </button>
        <div style="border-top: 1px solid #e5e5e5; padding-top: 24px;">
          <p style="font-size: 14px; color: #666;">AWS Learning Club - Alpha | RTU-BONI</p>
        </div>
      `

      overlay.appendChild(card)
      document.body.appendChild(overlay)

      return { overlay, card }
    }

    // Security monitoring and restoration
    const securityMonitor = () => {
      // Check if overlay exists
      const overlay = document.querySelector('[data-awslc-overlay="true"]')
      if (!overlay || !document.body.contains(overlay)) {
        createSecureOverlay()
        return
      }

      // Check if overlay is hidden
      const overlayElement = overlay as HTMLElement
      if (overlayElement.style.display === 'none' || 
          overlayElement.style.visibility === 'hidden' ||
          overlayElement.style.opacity === '0' ||
          overlayElement.style.zIndex === '-1') {
        overlayElement.remove()
        createSecureOverlay()
        return
      }

      // Check if card exists and is visible
      const card = overlay.querySelector('[data-awslc-card="true"]')
      if (!card) {
        overlay.remove()
        createSecureOverlay()
        return
      }

      const cardElement = card as HTMLElement
      if (cardElement.style.display === 'none' || 
          cardElement.style.visibility === 'hidden') {
        cardElement.style.display = 'block !important'
        cardElement.style.visibility = 'visible !important'
      }

      // Ensure overlay is on top
      overlayElement.style.zIndex = '999999999 !important'
    }

    // Create initial overlay
    createSecureOverlay()

    // Security monitoring intervals
    const interval1 = setInterval(securityMonitor, 50) // Every 50ms
    const interval2 = setInterval(securityMonitor, 100) // Every 100ms
    const interval3 = setInterval(securityMonitor, 500) // Every 500ms

    // DOM mutation observer
    const observer = new MutationObserver((mutations) => {
      let shouldRestore = false
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.removedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element
              if (element.hasAttribute('data-awslc-overlay') || 
                  element.querySelector('[data-awslc-overlay="true"]')) {
                shouldRestore = true
              }
            }
          })
        }
        if (mutation.type === 'attributes') {
          const target = mutation.target as HTMLElement
          if (target.hasAttribute('data-awslc-overlay') || 
              target.hasAttribute('data-awslc-card')) {
            shouldRestore = true
          }
        }
      })
      if (shouldRestore) {
        setTimeout(securityMonitor, 10)
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class', 'data-awslc-overlay', 'data-awslc-card']
    })

    // Prevent all dev tools and shortcuts
    const preventDevTools = (e: KeyboardEvent) => {
      const forbiddenKeys = [
        'F12',
        'F11',
        'F5',
        'Ctrl+Shift+I',
        'Ctrl+Shift+J',
        'Ctrl+Shift+C',
        'Ctrl+U',
        'Ctrl+S',
        'Ctrl+A',
        'Ctrl+P',
        'Ctrl+Shift+P'
      ]
      
      const keyCombo = e.ctrlKey ? `Ctrl+${e.key}` : 
                      e.shiftKey ? `Shift+${e.key}` : 
                      e.altKey ? `Alt+${e.key}` : e.key

      if (forbiddenKeys.includes(keyCombo) || 
          forbiddenKeys.includes(e.key) ||
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.shiftKey && e.key === 'J') ||
          (e.ctrlKey && e.shiftKey && e.key === 'C') ||
          (e.ctrlKey && e.key === 'U') ||
          (e.ctrlKey && e.key === 'S') ||
          (e.ctrlKey && e.key === 'P') ||
          (e.ctrlKey && e.shiftKey && e.key === 'P')) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    }

    // Prevent right-click and text selection
    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      return false
    }

    const preventSelection = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
      return false
    }

    // Prevent drag and drop
    const preventDragDrop = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      return false
    }

    // Add all event listeners
    document.addEventListener('contextmenu', preventContextMenu, true)
    document.addEventListener('selectstart', preventSelection, true)
    document.addEventListener('dragstart', preventDragDrop, true)
    document.addEventListener('keydown', preventDevTools, true)
    document.addEventListener('keyup', preventDevTools, true)

    // Disable console
    const disableConsole = () => {
      const noop = () => {}
      window.console.log = noop
      window.console.warn = noop
      window.console.error = noop
      window.console.info = noop
      window.console.debug = noop
      window.console.trace = noop
      window.console.table = noop
      window.console.group = noop
      window.console.groupEnd = noop
      window.console.time = noop
      window.console.timeEnd = noop
    }

    disableConsole()

    // Cleanup function
    return () => {
      clearInterval(interval1)
      clearInterval(interval2)
      clearInterval(interval3)
      observer.disconnect()
      document.removeEventListener('contextmenu', preventContextMenu, true)
      document.removeEventListener('selectstart', preventSelection, true)
      document.removeEventListener('dragstart', preventDragDrop, true)
      document.removeEventListener('keydown', preventDevTools, true)
      document.removeEventListener('keyup', preventDevTools, true)
    }
  }, [])

  // Return null since we're creating the overlay dynamically
  return null
}
