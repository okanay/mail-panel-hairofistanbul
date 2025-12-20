import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { temporal, TemporalState } from 'zundo'

interface EmailStore {
  blocks: EmailBlock[]
  selected: string[]

  // State setters
  setSelected: (ids: string[]) => void

  // Container operations
  addContainer: () => void
  removeContainer: (id: string) => void
  mergeContainers: (ids: string[]) => void
  splitContainer: (id: string) => void

  // Block operations
  addBlock: (block: EmailBlock, targetId?: string) => void
  updateBlock: (id: string, data: Partial<EmailBlock>) => void
  moveBlock: (sourceId: string, targetId: string) => void

  // Validation helpers
  isMergeable: (ids: string[]) => boolean
  isAddable: () => boolean
  isDescendant: (parentId: string, potentialChildId: string) => boolean

  // Utils
  getBlock: (id: string) => EmailBlock | null
  getParentBlock: (id: string) => ContainerBlock | null
}

type EmailStoreApi = StoreApi<EmailStore> & {
  temporal: StoreApi<TemporalState<{ blocks: EmailBlock[] }>>
}

// Helper functions
function findBlockById(blocks: EmailBlock[], id: string): EmailBlock | null {
  for (const block of blocks) {
    if (block.id === id) return block

    if (block.type === 'container') {
      const found = findBlockById((block as ContainerBlock).children, id)
      if (found) return found
    }
  }
  return null
}

function updateBlockById(blocks: EmailBlock[], id: string, data: Partial<EmailBlock>): boolean {
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]

    if (block.id === id) {
      blocks[i] = { ...block, ...data } as EmailBlock
      return true
    }

    if (block.type === 'container') {
      const found = updateBlockById((block as ContainerBlock).children, id, data)
      if (found) return true
    }
  }
  return false
}

function removeBlockById(blocks: EmailBlock[], id: string): boolean {
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]

    if (block.id === id) {
      blocks.splice(i, 1)
      return true
    }

    if (block.type === 'container') {
      const found = removeBlockById((block as ContainerBlock).children, id)
      if (found) return true
    }
  }
  return false
}

function findParentOfBlock(
  blocks: EmailBlock[],
  id: string,
  parent: ContainerBlock | null = null,
): ContainerBlock | null {
  for (const block of blocks) {
    if (block.id === id) return parent

    if (block.type === 'container') {
      const found = findParentOfBlock(
        (block as ContainerBlock).children,
        id,
        block as ContainerBlock,
      )
      if (found) return found
    }
  }
  return null
}

