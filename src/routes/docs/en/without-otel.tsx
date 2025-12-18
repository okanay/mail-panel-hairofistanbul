import { createFileRoute } from '@tanstack/react-router'
import { Route as DocumentRoute } from '../route'
import { DocumentStoreProvider } from '@/features/documents/store'
import { WithoutOtelPageEN } from '@/features/documents/pages/en-without-otel'

export const Route = createFileRoute('/docs/en/without-otel')({
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
        language: 'en',
        type: 'without-otel',
        from: '/docs/en/without-otel',
      }}
    >
      <WithoutOtelPageEN />
    </DocumentStoreProvider>
  )
}
