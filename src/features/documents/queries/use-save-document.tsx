import { useQuery } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useDocumentStore } from '../store'
import { storeCreateServerFn, storeSaveServerFn } from '@/api/handlers/store-upsert'

export const SAVE_QUERY_KEY = ['store-save-operation'] as const

export const useSaveDocument = () => {
  const { edits, config } = useDocumentStore()
  const search = useSearch({ from: config.from })
  const navigate = useNavigate({ from: config.from })

  const query = useQuery({
    queryKey: SAVE_QUERY_KEY,
    queryFn: async () => {
      const isCreate = !search.hash
      let response

      if (isCreate) {
        response = await storeCreateServerFn({
          data: {
            version: config.version,
            content_json: edits,
            content_type: config.type,
            language: config.language,
          },
        })
      } else {
        response = await storeSaveServerFn({
          data: { hash: String(search.hash!), content: edits, language: config.language },
        })
      }

      if (!response.success || !response.store) {
        navigate({
          search: {
            ...search,
            hash: undefined,
          },
        })
        throw new Error('İşlem sunucu tarafında başarısız oldu.')
      }

      if (isCreate) {
        navigate({
          search: {
            ...search,
            hash: response.store.hash,
          },
        })
      }

      return response.store
    },
    enabled: false,
    retry: true,
    retryDelay: 1000,
    gcTime: 0,
    staleTime: 0,
  })

  return [query]
}
