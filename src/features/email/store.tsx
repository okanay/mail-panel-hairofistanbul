import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { temporal, TemporalState } from 'zundo'
import { arrayMove } from '@dnd-kit/sortable'

// ============================================
// TYPES
// ============================================

interface EmailStore {
  blocks: EmailBlock[]
  selected: string | null

  // Actions
  setSelected: (id: string | null) => void
  addBlock: (block: EmailBlock, parentId?: string) => void
  removeBlock: (id: string) => void
  updateBlock: (id: string, data: Partial<EmailBlock>) => void

  // Movement
  reorderBlock: (activeId: string, overId: string) => void // Sadece aynı container içinde
  transferBlock: (blockId: string, targetContainerId: string, index?: number) => void // Container'lar arası
  moveBlockStep: (id: string, direction: 'before' | 'after') => void

  // Helpers
  getBlock: (id: string) => EmailBlock | null
  getParent: (id: string) => ContainerBlock | null
  getDepth: (id: string) => number
}

type EmailStoreApi = StoreApi<EmailStore> & {
  temporal: StoreApi<TemporalState<{ blocks: EmailBlock[] }>>
}

// ============================================
// RECURSIVE HELPERS
// ============================================

const findBlock = (blocks: EmailBlock[], id: string): EmailBlock | null => {
  for (const block of blocks) {
    if (block.id === id) return block
    if (block.type === 'container') {
      const found = findBlock((block as ContainerBlock).children, id)
      if (found) return found
    }
  }
  return null
}

const findParent = (
  blocks: EmailBlock[],
  childId: string,
  parent: ContainerBlock | null = null,
): ContainerBlock | null => {
  for (const block of blocks) {
    if (block.id === childId) return parent
    if (block.type === 'container') {
      const found = findParent((block as ContainerBlock).children, childId, block as ContainerBlock)
      if (found) return found
    }
  }
  return null
}

/**
 * Bir bloğun derinliğini hesaplar
 * root = 0, root'un çocukları = 1, vs.
 */
const calculateDepth = (blocks: EmailBlock[], targetId: string, currentDepth = 0): number => {
  for (const block of blocks) {
    if (block.id === targetId) return currentDepth
    if (block.type === 'container') {
      const found = calculateDepth((block as ContainerBlock).children, targetId, currentDepth + 1)
      if (found !== -1) return found
    }
  }
  return -1
}

// ============================================
// STORE IMPLEMENTATION
// ============================================

