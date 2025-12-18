import { createStore, useStore, StoreApi } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { createContext, useContext, useState, PropsWithChildren } from 'react'
import { DocumentStore as DocumentStoreDB } from '@/api/db/schema/store'
import { sanitizeHTML } from '@/utils/sanitize-html'

// --- 1. State ve Store Tanımı ---

type DocumentConfig = {
  version: DocumentVersion
  language: DocumentLanguage
  type: DocumentContentType
  from: DocumentPaths
}

export interface DocumentStore {
  store: DocumentStoreDB | undefined
  setStore: (store: DocumentStoreDB) => void
  edits: Record<string, any>
  setEdit: (key: string, value: any) => void
  setEdits: (edits: Record<string, any>) => void
  reset: () => void
  config: DocumentConfig
}

interface DocumentStoreInitials {
  initialStore: DocumentStoreDB | undefined
  initialConfig: DocumentConfig
}

interface Props extends DocumentStoreInitials, PropsWithChildren {}

const createDocumentStore = (
  initialStore: DocumentStoreDB | undefined,
  initialConfig: DocumentConfig,
) =>
  createStore<DocumentStore>()(
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
          if (typeof value === 'string') {
            state.edits[key] = sanitizeHTML(value)
          } else {
            state.edits[key] = value
          }
        }),

      setEdits: (newEdits) =>
        set((state) => {
          const sanitizedEdits: Record<string, any> = {}

          Object.entries(newEdits).forEach(([key, value]) => {
            if (typeof value === 'string') {
              sanitizedEdits[key] = sanitizeHTML(value)
            } else {
              sanitizedEdits[key] = value
            }
          })

          state.edits = sanitizedEdits
        }),

      reset: () =>
        set((state) => {
          state.edits = {}
        }),
    })),
  )

export const DocumentStoreProvider = ({ children, initialStore, initialConfig }: Props) => {
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

// Store Tipi
export type DocumentStoreApi = ReturnType<typeof createDocumentStore>
const DocumentStoreContext = createContext<StoreApi<DocumentStore> | undefined>(undefined)
