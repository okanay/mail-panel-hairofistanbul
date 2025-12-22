import { arrayMove } from '@dnd-kit/sortable'
import { createContext, useContext, useState, type PropsWithChildren } from 'react'
import { temporal, type TemporalState } from 'zundo'
import { createStore, useStore, type StoreApi } from 'zustand'
import { immer } from 'zustand/middleware/immer'

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

const findBlock = (blocks: EmailBlock[], id: string): EmailBlock | null => {
  for (const block of blocks) {
    if (block.id === id) return block
    if (hasChildren(block)) {
      // @ts-ignore
      const found = findBlock(block.children, id)
      if (found) return found
    }
  }
  return null
}

const findParent = (
  blocks: EmailBlock[],
  childId: string,
  currentParent: BlockWithChildren | null = null,
): BlockWithChildren | null => {
  for (const block of blocks) {
    if (block.id === childId) return currentParent
    if (hasChildren(block)) {
      // @ts-ignore
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
            const blocks = state.blocks as EmailBlock[]
            let parentId = targetParentId || state.selected || 'root'

            let parentBlock = findBlock(blocks, parentId) as BlockWithChildren

            // Eğer seçili eleman bir "Leaf" (Text/Button) ise, onun parent'ına ekle
            if (parentBlock && !hasChildren(parentBlock)) {
              const realParent = findParent(blocks, parentId)
              if (realParent) {
                parentId = realParent.id
                parentBlock = realParent as BlockWithChildren
              }
            }

            // HATA KORUMASI: Eğer hala parent bulamadıysak root'a dön
            if (!parentBlock || !hasChildren(parentBlock)) {
              parentId = 'root'
              parentBlock = findBlock(blocks, 'root') as RootBlock
            }

            // --- BUNDLE MANTIĞI ---
            if (parentId === 'root' && ['text', 'button', 'image'].includes(newBlock.type)) {
              const wrapperSection: SectionBlock = {
                id: crypto.randomUUID(),
                type: 'section',
                props: {},
                children: [newBlock],
              }
              parentBlock.children.push(wrapperSection as any)
              state.selected = newBlock.id
              return
            }

            parentBlock.children.push(newBlock as ColumnBlock)
            state.selected = newBlock.id
          }),

        updateBlock: (id, data) =>
          set((state) => {
            const block = findBlock(state.blocks as EmailBlock[], id)
            if (!block) return

            if (data.props) {
              if (!block.props) block.props = {}
              Object.assign(block.props, data.props)
            }
            if (data.content !== undefined && ['text', 'button'].includes(block.type)) {
              // @ts-ignore
              block.content = data.content
            }
            if (data.styles) {
              if (!block.props) block.props = {}
              // @ts-ignore
              block.props.style = { ...block.props.style, ...data.styles }
            }
          }),

        removeBlock: (id) =>
          set((state) => {
            if (id === 'root') return
            const parent = findParent(state.blocks as EmailBlock[], id)
            if (parent) {
              const index = parent.children.findIndex((b) => b.id === id)
              if (index !== -1) {
                parent.children.splice(index, 1)
                state.selected = null
              }
            }
          }),

        moveBlock: (activeId, overId) =>
          set((state) => {
            // Basitleştirilmiş move logic (Parent kontrolü yapılmalı)
            const blocks = state.blocks as EmailBlock[]
            const activeParent = findParent(blocks, activeId)
            const overParent = findParent(blocks, overId)

            if (activeParent && overParent && activeParent.id === overParent.id) {
              const oldIndex = activeParent.children.findIndex((x) => x.id === activeId)
              const newIndex = activeParent.children.findIndex((x) => x.id === overId)
              if (oldIndex >= 0 && newIndex >= 0) {
                activeParent.children = arrayMove(
                  activeParent.children as any[],
                  oldIndex,
                  newIndex,
                ) as any
              }
            }
          }),

        moveBlockStep: (id, direction) =>
          set((state) => {
            const blocks = state.blocks as EmailBlock[]
            const parent = findParent(blocks, id)
            if (!parent) return
            const index = parent.children.findIndex((b) => b.id === id)
            const newIndex = direction === 'before' ? index - 1 : index + 1
            if (newIndex >= 0 && newIndex < parent.children.length) {
              parent.children = arrayMove(parent.children as any[], index, newIndex) as any
            }
          }),

        getBlock: (id) => findBlock(get().blocks, id),
        getParent: (id) => findParent(get().blocks, id),
      })),
      {
        limit: 50,
        partialize: (state) => ({ blocks: state.blocks }),
        equality: (a, b) => a.blocks === b.blocks,
      },
    ),
  ) as unknown as EmailStoreApi

// ============================================
// CONTEXT & HOOKS (DEĞİŞTİRİLMEDİ)
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