const createEmailStore = () =>
  createStore<EmailStore>()(
    temporal(
      immer((set, get) => ({
        blocks: [
          {
            id: 'root',
            type: 'container',
            styles: {
              padding: '20px',
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            },
            children: [],
          },
        ] as EmailBlock[],
        selected: null,

        setSelected: (id) =>
          set((state) => {
            state.selected = id
          }),

        addBlock: (block, parentId) =>
          set((state) => {
            let targetParentId = parentId

            if (!targetParentId && state.selected) {
              const selectedBlock = findBlock(state.blocks, state.selected)
              if (selectedBlock?.type === 'container') {
                targetParentId = selectedBlock.id
              } else {
                const parent = findParent(state.blocks, state.selected)
                if (parent) targetParentId = parent.id
              }
            }

            if (!targetParentId) targetParentId = 'root'

            const parentBlock = findBlock(state.blocks, targetParentId) as ContainerBlock
            if (parentBlock?.children) {
              parentBlock.children.push(block)
              state.selected = block.id
            }
          }),

        removeBlock: (id) =>
          set((state) => {
            if (id === 'root') return
            const parent = findParent(state.blocks, id)
            if (parent) {
              parent.children = parent.children.filter((b) => b.id !== id)
              state.selected = null
            }
          }),

        updateBlock: (id, data) =>
          set((state) => {
            const block = findBlock(state.blocks, id)
            if (block) {
              Object.assign(block, data)
            }
          }),

        /**
         * SADECE aynı container içinde sıralama yapar
         * Farklı container'daki elemanlara drop edildiğinde işlem yapmaz
         * Bu sayede depth korunur
         */
        reorderBlock: (activeId, overId) =>
          set((state) => {
            const activeParent = findParent(state.blocks, activeId)
            const overParent = findParent(state.blocks, overId)

            // Güvenlik kontrolü
            if (!activeParent || !overParent) return

            // KRİTİK: Sadece aynı container içindeyse işlem yap
            // Bu, depth'in korunmasını garanti eder
            if (activeParent.id !== overParent.id) {
              console.log(
                '[reorderBlock] Farklı containerlar arası taşıma engellendi.',
                `Active parent: ${activeParent.id}, Over parent: ${overParent.id}`,
              )
              return
            }

            const oldIndex = activeParent.children.findIndex((x) => x.id === activeId)
            const newIndex = activeParent.children.findIndex((x) => x.id === overId)

            if (oldIndex === -1 || newIndex === -1) return

            activeParent.children = arrayMove(activeParent.children, oldIndex, newIndex)
          }),

        /**
         * Bir bloğu başka bir container'a taşır
         * Bu fonksiyon açık bir şekilde "bu container'a taşı" demek için kullanılır
         * Örn: Container'ın üzerine drop zone ile
         */
        transferBlock: (blockId, targetContainerId, index) =>
          set((state) => {
            if (blockId === 'root') return
            if (blockId === targetContainerId) return

            const block = findBlock(state.blocks, blockId)
            const sourceParent = findParent(state.blocks, blockId)
            const targetContainer = findBlock(state.blocks, targetContainerId) as ContainerBlock

            if (!block || !sourceParent || !targetContainer) return
            if (targetContainer.type !== 'container') return

            // Kendisinin içine taşınamaz (sonsuz döngü önleme)
            if (block.type === 'container') {
              const isDescendant = findBlock((block as ContainerBlock).children, targetContainerId)
              if (isDescendant) {
                console.log('[transferBlock] Bir container kendi alt elemanına taşınamaz')
                return
              }
            }

            // Kaynaktan çıkar
            const sourceIndex = sourceParent.children.findIndex((b) => b.id === blockId)
            const [movedBlock] = sourceParent.children.splice(sourceIndex, 1)

            // Hedefe ekle
            const insertIndex = index ?? targetContainer.children.length
            targetContainer.children.splice(insertIndex, 0, movedBlock)
          }),

        // Ok tuşları ile taşıma - aynı container içinde
        moveBlockStep: (id, direction) =>
          set((state) => {
            const parent = findParent(state.blocks, id)
            if (!parent) return

            const index = parent.children.findIndex((b) => b.id === id)
            if (index === -1) return

            const newIndex = direction === 'before' ? index - 1 : index + 1
            if (newIndex < 0 || newIndex >= parent.children.length) return

            parent.children = arrayMove(parent.children, index, newIndex)
          }),

        getBlock: (id) => findBlock(get().blocks, id),
        getParent: (id) => findParent(get().blocks, id),
        getDepth: (id) => calculateDepth(get().blocks, id),
      })),
      {
        limit: 20,
        partialize: (state) => ({ blocks: state.blocks }),
        equality: (a, b) => a.blocks === b.blocks,
      },
    ),
  )

// ============================================
// CONTEXT & HOOKS
// ============================================

const EmailContext = createContext<EmailStoreApi | undefined>(undefined)

export const EmailStoreProvider = ({ children }: PropsWithChildren) => {
  const [store] = useState(() => createEmailStore())
  return <EmailContext.Provider value={store}>{children}</EmailContext.Provider>
}

export const useEmailStore = () => {
  const context = useContext(EmailContext)
  if (!context) throw new Error('useEmailStore must be used within EmailStoreProvider')
  return useStore(context)
}

export const useEmailTemporal = () => {
  const context = useContext(EmailContext)
  if (!context) throw new Error('useEmailTemporal must be used within EmailStoreProvider')
  return useStore(context.temporal)
}
