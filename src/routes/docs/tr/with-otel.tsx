import { createFileRoute } from '@tanstack/react-router'
import { Route as DocumentRoute } from '../route'
import { DocumentStoreProvider } from '@/features/documents/store'
import { WithOtelPageTR } from '@/features/documents/pages/tr-with-otel'

export const Route = createFileRoute('/docs/tr/with-otel')({
  component: InnerComponent,
})

function InnerComponent() {
  const { store } = DocumentRoute.useLoaderData()
  const safeStore = store?.store ? store.store : undefined

  return (
    <DocumentStoreProvider
      initialStore={safeStore}
      initialConfig={{
        version: 'v1',
        language: 'tr',
        type: 'with-otel',
        from: '/docs/tr/with-otel',
      }}
    >
      <WithOtelPageTR />
    </DocumentStoreProvider>
  )
}
