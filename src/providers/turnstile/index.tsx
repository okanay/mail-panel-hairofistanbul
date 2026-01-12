import { useEffect, useRef } from 'react'
import { create } from 'zustand'

interface TurnstileState {
  token: string | null
  isReady: boolean
  setToken: (token: string | null) => void
  setReady: (ready: boolean) => void
}

export const useTurnstileStore = create<TurnstileState>((set) => ({
  token: null,
  isReady: false,
  setToken: (token) => set({ token }),
  setReady: (ready) => set({ isReady: ready }),
}))

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: any) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
    onloadTurnstileCallback?: () => void
  }
}

export function TurnstileProvider({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const { setToken, setReady } = useTurnstileStore()
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY

  useEffect(() => {
    // 1. Script yüklü mü kontrol et, yoksa yükle
    const scriptId = 'cloudflare-turnstile-script'
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }

    // 2. Widget Render Fonksiyonu
    const renderWidget = () => {
      if (!containerRef.current || !window.turnstile) return

      // Eğer zaten render edildiyse tekrar etme
      if (widgetIdRef.current) return

      const id = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme: 'light',
        size: 'invisible', // Gizli modda çalışır, sadece gerekirse challenge çıkarır
        callback: (token: string) => {
          setToken(token)
        },
        'expired-callback': () => {
          setToken(null)
          if (widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current)
        },
        'error-callback': () => {
          setToken(null)
        },
      })
      widgetIdRef.current = id
      setReady(true)
    }

    // 3. Script Yüklendi mi kontrolü (Polling yerine interval kontrolü daha güvenli olabilir ama basit tutalım)
    const checkInterval = setInterval(() => {
      if (window.turnstile) {
        renderWidget()
        clearInterval(checkInterval)
      }
    }, 100)

    return () => {
      clearInterval(checkInterval)
      // Opsiyonel: Widget'ı temizle (SPA geçişlerinde widget'ın kalması bazen iyidir, token tazelenir)
      // if (widgetIdRef.current && window.turnstile) {
      //   window.turnstile.remove(widgetIdRef.current)
      // }
    }
  }, [siteKey, setToken, setReady])

  return (
    <>
      {children}
      {/* Görünmez Widget Container */}
      <div
        ref={containerRef}
        id="turnstile-widget"
        className="fixed right-0 bottom-0 z-0 hidden"
        aria-hidden="true"
      />
    </>
  )
}
