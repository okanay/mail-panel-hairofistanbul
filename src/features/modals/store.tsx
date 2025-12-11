import { createContext, useContext, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { GlobalModalStore, ModalComponentProps, ModalInstance } from './types'

const GlobalModalStoreContext = createContext<StoreApi<GlobalModalStore> | undefined>(undefined)

export function GlobalModalStoreProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(() =>
    createStore<GlobalModalStore>()(
      immer((set, get) => ({
        stack: [],
        nextZIndex: 1000,
        open: <T = unknown,>(
          component: React.ComponentType<ModalComponentProps>,
          props: Record<string, unknown> = {},
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
            }

            set((state) => {
              state.stack.push(newModal)
              state.nextZIndex += 10
            })
          })
        },

        close: (id: string, data?: unknown) => {
          const modal = get().stack.find((m) => m.id === id)
          if (!modal) return

          modal.resolve?.(data)

          set((state) => {
            const index = state.stack.findIndex((m) => m.id === id)
            if (index !== -1) {
              state.stack.splice(index, 1)
            }
          })
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

          set((state) => {
            state.stack = []
            state.nextZIndex = 1000
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
    ),
  )

  return (
    <GlobalModalStoreContext.Provider value={store}>{children}</GlobalModalStoreContext.Provider>
  )
}

export function useGlobalModalStore() {
  const context = useContext(GlobalModalStoreContext)
  if (!context) {
    throw new Error('useGlobalModalStore must be used within GlobalModalStoreProvider')
  }
  return useStore(context)
}
