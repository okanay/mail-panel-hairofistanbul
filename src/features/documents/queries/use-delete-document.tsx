import { deleteStoreServerFn } from '@/api/handlers/store-delete'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface UseDeleteDocumentOptions {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export const useDeleteDocument = ({ onSuccess, onError }: UseDeleteDocumentOptions = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (hash: string) => {
      const response = await deleteStoreServerFn({
        data: { hash },
      })

      if (!response.success) {
        throw new Error('Doküman silinemedi')
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
