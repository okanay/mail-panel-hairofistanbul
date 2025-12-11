import { getDocumentHistoryServerFn } from '@/api/handlers/store-get'
import { useInfiniteQuery } from '@tanstack/react-query'

interface UseDocumentHistoryOptions {
  limit?: number
  enabled?: boolean
}

export const useDocumentHistory = ({
  limit = 20,
  enabled = true,
}: UseDocumentHistoryOptions = {}) => {
  return useInfiniteQuery({
    queryKey: ['document-history', limit],
    queryFn: async ({ pageParam }) => {
      const response = await getDocumentHistoryServerFn({
        data: {
          limit,
          cursor: pageParam,
        },
      })

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch document history')
      }

      return response.data
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled,
  })
}
