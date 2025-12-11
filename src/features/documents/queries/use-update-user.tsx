import { updateProfileServerFn } from '@/api/handlers/user-update'
import { useAuth } from '@/providers/auth'
import { useMutation } from '@tanstack/react-query'

interface UpdateProfilePayload {
  name: string
  email?: string
  phone?: string
}

interface UseUpdateProfileOptions {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export const useUpdateProfile = ({ onSuccess, onError }: UseUpdateProfileOptions = {}) => {
  const { setUser } = useAuth()

  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const response = await updateProfileServerFn({
        data: payload,
      })

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Profil güncellenemedi')
      }

      return response.data
    },
    onSuccess: (data) => {
      setUser(data)
      onSuccess?.()
    },
    onError,
  })
}
