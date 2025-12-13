import { StoreEmailMeta } from '@/api/db/schema/store'
import { updateEmailMetaServerFn } from '@/api/handlers/store-edit'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface UpdateEmailMetaParams {
  hash: string
  emailMeta: StoreEmailMeta
}

export const useUpdateEmailMeta = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: UpdateEmailMetaParams) => {
      const response = await updateEmailMetaServerFn({
        data: params,
      })

      if (!response.success) {
        throw new Error(response.error || 'Email meta güncellenirken hata oluştu')
      }

      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-history'] })
    },
  })
}
