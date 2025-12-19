import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { render } from '@react-email/render'
import { DynamicEmailRenderer } from './components/renderer'

interface EmailStore {
  blocks: EmailBlock[]
  addBlock: (block: EmailBlock) => void
  updateBlock: (id: string, data: Partial<EmailBlock>) => void
  getEmailTemplate: () => Promise<string>
}

const createEmailStore = () =>
  createStore<EmailStore>()(
    immer((set, get) => ({
      blocks: [],

      addBlock: (block) =>
        set((state) => {
          state.blocks.push(block)
        }),

      updateBlock: (id, data) =>
        set((state) => {
          const blockIndex = state.blocks.findIndex((b) => b.id === id)
          if (blockIndex > -1) {
            state.blocks[blockIndex] = { ...state.blocks[blockIndex], ...data }
          }
        }),

      getEmailTemplate: async () => {
        const currentBlocks = get().blocks
        const html = await render(<DynamicEmailRenderer blocks={currentBlocks} />)
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
