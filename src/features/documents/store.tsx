import { createStore, useStore, StoreApi } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { createContext, useContext, useState, PropsWithChildren } from 'react'
import { DocumentStore as DocumentStoreDB } from '@/api/db/schema/store'

// --- 1. State ve Store Tanımı ---

interface DocumentState {
  store: DocumentStoreDB | undefined
  setStore: (store: DocumentStoreDB) => void

  edits: Record<string, any>
  setEdit: (key: string, value: any) => void
  setEdits: (edits: Record<string, any>) => void
  reset: () => void
  config: DocumentConfig
}

interface DocumentActions {}

export type DocumentStore = DocumentState & DocumentActions

export const createDocumentStore = (
  initialStore: DocumentStoreDB | undefined,
  initialConfig: DocumentConfig,
) => {
  return createStore<DocumentStore>()(
    immer((set) => ({
      store: initialStore,
      config: initialConfig,
      setStore: (store) => {
        set((state) => {
          state.store = store
        })
      },
      edits: initialStore?.content_json || {},
      setEdit: (key, value) =>
        set((state) => {
          state.edits[key] = value
        }),
      setEdits: (newEdits) =>
        set((state) => {
          state.edits = newEdits
        }),
      reset: () =>
        set((state) => {
          state.edits = {}
        }),
    })),
  )
}

// Store Tipi
export type DocumentStoreApi = ReturnType<typeof createDocumentStore>
const DocumentStoreContext = createContext<StoreApi<DocumentStore> | undefined>(undefined)

interface DocumentStoreProviderProps extends PropsWithChildren {
  initialStore: DocumentStoreDB | undefined
  initialConfig: DocumentConfig
}

export const DocumentStoreProvider = ({
  children,
  initialStore,
  initialConfig,
}: DocumentStoreProviderProps) => {
  const [store] = useState(() => createDocumentStore(initialStore, initialConfig))

  return <DocumentStoreContext.Provider value={store}>{children}</DocumentStoreContext.Provider>
}

export const useDocumentStore = () => {
  const context = useContext(DocumentStoreContext)

  if (!context) {
    throw new Error('useDocumentStore must be used within DocumentStoreProvider')
  }

  return useStore(context)
}
