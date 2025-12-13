import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ModalComponentProps, ModalInstance, useGlobalModalStore } from './store'

const ANIMATION_DURATION = 200

export function ModalWrapper() {
  const { stack } = useGlobalModalStore()

  if (stack.length === 0) return null

  return createPortal(
    <div
      id="global-modal-container"
      className="pointer-events-none fixed inset-0 z-1000"
      data-modal-count={stack.length}
    >
      {stack.map((modal) => (
        <ModalLayer key={modal.id} modal={modal} />
      ))}
    </div>,
    document.body,
  )
}

function ModalLayer({ modal }: { modal: ModalInstance }) {
  const { close } = useGlobalModalStore()
  const [isClosing, setIsClosing] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const isClosingRef = useRef(false)

  const handleClose = () => {
    if (isClosingRef.current) return

    isClosingRef.current = true
    setIsClosing(true)

    setTimeout(() => {
      close(modal.id)
    }, ANIMATION_DURATION)
  }

  // Mount animation
  useEffect(() => {
    requestAnimationFrame(() => {
      setIsMounted(true)
    })
  }, [])

  const Component = modal.component

  const modalProps: ModalComponentProps = {
    ...modal.props,
    onClose: handleClose,
  }

  return (
    <div
      data-modal-id={modal.id}
      data-modal-layer
      role="dialog"
      aria-modal="true"
      style={{ zIndex: modal.zIndex }}
      className="fixed inset-0 flex h-dvh w-screen items-center justify-center p-0 md:p-4"
      data-mounted={isMounted}
      data-closing={isClosing}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity duration-200"
        style={{
          opacity: isMounted && !isClosing ? 1 : 0,
          pointerEvents: 'auto',
        }}
      />

      {/* Modal Content */}
      <div
        className="relative transition-all duration-200 ease-out"
        style={{
          opacity: isMounted && !isClosing ? 1 : 0,
          transform: isMounted && !isClosing ? 'translateY(0)' : 'translateY(20px)',
          pointerEvents: 'auto',
        }}
      >
        <Component {...modalProps} />
      </div>
    </div>
  )
}
