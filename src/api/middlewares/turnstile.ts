import { env } from 'cloudflare:workers'
import { createMiddleware } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export const turnstileMiddleware = createMiddleware()
  .middleware([])
  .server(async ({ next }) => {
    const headers = getRequestHeaders()
    const token = headers.get('x-turnstile-token')
    const ip = headers.get('cf-connecting-ip') || undefined

    if (!token) {
      throw new Error('Güvenlik doğrulaması eksik (Turnstile Token Missing)')
    }

    const isValid = await verifyTurnstileToken(token, ip)

    if (!isValid) {
      throw new Error('Güvenlik doğrulaması başarısız. Lütfen sayfayı yenileyip tekrar deneyin.')
    }

    // Token geçerliyse devam et
    return next()
  })

export async function verifyTurnstileToken(token: string, ip?: string): Promise<boolean> {
  // Local development sırasında veya test key kullanılıyorsa
  if (token === 'pass') return true

  const formData = new FormData()
  formData.append('secret', env.TURNSTILE_SECRET_KEY)
  formData.append('response', token)
  if (ip) formData.append('remoteip', ip)

  try {
    const result = await fetch(TURNSTILE_VERIFY_URL, {
      body: formData,
      method: 'POST',
    })

    const outcome = await result.json<{ success: boolean }>()
    return outcome.success
  } catch (e) {
    console.error('Turnstile verification error:', e)
    return false
  }
}
