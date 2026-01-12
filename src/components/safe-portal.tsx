import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'

export const SafePortal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    return () => {
      setMounted(false)
    }
  }, [])

  return mounted ? createPortal(children, document.body) : undefined
}
