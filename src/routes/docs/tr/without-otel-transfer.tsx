import { createFileRoute } from '@tanstack/react-router'
import { Route as DocumentRoute } from '../route'
import { DocumentStoreProvider } from '@/features/documents/store'
import { WithoutOtelTransferPageTR } from '@/features/documents/pages/tr-without-otel-transfer'

export const Route = createFileRoute('/docs/tr/without-otel-transfer')({
  component: InnerComponent,
})

function InnerComponent() {
  const { store } = DocumentRoute.useLoaderData()
  const safeStore = store?.store ? store.store : undefined

  return (
    <DocumentStoreProvider
      initialStore={safeStore}
      initialConfig={{
        language: 'tr',
        type: 'without-otel-transfer',
        from: '/docs/tr/without-otel-transfer',
      }}
    >
      <WithoutOtelTransferPageTR />
    </DocumentStoreProvider>
  )
}
