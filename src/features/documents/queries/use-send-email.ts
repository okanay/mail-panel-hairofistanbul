import { useMutation } from '@tanstack/react-query'
import { DocumentStore } from '../store'
import { sendEmailServerFn } from '@/api/handlers/send-email'

interface UseSendEmailOptions {
  store: DocumentStore
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
}

interface SendEmailPayload {
  emailAddress: string
  emailTitle: string
  emailDescription: string
  hash: string
  language: string
}

export const useSendEmail = ({ store, onSuccess, onError }: UseSendEmailOptions) => {
  const mutation = useMutation({
    mutationFn: async (payload: SendEmailPayload) => {
      const frontendUrl = import.meta.env.VITE_APP_FRONTEND_URL + store.config.from

      if (!payload.hash || !frontendUrl) {
        throw new Error('Required parameters missing')
      }

      const response = await sendEmailServerFn({
        data: {
          url: frontendUrl,
          hash: payload.hash,
          filename: `document-${payload.hash}.pdf`,
          language: payload.language,
          emailAddress: payload.emailAddress,
          emailTitle: payload.emailTitle,
          emailDescription: payload.emailDescription,
        },
      })

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to generate PDF')
      }

      return response.data
    },
    onSuccess,
    onError,
    retry: 2,
    retryDelay: 1000,
  })

  return mutation
}
