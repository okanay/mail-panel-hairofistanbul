import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ModalComponentProps, ModalInstance, useModalStore } from './store'

const ANIMATION_DURATION = 200

export function ModalWrapper() {
  const store = useModalStore()
  const normalStack = store.normalStack

  if (normalStack.length === 0) return null

  return createPortal(
    <div
      id="modal-normal-container"
      className="pointer-events-none fixed inset-0 z-1000"
      data-modal-count={normalStack.length}
    >
      {normalStack.map((modal) => (
        <ModalLayer key={modal.id} modal={modal} />
      ))}
    </div>,
    document.body,
  )
}

function ModalLayer({ modal }: { modal: ModalInstance }) {
  const { close, modalPending, isTopModal } = useModalStore()
  const [isClosing, setIsClosing] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const isClosingRef = useRef(false)

  const handleClose = () => {
    if (isClosingRef.current || modalPending) return

    isClosingRef.current = true
    setIsClosing(true)

    setTimeout(() => {
      close(modal.id)
    }, ANIMATION_DURATION)
  }

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
      data-pending={modalPending}
      data-modal-layer
      role="dialog"
      aria-modal="true"
      inert={!isTopModal(modal.id) ? true : undefined}
      style={{ zIndex: modal.zIndex }}
      className="fixed inset-0 flex h-dvh w-screen items-center justify-center p-0 md:p-4"
    >
      {/* Backdrop */}
      <div
        onClick={handleClose}
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