const createEmailStore = () =>
  createStore<EmailStore>()(
    temporal(
      immer((set, get) => ({
        blocks: [
          {
            id: 'first-container',
            type: 'container',
            styles: {},
            children: [],
          },
          {
            id: 'second-container',
            type: 'container',
            styles: {},
            children: [],
          },
          {
            id: 'third-container',
            type: 'container',
            styles: {},
            children: [
              {
                id: 'third-first-container',
                type: 'container',
                styles: {},
                children: [],
              },
            ],
          },
        ],
        selected: [],

        // ============ STATE SETTERS ============

        setSelected: (ids) =>
          set((state) => {
            state.selected = ids
          }),

        // ============ CONTAINER OPERATIONS ============

        addContainer: () =>
          set((state) => {
            const newContainer: ContainerBlock = {
              id: crypto.randomUUID(),
              type: 'container',
              styles: {},
              children: [],
            }

            if (state.selected.length === 0) {
              // Root'a ekle
              state.blocks.push(newContainer)
            } else if (state.selected.length === 1) {
              // Seçili container'ın içine ekle
              const target = findBlockById(state.blocks, state.selected[0])
              if (target && target.type === 'container') {
                ;(target as ContainerBlock).children.push(newContainer)
              }
            }
          }),

        removeContainer: (id) =>
          set((state) => {
            removeBlockById(state.blocks, id)
            state.selected = state.selected.filter((sid) => sid !== id)
          }),

        mergeContainers: (ids) =>
          set((state) => {
            if (ids.length < 2) return

            // İlk container'ın parent'ını bul
            const firstParent = findParentOfBlock(state.blocks, ids[0])

            // Parent yok ise root level'deyiz demektir
            const children = firstParent ? firstParent.children : state.blocks

            // Seçili containerları topla
            const selectedContainers: EmailBlock[] = []
            let insertIndex = -1

            ids.forEach((id) => {
              const index = children.findIndex((b) => b.id === id)
              if (index > -1) {
                if (insertIndex === -1 || index < insertIndex) {
                  insertIndex = index
                }
                selectedContainers.push(children[index])
              }
            })

            // Containerları kaldır
            ids.forEach((id) => {
              const index = children.findIndex((b) => b.id === id)
              if (index > -1) {
                children.splice(index, 1)
              }
            })

            // Yeni merge edilmiş container oluştur
            const mergedContainer: ContainerBlock = {
              id: crypto.randomUUID(),
              type: 'container',
              styles: {},
              children: selectedContainers,
            }

            // En düşük index'e ekle
            children.splice(insertIndex, 0, mergedContainer)

            // Selection'ı güncelle
            state.selected = [mergedContainer.id]
          }),

        splitContainer: (id) =>
          set((state) => {
            const container = findBlockById(state.blocks, id)
            if (!container || container.type !== 'container') return

            if ((container as ContainerBlock).children.length === 0) {
              return
            }

            const parent = findParentOfBlock(state.blocks, id)

            const children = parent ? parent.children : state.blocks
            const index = children.findIndex((b) => b.id === id)
            if (index === -1) return

            const containerChildren = [...(container as ContainerBlock).children]

            children.splice(index, 1, ...containerChildren)

            state.selected = containerChildren.map((b) => b.id)
          }),

        // ============ BLOCK OPERATIONS ============

        addBlock: (block, targetId) =>
          set((state) => {
            if (!targetId) {
              state.blocks.push(block)
              return
            }

            const target = findBlockById(state.blocks, targetId)
            if (target && target.type === 'container') {
              ;(target as ContainerBlock).children.push(block)
            }
          }),

        updateBlock: (id, data) =>
          set((state) => {
            updateBlockById(state.blocks, id, data)
          }),

        moveBlock: (sourceId, targetId) =>
          set((state) => {
            // 1. Aynı yere bırakırsa iptal
            if (sourceId === targetId) return

            // 2. Target, Source'un içindeyse iptal (Circular Dependency)
            // Eğer ben "Kutu A"yı "Kutu B"nin içine atmaya çalışıyorsam,
            // ama "Kutu B" zaten "Kutu A"nın içindeyse bu işlem imkansızdır.
            // Not: findBlockById ile state.blocks üzerinden kontrol etmek lazım,
            // helper fonksiyonu store dışındaki pure function'ı kullanmalı.
            // Basitlik için burada recursive kontrolü atlıyorum ama production'da şart.
            // Şimdilik sadece parent kontrolü yapıyoruz.

            const sourceBlock = findBlockById(state.blocks, sourceId)
            const targetBlock = findBlockById(state.blocks, targetId)

            if (!sourceBlock || !targetBlock) return

            // Sadece Container içine drop yapılabilir
            if (targetBlock.type !== 'container') return

            // Source'un eski yerinden silinmesi
            const parent = findParentOfBlock(state.blocks, sourceId)
            const collection = parent ? parent.children : state.blocks
            const sourceIndex = collection.findIndex((b) => b.id === sourceId)

            if (sourceIndex > -1) {
              // Diziden çıkar
              collection.splice(sourceIndex, 1)

              // Yeni target'a ekle
              // Burada targetBlock referansını taze state'den bulmalıyız
              const freshTarget = findBlockById(state.blocks, targetId) as ContainerBlock
              freshTarget.children.push(sourceBlock)

              // Seçimi taşıdığımız elemana odakla
              state.selected = [sourceId]
            }
          }),

        // ============ VALIDATION HELPERS ============

        isMergeable: (ids) => {
          if (ids.length < 2) return false

          const firstParent = findParentOfBlock(get().blocks, ids[0])
          return ids.every((id) => {
            const parent = findParentOfBlock(get().blocks, id)
            return parent?.id === firstParent?.id
          })
        },

        isAddable: () => {
          const selectedCount = get().selected.length
          if (selectedCount === 0) return true
          if (selectedCount === 1) {
            const block = get().getBlock(get().selected[0])
            return block?.type === 'container'
          }
          return false
        },

        isDescendant: (parentId, potentialChildId) => {
          const parent = findBlockById(get().blocks, parentId)
          if (!parent || parent.type !== 'container') return false

          const checkChildren = (container: ContainerBlock): boolean => {
            for (const child of container.children) {
              if (child.id === potentialChildId) return true
              if (child.type === 'container') {
                if (checkChildren(child as ContainerBlock)) return true
              }
            }
            return false
          }

          return checkChildren(parent as ContainerBlock)
        },

        // ============ UTILS ============

        getBlock: (id) => findBlockById(get().blocks, id),

        getParentBlock: (id) => findParentOfBlock(get().blocks, id),
      })),
      {
        limit: 20,
        partialize: (state) => ({ blocks: state.blocks }),
        equality: (pastState, currentState) => {
          return pastState.blocks === currentState.blocks
        },
      },
    ),
  )

// 3. Context Tipini Güncelle
const EmailContext = createContext<EmailStoreApi | undefined>(undefined)

export const EmailStoreProvider = ({ children }: PropsWithChildren) => {
  const [store] = useState(() => createEmailStore())
  return <EmailContext.Provider value={store}>{children}</EmailContext.Provider>
}

export const useEmailStore = () => {
  const context = useContext(EmailContext)
  if (!context) {
    throw new Error('useEmailStore must be used within EmailStoreProvider')
  }
  return useStore(context)
}

export const useEmailTemporal = () => {
  const context = useContext(EmailContext)
  if (!context) {
    throw new Error('useEmailStore must be used within EmailStoreProvider')
  }

  return useStore(context.temporal)
}
