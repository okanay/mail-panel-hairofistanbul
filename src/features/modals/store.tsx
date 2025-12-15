import { createContext, useContext, useEffect, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import { ModalWrapper } from './wrapper'
import { ModalWrapperMotion } from './wrapper-motion'

// ============================================================================
// TYPES
// ============================================================================

export interface ModalComponentProps {
  onClose: () => void
  [key: string]: unknown
}

export interface ModalInstance {
  id: string
  component: React.ComponentType<ModalComponentProps>
  props: Record<string, unknown>
  resolve?: (data?: unknown) => void
  reject?: (error?: unknown) => void
  zIndex: number
  createdAt: number
  isMotion?: boolean
}

export interface ModalStore {
  normalStack: ModalInstance[]
  motionStack: ModalInstance[]
  nextZIndex: number

  open: <T = unknown>(
    component: React.ComponentType<ModalComponentProps>,
    props?: Record<string, unknown>,
    options?: { isMotion?: boolean },
  ) => Promise<T>
  isOpen: (id?: string) => boolean

  close: (id: string, data?: unknown) => void
  closeTop: (data?: unknown) => void
  clear: () => void

  getTopModal: () => ModalInstance | null
  getAllStack: () => ModalInstance[]
  isTopModal: (id: string) => boolean

  modalPending: boolean
  setModalPending: (value: boolean) => void
}

// ============================================================================
// STORE
// ============================================================================

const ModalStoreContext = createContext<StoreApi<ModalStore> | undefined>(undefined)

export function ModalStoreProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(() =>
    createStore<ModalStore>()((set, get) => ({
      normalStack: [],
      motionStack: [],
      nextZIndex: 1000,

      modalPending: false,
      setModalPending: (value: boolean) => {
        set(() => ({
          modalPending: value,
        }))
      },

      open: <T = unknown,>(
        component: React.ComponentType<ModalComponentProps>,
        props: Record<string, unknown> = {},
        options: { closeOnOutsideClick?: boolean; isMotion?: boolean } = {},
      ): Promise<T> => {
        return new Promise<T>((resolve, reject) => {
          const modalId = `modal_${Date.now()}_${Math.random().toString(36).slice(2)}`
          const isMotion = options.isMotion ?? false

          const newModal: ModalInstance = {
            id: modalId,
            component,
            props,
            resolve: resolve as (data?: unknown) => void,
            reject: reject as (error?: unknown) => void,
            zIndex: get().nextZIndex,
            createdAt: Date.now(),
            isMotion,
          }

          set((state) => ({
            normalStack: isMotion ? state.normalStack : [...state.normalStack, newModal],
            motionStack: isMotion ? [...state.motionStack, newModal] : state.motionStack,
            nextZIndex: state.nextZIndex + 10,
          }))
        })
      },

      close: (id: string, data?: unknown) => {
        const allStack = get().getAllStack()
        const modal = allStack.find((m) => m.id === id)
        if (!modal) return

        modal.resolve?.(data)

        set((state) => ({
          normalStack: state.normalStack.filter((m) => m.id !== id),
          motionStack: state.motionStack.filter((m) => m.id !== id),
        }))
      },

      closeTop: (data?: unknown) => {
        const topModal = get().getTopModal()
        if (topModal) {
          get().close(topModal.id, data)
        }
      },

      clear: () => {
        const allStack = get().getAllStack()
        allStack.forEach((modal) => {
          modal.reject?.(new Error('Modal cleared'))
        })

        set({
          normalStack: [],
          motionStack: [],
          nextZIndex: 1000,
        })
      },

      isOpen: (id?: string) => {
        const allStack = get().getAllStack()
        return id ? allStack.some((m) => m.id === id) : allStack.length > 0
      },

      getTopModal: () => {
        const allStack = get().getAllStack()
        return allStack[allStack.length - 1] ?? null
      },

      getAllStack: () => {
        const { normalStack, motionStack } = get()
        return [...normalStack, ...motionStack].sort((a, b) => a.zIndex - b.zIndex)
      },

      isTopModal: (id: string) => {
        const topModal = get().getTopModal()
        return topModal?.id === id
      },
    })),
  )

  const normalStackLength = useStore(store, (state) => state.normalStack.length)
  const motionStackLength = useStore(store, (state) => state.motionStack.length)
  const totalStackLength = normalStackLength + motionStackLength

  useEffect(() => {
    if (totalStackLength > 0) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

      // Scroll lock
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`
    } else {
      // Scroll unlock
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [totalStackLength])

  return (
    <ModalStoreContext.Provider value={store}>
      {children}
      <ModalWrapper />
      <ModalWrapperMotion />
    </ModalStoreContext.Provider>
  )
}

export function useModalStore() {
  const context = useContext(ModalStoreContext)

  if (!context) {
    throw new Error('useGlobalModalStore must be used within ModalStoreProvider')
  }

  return useStore(context)
}
