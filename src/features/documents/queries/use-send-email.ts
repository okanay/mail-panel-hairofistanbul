import { useMutation } from '@tanstack/react-query'
import { DocumentStore } from '../store'
import { sendEmailServerFn } from '@/api/handlers/send-email'
import { useModalStore } from '@/features/modals/store'

interface UseSendEmailOptions {
  store: DocumentStore
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
}

interface SendEmailPayload {
  sendMail: boolean
  emailAddress?: string
  emailTitle?: string
  emailDescription?: string
  hash: string
  language: string
}

export const useSendEmail = ({ store, onSuccess, onError }: UseSendEmailOptions) => {
  const { setModalPending } = useModalStore()

  const mutation = useMutation({
    mutationFn: async (payload: SendEmailPayload) => {
      const frontendUrl = import.meta.env.VITE_APP_FRONTEND_URL + store.config.from

      if (!payload.hash || !frontendUrl) {
        throw new Error('Required parameters missing')
      }

      if (payload.sendMail && (!payload.emailAddress || !payload.emailTitle)) {
        throw new Error('Email address and title are required when sendMail is true')
      }

      setModalPending(true)
      const response = await sendEmailServerFn({
        data: {
          url: frontendUrl,
          hash: payload.hash,
          filename: `document-${payload.hash}.pdf`,
          language: payload.language,
          sendMail: payload.sendMail,
          ...(payload.sendMail && {
            emailAddress: payload.emailAddress,
            emailTitle: payload.emailTitle,
            emailDescription: payload.emailDescription,
          }),
        },
      }).finally(() => {
        setModalPending(false)
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
