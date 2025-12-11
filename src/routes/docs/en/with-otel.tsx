import { createFileRoute } from '@tanstack/react-router'
import { Route as DocumentRoute } from '../route'
import { DocumentStoreProvider } from '@/features/documents/store'
import { WithOtelPageEN } from '@/features/documents/pages/en-with-otel'

export const Route = createFileRoute('/docs/en/with-otel')({
  component: InnerComponent,
})

function InnerComponent() {
  const { store } = DocumentRoute.useLoaderData()
  const safeStore = store?.store ? store.store : undefined

  return (
    <DocumentStoreProvider
      initialStore={safeStore}
      initialConfig={{
        language: 'en',
        type: 'with-otel',
        from: '/docs/en/with-otel',
      }}
    >
      <WithOtelPageEN />
    </DocumentStoreProvider>
  )
}
