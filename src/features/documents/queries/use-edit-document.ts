import { useMutation, useQueryClient } from '@tanstack/react-query'
import { editDocumentServerFn } from '@/api/handlers/store-edit'

interface EditDocumentParams {
  hash: string
  title?: string
  description?: string
}

export const useEditDocument = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: EditDocumentParams) => {
      const response = await editDocumentServerFn({
        data: params,
      })

      if (!response.success) {
        throw new Error(response.error || 'Doküman güncellenirken hata oluştu')
      }

      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-history'] })
    },
  })
}
