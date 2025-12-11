import { ClientOnly } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { modalManager } from './manager'
import { useGlobalModalStore } from './store'
import type { ModalComponentProps, ModalInstance } from './types'

const ANIMATION_DURATION = 200
const GLOBAL_MODAL_PREFIX = 'global-modal-'

export function GlobalModalProvider() {
  const { stack } = useGlobalModalStore()

  useModalManagerSync(stack)

  if (stack.length === 0) return null

  return createPortal(
    <ClientOnly fallback={null}>
      <div
        id="global-modal-container"
        className="pointer-events-none fixed inset-0 z-1000"
        data-modal-count={stack.length}
      >
        {stack.map((modal) => (
          <ModalLayer key={modal.id} modal={modal} />
        ))}
      </div>
    </ClientOnly>,
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

    // Animation bitince DOM'dan kaldır
    setTimeout(() => {
      close(modal.id)
    }, ANIMATION_DURATION)
  }

  // Mount animasyonu
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

function useModalManagerSync(stack: ModalInstance[]) {
  useEffect(() => {
    const currentIds = stack.map((m) => m.id)
    const activeModals = modalManager.getActiveModals()['body'] ?? []
    const globalModalIds = activeModals.filter((id) => id.startsWith(GLOBAL_MODAL_PREFIX))

    // Kapatılacak modaller
    globalModalIds.forEach((globalId) => {
      const actualId = globalId.replace(GLOBAL_MODAL_PREFIX, '')
      if (!currentIds.includes(actualId)) {
        modalManager.closeModal(globalId, 'body')
      }
    })

    // Açılacak modaller
    currentIds.forEach((id) => {
      const globalId = `${GLOBAL_MODAL_PREFIX}${id}`
      if (!modalManager.isModalOpen(globalId, 'body')) {
        modalManager.openModal(globalId, 'body')
      }
    })

    return () => {
      currentIds.forEach((id) => {
        modalManager.closeModal(`${GLOBAL_MODAL_PREFIX}${id}`, 'body')
      })
    }
  }, [stack])
}
