import { SafePortal } from './safe-portal'

type Props = {
  isVisible: boolean
  children: React.ReactNode
}

export const LoadingIndicator = ({ isVisible, children }: Props) => {
  if (!isVisible) {
    return null
  }

  return (
    <SafePortal>
      <div
        aria-hidden={!isVisible}
        className="pointer-events-auto fixed inset-0 z-2000 aria-hidden:hidden"
      >
        <div className="fixed inset-0 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-zinc-300 border-t-primary" />
              <div className="absolute inset-0 h-16 w-16 animate-ping rounded-full border-4 border-primary opacity-20" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="text-sm font-semibold text-white">{children}</p>
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SafePortal>
  )
}
