import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { render } from '@react-email/render'
import { ReactEmailRenderer } from './editor'

interface EmailStore {
  blocks: EmailBlock[]

  addBlock: (block: EmailBlock, parentId?: string) => void
  updateBlock: (id: string, data: Partial<EmailBlock>) => void
  removeBlock: (id: string) => void

  getEmailTemplate: () => Promise<string>
}

const findAndUpdateBlock = (blocks: EmailBlock[], id: string, data: any): boolean => {
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]
    if (block.id === id) {
      blocks[i] = { ...block, ...data }
      return true
    }
    // Eğer container ise içine bak
    if (block.type === 'container' || block.type === 'column') {
      const found = findAndUpdateBlock((block as ContainerBlock).children, id, data)
      if (found) return true
    }
  }
  return false
}

const findParentAndPush = (
  blocks: EmailBlock[],
  parentId: string,
  newBlock: EmailBlock,
): boolean => {
  for (let block of blocks) {
    if (block.id === parentId && (block.type === 'container' || block.type === 'column')) {
      ;(block as ContainerBlock).children.push(newBlock)
      return true
    }
    if (block.type === 'container' || block.type === 'column') {
      const found = findParentAndPush((block as ContainerBlock).children, parentId, newBlock)
      if (found) return true
    }
  }
  return false
}

const createEmailStore = () =>
  createStore<EmailStore>()(
    immer((set, get) => ({
      blocks: [
        {
          id: 'root_1',
          type: 'container',
          styles: {
            paddingTop: 20,
            paddingBottom: 20,
          },
          children: [],
        },
      ],

      addBlock: (block, parentId) =>
        set((state) => {
          if (!parentId) {
            state.blocks.push(block)
          } else {
            findParentAndPush(state.blocks, parentId, block)
          }
        }),

      updateBlock: (id, data) =>
        set((state) => {
          findAndUpdateBlock(state.blocks, id, data)
        }),

      removeBlock: (id) =>
        set((state) => {
          console.log('Delete not implemented deep logic yet', id, state)
        }),

      getEmailTemplate: async () => {
        const currentBlocks = get().blocks
        const html = await render(<ReactEmailRenderer blocks={currentBlocks} />)
        return html
      },
    })),
  )

interface Props extends PropsWithChildren {}
const EmailContext = createContext<StoreApi<EmailStore> | undefined>(undefined)

export const EmailStoreProvider = ({ children }: Props) => {
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
