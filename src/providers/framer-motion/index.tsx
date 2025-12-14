import { LazyMotion } from 'framer-motion'

// Async feature loading
const loadFeatures = () => import('./lazy').then((res) => res.default)

interface LazyModalProviderProps {
  children: React.ReactNode
}

export function FramerMotion({ children }: LazyModalProviderProps) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  )
}
