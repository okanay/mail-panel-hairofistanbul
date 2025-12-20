import { createStore, useStore, type StoreApi } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { temporal, type TemporalState } from 'zundo'
import { arrayMove } from '@dnd-kit/sortable'
import { createContext, useContext, useState, type PropsWithChildren } from 'react'
import type { Draft } from 'immer'
import { EmailExportTemplate } from './editor/exporter'
import { pretty, render } from '@react-email/render'

// ============================================
// STORE TYPES
// ============================================

interface EmailStore {
  blocks: EmailBlock[]
  selected: string | null

  // Actions
  setSelected: (id: string | null) => void
  addBlock: (block: EmailBlock) => void
  updateBlock: (id: string, data: Partial<EmailBlock> & { content?: string; styles?: any }) => void
  removeBlock: (id: string) => void

  // Movement
  moveBlock: (activeId: string, overId: string) => void
  moveBlockStep: (id: string, direction: 'before' | 'after') => void // Geri eklendi

  // Helpers
  getBlock: (id: string) => EmailBlock | null
  getParent: (id: string) => BlockWithChildren | null // Geri eklendi

  // Export
  exportToHTML: () => Promise<string>
}

// Zundo'nun takip ettiği state parçası
interface TemporalStore {
  blocks: EmailBlock[]
}

// Store API tanımı
type EmailStoreApi = StoreApi<EmailStore> & {
  temporal: StoreApi<TemporalState<TemporalStore>>
}

// ============================================
// TYPE GUARDS & HELPERS
// ============================================

const hasChildren = (block: EmailBlock): block is BlockWithChildren => {
  return ['root', 'container', 'section', 'column'].includes(block.type)
}

const hasContent = (block: EmailBlock): block is BlockWithContent => {
  return ['text', 'button'].includes(block.type)
}

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
      lang: 'tr',
      dir: 'ltr',
      style: {
        margin: '0 auto',
        backgroundColor: 'red',
        color: 'white',
        padding: '20px',
        maxWidth: '600px',
        minHeight: '600px',
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

        addBlock: (newBlock) =>
          set((state) => {
            const blocks = state.blocks as EmailBlock[]
            const selectedId = state.selected

            let targetParentId = 'root'
            let insertIndex = -1

            if (selectedId) {
              const selectedBlock = findBlock(blocks, selectedId)
              if (selectedBlock) {
                if (hasChildren(selectedBlock)) {
                  targetParentId = selectedId
                } else {
                  const parent = findParent(blocks, selectedId)
                  if (parent) {
                    targetParentId = parent.id
                    const index = parent.children.findIndex((b) => b.id === selectedId)
                    if (index !== -1) insertIndex = index + 1
                  }
                }
              }
            }

            const targetParent = findBlock(state.blocks as EmailBlock[], targetParentId)
            if (targetParent && hasChildren(targetParent)) {
              if (insertIndex === -1) {
                targetParent.children.push(newBlock as Draft<EmailBlock>)
              } else {
                targetParent.children.splice(insertIndex, 0, newBlock as Draft<EmailBlock>)
              }
              state.selected = newBlock.id
            }
          }),

        updateBlock: (id, data) =>
          set((state) => {
            const block = findBlock(state.blocks as EmailBlock[], id)
            if (!block) return

            if (data.props) {
              if (!block.props) block.props = {}
              Object.assign(block.props, data.props)
            }

            if (data.content !== undefined && hasContent(block)) {
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
            if (parent && hasChildren(parent)) {
              const index = parent.children.findIndex((b) => b.id === id)
              if (index !== -1) {
                parent.children.splice(index, 1)
                state.selected = null
              }
            }
          }),

        moveBlock: (activeId, overId) =>
          set((state) => {
            const blocks = state.blocks as EmailBlock[]
            const activeParent = findParent(blocks, activeId)
            const overParent = findParent(blocks, overId)

            if (!activeParent || !overParent) return
            if (!hasChildren(activeParent) || !hasChildren(overParent)) return

            if (activeParent.id === overParent.id) {
              const oldIndex = activeParent.children.findIndex((x) => x.id === activeId)
              const newIndex = activeParent.children.findIndex((x) => x.id === overId)

              if (oldIndex !== -1 && newIndex !== -1) {
                activeParent.children = arrayMove(
                  activeParent.children,
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

            if (!parent || !hasChildren(parent)) return

            const index = parent.children.findIndex((b) => b.id === id)
            if (index === -1) return

            const newIndex = direction === 'before' ? index - 1 : index + 1
            if (newIndex < 0 || newIndex >= parent.children.length) return

            parent.children = arrayMove(parent.children, index, newIndex) as Draft<EmailBlock>[]
          }),

        getBlock: (id) => findBlock(get().blocks, id),
        getParent: (id) => findParent(get().blocks, id),

        exportToHTML: async () => {
          const state = get()
          const rootBlock = state.blocks.find((b) => b.id === 'root') as RootBlock

          if (!rootBlock) {
            console.error('Root block not found during export')
            return ''
          }

          try {
            const html = await pretty(await render(<EmailExportTemplate root={rootBlock} />), {
              pretty: true,
            })
            return html
          } catch (error) {
            console.error('Export failed:', error)
            return ''
          }
        },
      })),
      {
        limit: 50,
        partialize: (state) => ({ blocks: state.blocks }),
        equality: (a, b) => a.blocks === b.blocks,
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
