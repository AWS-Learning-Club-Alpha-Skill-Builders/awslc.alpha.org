"use client"

import { useEffect, useRef } from "react"

export default function ComingSoonOverlay() {
  const securityKey = useRef(`awslc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)

  useEffect(() => {
    // Enhanced security protection for all operating systems including Mac
    const createSecureOverlay = () => {
      // Remove any existing overlays and protection layers
      const existingOverlays = document.querySelectorAll('[data-awslc-overlay="true"]')
      const existingProtections = document.querySelectorAll('[data-awslc-protection="true"]')
      existingOverlays.forEach(overlay => overlay.remove())
      existingProtections.forEach(protection => protection.remove())

      // Create multiple protection layers to prevent bypass
      const createProtectionLayer = (zIndex: number, bgColor: string) => {
        const layer = document.createElement('div')
        layer.setAttribute('data-awslc-protection', 'true')
        layer.setAttribute('data-layer-id', zIndex.toString())
        layer.style.cssText = `
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          z-index: ${zIndex} !important;
          background: ${bgColor} !important;
          backdrop-filter: blur(${zIndex === 999999998 ? '8px' : '4px'}) !important;
          -webkit-backdrop-filter: blur(${zIndex === 999999998 ? '8px' : '4px'}) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          pointer-events: auto !important;
          user-select: none !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          -webkit-touch-callout: none !important;
          -webkit-tap-highlight-color: transparent !important;
          touch-action: none !important;
        `
        return layer
      }

      // Create main overlay with enhanced protection
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
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
        touch-action: none !important;
      `

      // Create card with enhanced protection
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
        user-select: none !important;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
        touch-action: none !important;
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

      // Add multiple protection layers
      const protectionLayer1 = createProtectionLayer(999999997, 'rgba(0,0,0,0.1)')
      const protectionLayer2 = createProtectionLayer(999999998, 'rgba(0,0,0,0.15)')

      overlay.appendChild(card)
      
      // Append all layers to body
      document.body.appendChild(protectionLayer1)
      document.body.appendChild(protectionLayer2)
      document.body.appendChild(overlay)

      return { overlay, card, protectionLayer1, protectionLayer2 }
    }

    // Enhanced security monitoring and restoration
    const securityMonitor = () => {
      // Check if overlay exists
      const overlay = document.querySelector('[data-awslc-overlay="true"]')
      const protection1 = document.querySelector('[data-awslc-protection="true"][data-layer-id="999999997"]')
      const protection2 = document.querySelector('[data-awslc-protection="true"][data-layer-id="999999998"]')
      
      if (!overlay || !document.body.contains(overlay) || 
          !protection1 || !document.body.contains(protection1) ||
          !protection2 || !document.body.contains(protection2)) {
        createSecureOverlay()
        return
      }

      // Check if overlay is hidden or tampered with
      const overlayElement = overlay as HTMLElement
      if (overlayElement.style.display === 'none' || 
          overlayElement.style.visibility === 'hidden' ||
          overlayElement.style.opacity === '0' ||
          overlayElement.style.zIndex === '-1' ||
          overlayElement.style.position !== 'fixed') {
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

      // Ensure overlay is on top and properly positioned
      overlayElement.style.zIndex = '999999999 !important'
      overlayElement.style.position = 'fixed !important'
      overlayElement.style.top = '0 !important'
      overlayElement.style.left = '0 !important'
      overlayElement.style.width = '100vw !important'
      overlayElement.style.height = '100vh !important'
    }

    // Create initial overlay
    createSecureOverlay()

    // Enhanced security monitoring intervals
    const interval1 = setInterval(securityMonitor, 25) // Every 25ms
    const interval2 = setInterval(securityMonitor, 50) // Every 50ms
    const interval3 = setInterval(securityMonitor, 100) // Every 100ms
    const interval4 = setInterval(securityMonitor, 500) // Every 500ms

    // Enhanced DOM mutation observer
    const observer = new MutationObserver((mutations) => {
      let shouldRestore = false
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.removedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element
              if (element.hasAttribute('data-awslc-overlay') || 
                  element.hasAttribute('data-awslc-protection') ||
                  element.querySelector('[data-awslc-overlay="true"]') ||
                  element.querySelector('[data-awslc-protection="true"]')) {
                shouldRestore = true
              }
            }
          })
        }
        if (mutation.type === 'attributes') {
          const target = mutation.target as HTMLElement
          if (target.hasAttribute('data-awslc-overlay') || 
              target.hasAttribute('data-awslc-card') ||
              target.hasAttribute('data-awslc-protection')) {
            shouldRestore = true
          }
        }
      })
      if (shouldRestore) {
        setTimeout(securityMonitor, 5)
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class', 'data-awslc-overlay', 'data-awslc-card', 'data-awslc-protection']
    })

    // Enhanced prevention for Mac-specific shortcuts and bypass methods
    const preventDevTools = (e: KeyboardEvent) => {
      const forbiddenKeys = [
        'F12', 'F11', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10',
        'Ctrl+Shift+I', 'Ctrl+Shift+J', 'Ctrl+Shift+C', 'Ctrl+U', 'Ctrl+S', 'Ctrl+A', 'Ctrl+P', 'Ctrl+Shift+P',
        // Mac-specific shortcuts
        'Meta+Option+I', 'Meta+Option+J', 'Meta+Option+C', 'Meta+U', 'Meta+S', 'Meta+A', 'Meta+P',
        'Meta+Shift+I', 'Meta+Shift+J', 'Meta+Shift+C', 'Meta+Shift+P',
        'Meta+Alt+I', 'Meta+Alt+J', 'Meta+Alt+C', 'Meta+Alt+P',
        // Additional Mac bypass methods
        'Meta+D', 'Meta+Shift+D', 'Meta+Option+D',
        'Meta+E', 'Meta+Shift+E', 'Meta+Option+E',
        'Meta+R', 'Meta+Shift+R', 'Meta+Option+R',
        'Meta+T', 'Meta+Shift+T', 'Meta+Option+T'
      ]
      
      const keyCombo = e.ctrlKey ? `Ctrl+${e.key}` : 
                      e.shiftKey ? `Shift+${e.key}` : 
                      e.altKey ? `Alt+${e.key}` :
                      e.metaKey ? `Meta+${e.key}` : e.key

      const macKeyCombo = e.metaKey && e.altKey ? `Meta+Alt+${e.key}` :
                         e.metaKey && e.shiftKey ? `Meta+Shift+${e.key}` :
                         e.metaKey ? `Meta+${e.key}` : ''

      if (forbiddenKeys.includes(keyCombo) || 
          forbiddenKeys.includes(macKeyCombo) ||
          forbiddenKeys.includes(e.key) ||
          // Standard shortcuts
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.shiftKey && e.key === 'J') ||
          (e.ctrlKey && e.shiftKey && e.key === 'C') ||
          (e.ctrlKey && e.key === 'U') ||
          (e.ctrlKey && e.key === 'S') ||
          (e.ctrlKey && e.key === 'P') ||
          (e.ctrlKey && e.shiftKey && e.key === 'P') ||
          // Mac shortcuts
          (e.metaKey && e.altKey && e.key === 'I') ||
          (e.metaKey && e.altKey && e.key === 'J') ||
          (e.metaKey && e.altKey && e.key === 'C') ||
          (e.metaKey && e.shiftKey && e.key === 'I') ||
          (e.metaKey && e.shiftKey && e.key === 'J') ||
          (e.metaKey && e.shiftKey && e.key === 'C') ||
          (e.metaKey && e.key === 'U') ||
          (e.metaKey && e.key === 'S') ||
          (e.metaKey && e.key === 'P') ||
          (e.metaKey && e.key === 'D') ||
          (e.metaKey && e.key === 'E') ||
          (e.metaKey && e.key === 'R') ||
          (e.metaKey && e.key === 'T') ||
          // Additional protection
          e.key === 'F12' || e.key === 'F11' || e.key === 'F5') {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        return false
      }
    }

    // Prevent right-click and context menu (enhanced for Mac)
    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      e.stopImmediatePropagation()
      return false
    }

    // Prevent text selection (enhanced for Mac)
    const preventSelection = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
      e.stopImmediatePropagation()
      return false
    }

    // Prevent drag and drop (enhanced for Mac)
    const preventDragDrop = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      e.stopImmediatePropagation()
      return false
    }

    // Prevent Mac trackpad gestures
    const preventGestures = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        return false
      }
    }

    // Add all event listeners with capture
    document.addEventListener('contextmenu', preventContextMenu, { capture: true, passive: false })
    document.addEventListener('selectstart', preventSelection, { capture: true, passive: false })
    document.addEventListener('dragstart', preventDragDrop, { capture: true, passive: false })
    document.addEventListener('keydown', preventDevTools, { capture: true, passive: false })
    document.addEventListener('keyup', preventDevTools, { capture: true, passive: false })
    document.addEventListener('touchstart', preventGestures, { capture: true, passive: false })
    document.addEventListener('touchmove', preventGestures, { capture: true, passive: false })
    document.addEventListener('touchend', preventGestures, { capture: true, passive: false })

    // Disable console with enhanced protection
    const disableConsole = () => {
      const noop = () => {}
      
      // Disable all console methods
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
      window.console.clear = noop
      window.console.count = noop
      window.console.dir = noop
      window.console.dirxml = noop
      window.console.assert = noop
      
      // Override console object
      Object.defineProperty(window, 'console', {
        value: {
          log: noop, warn: noop, error: noop, info: noop, debug: noop,
          trace: noop, table: noop, group: noop, groupEnd: noop,
          time: noop, timeEnd: noop, clear: noop, count: noop,
          dir: noop, dirxml: noop, assert: noop
        },
        writable: false,
        configurable: false
      })
    }

    disableConsole()

    // Prevent access to dev tools via other methods
    const preventDevToolsAccess = () => {
      // Disable common dev tools detection bypasses
      const devtools = { open: false, orientation: null }
      const threshold = 160

      setInterval(() => {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
          if (!devtools.open) {
            devtools.open = true
            // Redirect or reload to prevent dev tools usage
            window.location.reload()
          }
        } else {
          devtools.open = false
        }
      }, 500)
    }

    preventDevToolsAccess()

    // Cleanup function
    return () => {
      clearInterval(interval1)
      clearInterval(interval2)
      clearInterval(interval3)
      clearInterval(interval4)
      observer.disconnect()
      document.removeEventListener('contextmenu', preventContextMenu, { capture: true })
      document.removeEventListener('selectstart', preventSelection, { capture: true })
      document.removeEventListener('dragstart', preventDragDrop, { capture: true })
      document.removeEventListener('keydown', preventDevTools, { capture: true })
      document.removeEventListener('keyup', preventDevTools, { capture: true })
      document.removeEventListener('touchstart', preventGestures, { capture: true })
      document.removeEventListener('touchmove', preventGestures, { capture: true })
      document.removeEventListener('touchend', preventGestures, { capture: true })
    }
  }, [])

  // Return null since we're creating the overlay dynamically
  return null
}