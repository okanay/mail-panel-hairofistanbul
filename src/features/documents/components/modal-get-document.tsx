import { useGlobalModalStore } from '@/features/modals/store'
import { Link } from '@tanstack/react-router'
import { X, FileText, Loader2, Eye, Trash2 } from 'lucide-react'
import { Fragment } from 'react'
import { useDocumentHistory } from '../queries/use-get-document'
import { useDeleteDocument } from '../queries/use-delete-document'
import { useConfirmationModal } from './modal-confirmation'

interface DocumentHistoryModalProps {
  onClose: () => void
}

export function DocumentHistoryModal({ onClose }: DocumentHistoryModalProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } =
    useDocumentHistory({ limit: 5 })

  const { mutate: deleteDocument } = useDeleteDocument()
  const { openConfirmationModal } = useConfirmationModal()

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))
  }

  const handleDelete = (hash: string) => {
    openConfirmationModal({
      title: 'Dokümanı Sil',
      description: `Doküman kaydını silmek istediğinize emin misiniz? Bu işlem geri alınamaz, geçmişte oluşturulan PDF belgeleri korunmaya devam eder.`,
      confirmText: 'Sil',
      cancelText: 'İptal',
      variant: 'danger',
      onSubmit: () => {
        return new Promise<void>((resolve, reject) => {
          deleteDocument(hash, {
            onSuccess: () => resolve(),
            onError: (error) => reject(error),
          })
        })
      },
    })
  }

  const getLanguageText = (value: DocumentLanguage) => {
    switch (value) {
      case 'tr':
        return 'Türkçe'
      case 'en':
        return 'İngilizce'
      default:
        return value
    }
  }

  const getContentTypeText = (value: DocumentContentType) => {
    switch (value) {
      case 'with-otel':
        return 'Otel Paketi'
      case 'without-otel':
        return 'Transfer Paketi'
      case 'without-otel-transfer':
        return 'Sadece İşlem'
      default:
        return value
    }
  }

  const allItems = data?.pages.flatMap((page) => page.items) || []

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-white md:h-auto md:max-h-[90vh] md:w-5xl md:max-w-xl md:rounded-lg md:shadow-2xl">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Doküman Geçmişi</h2>
          <p className="mt-0.5 text-sm text-gray-800">
            {allItems.length > 0 ? `Toplam ${allItems.length} doküman` : 'Henüz doküman yok'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="group flex size-8 items-center justify-center rounded-full border border-gray-100 bg-gray-50 transition-colors hover:border-gray-200 hover:bg-red-50"
        >
          <X className="size-4 text-gray-800 transition-colors group-hover:text-red-600" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm font-medium text-gray-800">Dokümanlar yükleniyor...</p>
            </div>
          </div>
        ) : isError ? (
          <div className="mx-6 my-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-900">Hata</p>
            <p className="mt-1 text-sm text-red-700">
              {error instanceof Error ? error.message : 'Dokümanlar yüklenirken hata oluştu'}
            </p>
          </div>
        ) : allItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="flex size-16 items-center justify-center rounded-full bg-gray-100">
              <FileText className="size-8 text-gray-800" />
            </div>
            <p className="mt-4 text-base font-medium text-gray-800">Henüz doküman yok</p>
            <p className="mt-1 text-sm text-gray-800">İlk dokümanınızı oluşturarak başlayın</p>
          </div>
        ) : (
          <div className="px-6 py-4">
            {/* Grid Layout */}
            <div className="flex flex-col gap-4">
              {data?.pages.map((page, pageIndex) => (
                <Fragment key={pageIndex}>
                  {page.items.map((item) => (
                    <div
                      key={item.id}
                      className="group transition-[colors,opacity relative flex items-center justify-between overflow-hidden rounded-lg border border-gray-200 bg-white px-4 py-4"
                    >
                      {/* Left */}
                      <div className="flex min-w-0 flex-col items-start gap-1">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 rounded-lg text-xs">
                            {formatDate(item.created_at)}
                          </div>
                          <p className="text-xs text-gray-800">
                            {getLanguageText(item.language as DocumentLanguage)}
                          </p>
                          <span className="shrink-0 rounded-full text-xs font-medium text-blue-700">
                            {getContentTypeText(item.content_type as DocumentContentType)}
                          </span>
                        </div>
                        {item.hash && (
                          <p className="line-clamp-2 text-xs text-gray-600">{item.hash}</p>
                        )}
                      </div>

                      {/* Right */}
                      <div>
                        <div className="flex gap-2">
                          <Link
                            to={`/docs/${item.language}/${item.content_type}` as any}
                            search={
                              {
                                language: item.language,
                                hash: item.hash,
                                editable: 'yes',
                                showMenu: 'yes',
                              } as any
                            }
                            reloadDocument={true}
                            replace={true}
                            className="transiton-colors flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md border border-gray-200 bg-white px-4 text-xs font-medium text-gray-800 duration-300 hover:border-primary hover:bg-primary hover:text-white"
                          >
                            <Eye className="size-3.5" />
                            Görüntüle
                          </Link>
                          <button
                            onClick={() => handleDelete(item.hash)}
                            className="transiton-colors flex size-9 items-center justify-center rounded-md border border-red-200 bg-white text-red-600 duration-300 hover:bg-red-50"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </Fragment>
              ))}
            </div>

            {/* Load More Button */}
            {hasNextPage && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="transiton-colors flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-800 duration-300 hover:border-primary hover:bg-primary hover:text-white disabled:opacity-50"
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Yükleniyor...
                    </>
                  ) : (
                    'Daha Fazla Yükle'
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export const useDocumentHistoryModal = () => {
  const { open } = useGlobalModalStore()

  const openDocumentHistoryModal = () => {
    open(DocumentHistoryModal as any, {})
  }

  return { openDocumentHistoryModal }
}
