import { deleteStoreServerFn } from '@/api/handlers/store-delete'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter, useSearch } from '@tanstack/react-router'

interface UseDeleteDocumentOptions {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export const useDeleteDocument = ({ onSuccess, onError }: UseDeleteDocumentOptions = {}) => {
  const router = useRouter()
  const search = useSearch({ from: '/docs' })
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (hash: string) => {
      const response = await deleteStoreServerFn({
        data: { hash },
      })

      if (!response.success) {
        throw new Error('Doküman silinemedi')
      }

      if (search.hash === hash) {
        router.navigate({ search: { ...search, hash: undefined } as any })
      }

      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-history'] })
      onSuccess?.()
    },
    onError,
  })
}
