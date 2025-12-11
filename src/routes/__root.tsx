import { getMeByToken } from '@/api/handlers/get-me'
import { GlobalModalProvider } from '@/features/modals/provider'
import { GlobalModalStoreProvider } from '@/features/modals/store'
import type { QueryClient } from '@tanstack/react-query'
import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import globals from '../assets/styles/globals.css?url'
import { AuthProvider } from '../providers/auth'
import { LoginForm } from '@/features/auth/login-form'
import z from 'zod'

export const validation = z.object({
  language: z
    .union([z.literal('en'), z.literal('tr')])
    .optional()
    .catch(undefined),
  skipLogin: z
    .union([z.literal('yes'), z.literal('no')])
    .optional()
    .catch(undefined),
})

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  validateSearch: (search) => validation.parse(search),
  loader: async () => {
    const response = await getMeByToken()
    return response
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'HOI Holding - Administration Panel',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: globals,
      },
      // ========== FONT PRELOAD ==========
      {
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
        href: `/font-inter/regular.woff2`,
      },
      {
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
        href: `/font-inter/semibold.woff2`,
      },
      {
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
        href: `/font-inter/bold.woff2`,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const data = Route.useLoaderData()
  const { skipLogin } = Route.useSearch()

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <AuthProvider initialUser={data.user}>
          <GlobalModalStoreProvider>
            {data.user || skipLogin === 'yes' ? children : <LoginForm />}
            <GlobalModalProvider />
          </GlobalModalStoreProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  )
}
