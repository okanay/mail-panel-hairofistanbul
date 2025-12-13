import { getMeByToken } from '@/api/handlers/get-me'
import { LoginPage } from '@/features/auth/pages/login'
import { DropdownStoreProvider } from '@/features/dropdowns/store'
import type { QueryClient } from '@tanstack/react-query'
import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import z from 'zod'
import globals from '../assets/styles/globals.css?url'
import { AuthProvider } from '../providers/auth'
import { ModalStoreProvider } from '@/features/modals/store'

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
        type: 'font/ttf',
        crossOrigin: 'anonymous',
        href: `/fonts/inter/regular-normal.ttf`,
      },
      {
        rel: 'preload',
        as: 'font',
        type: 'font/ttf',
        crossOrigin: 'anonymous',
        href: `/fonts/inter/medium-normal.ttf`,
      },
      {
        rel: 'preload',
        as: 'font',
        type: 'font/ttf',
        crossOrigin: 'anonymous',
        href: `/fonts/inter/semibold-normal.ttf`,
      },
      {
        rel: 'preload',
        as: 'font',
        type: 'font/ttf',
        crossOrigin: 'anonymous',
        href: `/fonts/inter/bold-normal.ttf`,
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
          <DropdownStoreProvider>
            <ModalStoreProvider>
              {data.user || skipLogin === 'yes' ? children : <LoginPage />}
            </ModalStoreProvider>
          </DropdownStoreProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  )
}
