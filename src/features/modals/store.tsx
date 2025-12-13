import { createContext, useContext, useEffect, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import { ModalWrapper } from './wrapper'

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
  closeOnOutsideClick?: boolean
}

export interface ModalStore {
  stack: ModalInstance[]
  nextZIndex: number
  open: <T = unknown>(
    component: React.ComponentType<ModalComponentProps>,
    props?: Record<string, unknown>,
    options?: { closeOnOutsideClick?: boolean },
  ) => Promise<T>
  close: (id: string, data?: unknown) => void
  closeTop: (data?: unknown) => void
  clear: () => void
  isOpen: (id?: string) => boolean
  getTopModal: () => ModalInstance | null
}

// ============================================================================
// STORE
// ============================================================================

const ModalStoreContext = createContext<StoreApi<ModalStore> | undefined>(undefined)

export function ModalStoreProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(() =>
    createStore<ModalStore>()((set, get) => ({
      stack: [],
      nextZIndex: 1000,

      open: <T = unknown,>(
        component: React.ComponentType<ModalComponentProps>,
        props: Record<string, unknown> = {},
        options: { closeOnOutsideClick?: boolean } = {},
      ): Promise<T> => {
        return new Promise<T>((resolve, reject) => {
          const modalId = `modal_${Date.now()}_${Math.random().toString(36).slice(2)}`

          const newModal: ModalInstance = {
            id: modalId,
            component,
            props,
            resolve: resolve as (data?: unknown) => void,
            reject: reject as (error?: unknown) => void,
            zIndex: get().nextZIndex,
            createdAt: Date.now(),
            closeOnOutsideClick: options.closeOnOutsideClick ?? false,
          }

          set((state) => ({
            stack: [...state.stack, newModal],
            nextZIndex: state.nextZIndex + 10,
          }))
        })
      },

      close: (id: string, data?: unknown) => {
        const modal = get().stack.find((m) => m.id === id)
        if (!modal) return

        modal.resolve?.(data)

        set((state) => ({
          stack: state.stack.filter((m) => m.id !== id),
        }))
      },

      closeTop: (data?: unknown) => {
        const topModal = get().getTopModal()
        if (topModal) {
          get().close(topModal.id, data)
        }
      },

      clear: () => {
        get().stack.forEach((modal) => {
          modal.reject?.(new Error('Modal cleared'))
        })

        set({
          stack: [],
          nextZIndex: 1000,
        })
      },

      isOpen: (id?: string) => {
        const { stack } = get()
        return id ? stack.some((m) => m.id === id) : stack.length > 0
      },

      getTopModal: () => {
        const { stack } = get()
        return stack[stack.length - 1] ?? null
      },
    })),
  )

  const stackLength = useStore(store, (state) => state.stack.length)

  // Scroll lock
  useEffect(() => {
    if (stackLength > 0) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }

    // Cleanup
    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [stackLength])

  // Outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const topModal = store.getState().getTopModal()
      if (!topModal?.closeOnOutsideClick) return

      const path = event.composedPath() as HTMLElement[]
      const clickedModalLayer = path.some((el) => el.dataset?.modalLayer !== undefined)

      if (!clickedModalLayer) {
        store.getState().closeTop()
      }
    }

    document.addEventListener('mousedown', handleOutsideClick, true)
    return () => document.removeEventListener('mousedown', handleOutsideClick, true)
  }, [store])

  return (
    <ModalStoreContext.Provider value={store}>
      {children}
      <ModalWrapper />
    </ModalStoreContext.Provider>
  )
}

export function useGlobalModalStore() {
  const context = useContext(ModalStoreContext)
  if (!context) {
    throw new Error('useGlobalModalStore must be used within ModalStoreProvider')
  }
  return useStore(context)
}
