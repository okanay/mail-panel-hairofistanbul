import { createContext, useContext, useEffect, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'

// ============================================================================
// TYPES
// ============================================================================

interface DropdownInstance {
  id: string
  level: number
  parentId: string | null
  zIndex: number
}

interface DropdownStore {
  stack: DropdownInstance[]
  nextZIndex: number
  open: (id: string, parentId?: string | null) => void
  close: (id: string) => void
  closeFromLevel: (level: number) => void
  clear: () => void
  isOpen: (id: string) => boolean
  getLevel: (id: string) => number
}

// ============================================================================
// STORE
// ============================================================================

const DropdownStoreContext = createContext<StoreApi<DropdownStore> | undefined>(undefined)

export function DropdownStoreProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(() =>
    createStore<DropdownStore>()((set, get) => ({
      stack: [],
      nextZIndex: 2000,

      open: (id, parentId = null) => {
        const existing = get().stack.find((d) => d.id === id)
        if (existing) return

        const level = parentId ? (get().stack.find((d) => d.id === parentId)?.level ?? -1) + 1 : 0

        set((state) => ({
          stack: [...state.stack, { id, level, parentId, zIndex: state.nextZIndex }],
          nextZIndex: state.nextZIndex + 10,
        }))
      },

      close: (id) => {
        set((state) => ({
          stack: state.stack.filter((d) => d.id !== id),
        }))
      },

      closeFromLevel: (level) => {
        set((state) => ({
          stack: state.stack.filter((d) => d.level < level),
        }))
      },

      clear: () => set({ stack: [], nextZIndex: 2000 }),

      isOpen: (id) => get().stack.some((d) => d.id === id),

      getLevel: (id) => get().stack.find((d) => d.id === id)?.level ?? -1,
    })),
  )

  // Outside click handler
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const path = event.composedPath() as HTMLElement[]

      // Trigger button'a mı tıklandı?
      const clickedTrigger = path.some((el) => el.dataset?.dropdownTrigger)
      if (clickedTrigger) return

      // Dropdown layer'a tıklandı mı?
      const clickedDropdownLayer = path.some((el) => el.dataset?.dropdownLayer)

      if (!clickedDropdownLayer) {
        // Hiçbir dropdown layer'a tıklanmadı, hepsini kapat
        store.getState().clear()
      } else {
        // Bir dropdown layer'a tıklandı, tıklanan dropdown'dan sonrakileri kapat
        const clickedDropdownId = path.find((el) => el.dataset?.dropdownId)?.dataset?.dropdownId

        if (clickedDropdownId) {
          const clicked = store.getState().stack.find((d) => d.id === clickedDropdownId)
          if (clicked) {
            store.getState().closeFromLevel(clicked.level + 1)
          }
        }
      }
    }

    document.addEventListener('mousedown', handleOutsideClick, true)
    return () => document.removeEventListener('mousedown', handleOutsideClick, true)
  }, [store])

  return <DropdownStoreContext.Provider value={store}>{children}</DropdownStoreContext.Provider>
}

export function useDropdownStore() {
  const context = useContext(DropdownStoreContext)
  if (!context) {
    throw new Error('useDropdownStore must be used within DropdownStoreProvider')
  }
  return useStore(context)
}
