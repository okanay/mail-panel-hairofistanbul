import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { authMiddleware } from '../middlewares/auth'

const sendEmailValidation = z.object({
  url: z.url(),
  hash: z.string(),
  filename: z.string(),
  language: z.string(),
  emailAddress: z.email(),
  emailTitle: z.string().min(1).max(200),
  emailDescription: z.string().max(2000),
})

interface SendEmailResponse {
  success: boolean
  data?: {
    url: string
    key: string
    hash: string
    etag: string
    filename: string
    emailSent: boolean
  }
  error?: string
  details?: any
}

export const sendEmailServerFn = createServerFn()
  .inputValidator(sendEmailValidation)
  .middleware([authMiddleware])
  .handler(async ({ data }): Promise<SendEmailResponse> => {
    try {
      const pdfServiceUrl = process.env.VITE_APP_PDF_URL
      const pdfServiceToken = process.env.APP_PDF_SERVICE_TOKEN

      if (!pdfServiceUrl || !pdfServiceToken) {
        throw new Error('PDF service configuration missing')
      }

      const targetUrl = `${pdfServiceUrl}/auth/send-email`

      const payload = {
        url: data.url,
        hash: data.hash,
        filename: data.filename || `document-${data.hash}.pdf`,
        language: data.language,
        emailAddress: data.emailAddress,
        emailTitle: data.emailTitle,
        emailDescription: data.emailDescription,
      }

      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${pdfServiceToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = (await response.json()) as any

      if (!response.ok || !result.success) {
        return {
          success: false,
          error: result.error || 'PDF generation and email sending failed',
          details: result.details,
        }
      }

      return result
    } catch (error) {
      console.error('Error in sendEmailServerFn:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  })
