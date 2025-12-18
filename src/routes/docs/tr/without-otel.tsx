import { createFileRoute } from '@tanstack/react-router'
import { Route as DocumentRoute } from '../route'
import { DocumentStoreProvider } from '@/features/documents/store'
import { WithoutOtelPageTR } from '@/features/documents/pages/tr-without-otel'

export const Route = createFileRoute('/docs/tr/without-otel')({
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
        type: 'without-otel',
        from: '/docs/tr/without-otel',
      }}
    >
      <WithoutOtelPageTR />
    </DocumentStoreProvider>
  )
}
