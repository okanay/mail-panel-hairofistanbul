import { createStore, useStore, type StoreApi } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { temporal, type TemporalState } from 'zundo'
import { arrayMove } from '@dnd-kit/sortable'
import { createContext, useContext, useState, type PropsWithChildren } from 'react'
import type { Draft } from 'immer'

// ============================================
// STORE TYPES
// ============================================

interface EmailStore {
  blocks: EmailBlock[]
  selected: string | null

  // Actions
  setSelected: (id: string | null) => void
  addBlock: (block: EmailBlock, targetParentId?: string) => void
  updateBlock: (id: string, data: Partial<EmailBlock> & { content?: string; styles?: any }) => void
  removeBlock: (id: string) => void

  // Movement
  moveBlock: (activeId: string, overId: string) => void
  moveBlockStep: (id: string, direction: 'before' | 'after') => void

  // Helpers
  getBlock: (id: string) => EmailBlock | null
  getParent: (id: string) => BlockWithChildren | null
}

interface TemporalStore {
  blocks: EmailBlock[]
}

type EmailStoreApi = StoreApi<EmailStore> & {
  temporal: StoreApi<TemporalState<TemporalStore>>
}

// ============================================
// HELPERS
// ============================================

const hasChildren = (block: EmailBlock): block is BlockWithChildren => {
  return ['root', 'section', 'row', 'column'].includes(block.type)
}

// Recursive blok bulucu
const findBlock = (blocks: EmailBlock[], id: string): EmailBlock | null => {
  for (const block of blocks) {
    if (block.id === id) return block
    if (hasChildren(block)) {
      const found = findBlock(block.children, id)
      if (found) return found
    }
  }
  return null
}

// Recursive parent bulucu
const findParent = (
  blocks: EmailBlock[],
  childId: string,
  currentParent: BlockWithChildren | null = null,
): BlockWithChildren | null => {
  for (const block of blocks) {
    if (block.id === childId) return currentParent
    if (hasChildren(block)) {
      const found = findParent(block.children, childId, block)
      if (found) return found
    }
  }
  return null
}

// ============================================
// INITIAL STATE
// ============================================

const initialBlocks: EmailBlock[] = [
  {
    id: 'root',
    type: 'root',
    props: {
      style: {
        backgroundColor: '#f6f9fc',
        fontFamily: 'sans-serif',
      },
    },
    children: [],
  },
]

// ============================================
// STORE CREATION
// ============================================

