import { getStoreServerFn } from '@/api/handlers/store-get'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import z from 'zod'

export const validation = z.object({
  hash: z.string().optional().catch(undefined),
  editable: z
    .union([z.literal('yes'), z.literal('no')])
    .optional()
    .catch(undefined),
  showMenu: z
    .union([z.literal('yes'), z.literal('no')])
    .optional()
    .catch(undefined),
})

export const Route = createFileRoute('/docs')({
  validateSearch: (search) => validation.parse(search),
  loaderDeps: ({ search }) => ({
    hash: search.hash,
  }),
  loader: async ({ deps }) => {
    try {
      if (!deps.hash) throw new Error('Hash Not Found.')

      const store = await getStoreServerFn({ data: { hash: String(deps.hash) } })

      if (!store) throw new Error('Store Not Found.')

      return { store: store }
    } catch (error) {
      return {
        store: undefined,
      }
    }
  },
  head: () => {
    return {
      meta: [
        {
          name: 'viewport',
          content: 'width=1280, user-scalable=yes',
        },
      ],
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