const createEmailStore = () =>
  createStore<EmailStore>()(
    temporal(
      immer((set, get) => ({
        blocks: initialBlocks,
        selected: null,

        setSelected: (id) =>
          set((state) => {
            state.selected = id
          }),

        addBlock: (newBlock, targetParentId) =>
          set((state) => {
            // 1. Hedef Parent ID'yi belirle
            // targetParentId varsa onu kullan, yoksa seçili olana bak, o da yoksa root.
            let potentialParentId = targetParentId || state.selected || 'root'

            // 2. Bu ID'ye sahip bloğu bul
            // Immer state'i içinde aradığımız için cast işlemi gerekiyor
            let parentBlock = findBlock(state.blocks as EmailBlock[], potentialParentId)

            // 3. Eğer bulduğumuz blok "Çocuk Sahibi Olamayan" (Leaf) bir bloksa (örn: Button),
            // onun ebeveynini bulup, oraya eklemeliyiz.
            if (parentBlock && !hasChildren(parentBlock)) {
              const realParent = findParent(state.blocks as EmailBlock[], parentBlock.id)
              if (realParent) {
                parentBlock = realParent
              } else {
                // Ebeveyni yoksa (ki imkansız ama) root'a dön
                parentBlock = findBlock(state.blocks as EmailBlock[], 'root')
              }
            }

            // Güvenlik önlemi: Hala geçerli bir parent yoksa root'a zorla
            if (!parentBlock || !hasChildren(parentBlock)) {
              parentBlock = findBlock(state.blocks as EmailBlock[], 'root') as RootBlock
            }

            // Artık elimizde kesinlikle "Children" dizisi olan bir `parentBlock` var.
            // TypeScript'in bunu anlaması için Type Guard ile daraltıyoruz:
            const targetContainer = parentBlock

            // --- BUNDLE (SARMALAMA) MANTIĞI ---
            // Kural: Root içine doğrudan Text, Button veya Image eklenemez.
            // Bunlar bir Section içine sarılmalıdır.
            const isRoot = targetContainer.id === 'root'
            const isContentBlock = ['text', 'button', 'image'].includes(newBlock.type)

            if (isRoot && isContentBlock) {
              const wrapperSection: SectionBlock = {
                id: crypto.randomUUID(),
                type: 'section',
                props: {},
                children: [newBlock],
              }

              // Wrapper'ı ekle
              // @ts-ignore
              targetContainer.children.push(wrapperSection)
              state.selected = newBlock.id
            } else {
              // Normal ekleme
              // @ts-ignore
              targetContainer.children.push(newBlock)
              state.selected = newBlock.id
            }
          }),

        updateBlock: (id, data) =>
          set((state) => {
            const block = findBlock(state.blocks as EmailBlock[], id)
            if (!block) return

            // Props güncelleme (Style vb.)
            if (data.props) {
              block.props = block.props || {}
              Object.assign(block.props, data.props)
            }

            // İçerik güncelleme (Text, Button label)
            if (data.content !== undefined && (block.type === 'text' || block.type === 'button')) {
              ;(block as Draft<BlockWithContent>).content = data.content
            }

            // Helper: Style kısayolu
            if (data.styles) {
              block.props = block.props || {}
              // @ts-ignore
              block.props.style = { ...block.props.style, ...data.styles }
            }
          }),

        removeBlock: (id) =>
          set((state) => {
            if (id === 'root') return
            const parent = findParent(state.blocks as EmailBlock[], id)

            if (parent && hasChildren(parent)) {
              const index = parent.children.findIndex((b) => b.id === id)
              if (index !== -1) {
                // Immer array metodu splice ile siliyoruz
                parent.children.splice(index, 1)

                // Eğer silinen seçiliyse, seçimi kaldır
                if (state.selected === id) {
                  state.selected = null
                }
              }
            }
          }),

        moveBlock: (activeId, overId) =>
          set((state) => {
            const blocks = state.blocks as EmailBlock[]
            const activeParent = findParent(blocks, activeId)
            const overParent = findParent(blocks, overId)

            // Sadece aynı parent içindeki hareketlere izin veriyoruz (Basit Sortable)
            // Farklı parentlar arası geçiş (Drag between containers) daha karmaşık logic gerektirir
            if (activeParent && overParent && activeParent.id === overParent.id) {
              const children = activeParent.children as EmailBlock[]
              const oldIndex = children.findIndex((x) => x.id === activeId)
              const newIndex = children.findIndex((x) => x.id === overId)

              if (oldIndex >= 0 && newIndex >= 0) {
                // arrayMove immutable döner, immer içinde olduğumuz için mutate etmeliyiz
                // ancak arrayMove basit bir helper, immer ile direkt assignment yapabiliriz.
                activeParent.children = arrayMove(
                  children,
                  oldIndex,
                  newIndex,
                ) as Draft<EmailBlock>[]
              }
            }
          }),

        moveBlockStep: (id, direction) =>
          set((state) => {
            const blocks = state.blocks as EmailBlock[]
            const parent = findParent(blocks, id)

            if (parent && hasChildren(parent)) {
              const index = parent.children.findIndex((b) => b.id === id)
              const newIndex = direction === 'before' ? index - 1 : index + 1

              if (newIndex >= 0 && newIndex < parent.children.length) {
                // Swap logic
                const item = parent.children[index]
                parent.children.splice(index, 1)
                parent.children.splice(newIndex, 0, item)
              }
            }
          }),

        getBlock: (id) => findBlock(get().blocks, id),
        getParent: (id) => findParent(get().blocks, id),
      })),
      {
        limit: 50, // Geçmiş limit
        partialize: (state) => ({ blocks: state.blocks }), // Sadece blocks state'ini sakla
        equality: (a, b) => a.blocks === b.blocks, // Render performans optimizasyonu
      },
    ),
  ) as unknown as EmailStoreApi

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
