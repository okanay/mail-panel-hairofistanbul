import { StoreEmailMeta } from '@/api/db/schema/store'
import { useGlobalModalStore } from '@/features/modals/store'
import { Link } from '@tanstack/react-router'
import { Eye, FileText, Loader2, MailOpen, NotebookPen, Trash2, X } from 'lucide-react'
import { Fragment } from 'react'
import { useDeleteDocument } from '../queries/use-delete-document'
import { useDocumentHistory } from '../queries/use-get-document'
import { useConfirmationModal } from './modal-confirmation'
import { useEditDocumentModal } from './modal-edit-document'

interface DocumentHistoryModalProps {
  onClose: () => void
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function DocumentHistoryModal({ onClose }: DocumentHistoryModalProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } =
    useDocumentHistory({ limit: 5 })

  const { mutate: deleteDocument } = useDeleteDocument()
  const { openConfirmationModal } = useConfirmationModal()
  const { openEditDocumentModal } = useEditDocumentModal()
  const { open } = useGlobalModalStore()

  const handleDelete = (hash: string) => {
    openConfirmationModal({
      title: 'Dokümanı Sil',
      description: `Doküman kaydını silmek istediğinize emin misiniz? Geçmişte oluşturulan PDF belgeleri korunmaya devam eder.`,
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

  const handleEdit = (item: {
    hash: string
    title?: string | null
    description?: string | null
  }) => {
    openEditDocumentModal({
      params: {
        hash: item.hash,
        title: item.title,
        description: item.description,
      },
    })
  }

  const handleEmailInfo = (emailMeta: StoreEmailMeta | null, documentHash: string) => {
    open(EmailInfoModal as any, { emailMeta, documentHash })
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
        return 'Tam Paket'
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
    <div className="flex h-dvh w-screen flex-col overflow-hidden bg-white sm:h-auto sm:max-h-[90vh] sm:w-5xl sm:max-w-xl sm:rounded-lg sm:shadow-2xl">
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
                      className="group relative flex flex-wrap items-start justify-between gap-x-6 gap-y-2 overflow-hidden rounded-lg border border-gray-200 bg-white px-4 py-4 transition-[colors_opacity] sm:items-center"
                    >
                      {/* Left */}
                      <div className="flex min-w-0 flex-1 items-start gap-3">
                        <div className="flex min-w-0 flex-col gap-1.5">
                          {/* Title & Description */}
                          {(item.title || item.description) && (
                            <div className="flex flex-col gap-1">
                              {item.title && (
                                <p className="line-clamp-1 text-sm font-semibold text-gray-800">
                                  {item.title}
                                </p>
                              )}
                              {item.description && (
                                <p className="line-clamp-2 text-xs text-gray-600">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Document Meta Info */}
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                              {formatDate(item.created_at)}
                            </div>
                            <span className="size-1 rounded-full bg-gray-300" />
                            <p className="text-xs text-gray-600">
                              {getLanguageText(item.language as DocumentLanguage)}
                            </p>
                            <span className="size-1 rounded-full bg-gray-300" />
                            <span className="text-xs font-medium text-blue-700">
                              {getContentTypeText(item.content_type as DocumentContentType)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right */}
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
                          className="flex size-8 items-center justify-center rounded-lg border border-primary-200 bg-primary-50 text-primary-600 transition-colors hover:border-primary-400 hover:bg-primary-100"
                        >
                          <Eye className="size-3.5" />
                        </Link>
                        <button
                          onClick={() => handleEdit(item)}
                          className="flex size-8 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-600 transition-colors hover:border-gray-400 hover:bg-gray-100"
                        >
                          <NotebookPen className="size-4" />
                        </button>

                        {item.email_meta && (
                          <button
                            onClick={() => handleEmailInfo(item.email_meta, item.hash)}
                            className="flex size-8 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-600 transition-colors hover:border-blue-400 hover:bg-blue-100"
                          >
                            <MailOpen className="size-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(item.hash)}
                          className="flex size-8 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600 transition-colors hover:border-rose-400 hover:bg-rose-100"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
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

// Info Modal Component - Local kullanım
interface EmailInfoModalProps {
  emailMeta: StoreEmailMeta
  documentHash: string
  onClose: () => void
}

function EmailInfoModal({ emailMeta, onClose }: EmailInfoModalProps) {
  return (
    <div className="flex h-dvh w-screen flex-col overflow-hidden bg-white sm:h-auto sm:w-xl sm:rounded-lg sm:shadow-2xl">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Email Bilgileri</h2>
            <p className="mt-0.5 text-xs text-gray-600">Son gönderim detayları</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="group flex size-8 items-center justify-center rounded-full border border-gray-100 bg-gray-50 transition-colors hover:border-gray-200 hover:bg-red-50"
        >
          <X className="size-4 text-gray-800 transition-colors group-hover:text-red-600" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-6">
        <div className="grid grid-cols-2 gap-3">
          {/* PDF URL */}
          <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
            <div className="flex min-w-0 flex-col gap-1.5">
              <p className="text-xs font-medium text-blue-900">PDF Dosyası</p>
              <a
                href={emailMeta.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate text-sm text-blue-600 hover:underline"
              >
                {emailMeta.pdf_url}
              </a>
            </div>
          </div>
          {/* Gönderim Tarihi */}
          <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
            <div className="flex min-w-0 flex-col gap-1.5">
              <p className="text-xs font-medium text-gray-600">Gönderim Tarihi</p>
              <p className="text-sm text-gray-800">{formatDate(new Date(emailMeta.sent_at))}</p>
            </div>
          </div>
        </div>

        {/* Email Adresi */}
        <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="text-xs font-medium text-gray-600">Alıcı Email</p>
            <p className="truncate text-sm text-gray-800">{emailMeta.email_address}</p>
          </div>
        </div>

        {/* Email Başlığı */}
        <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="text-xs font-medium text-gray-600">Email Başlığı</p>
            <p className="text-sm text-gray-800">{emailMeta.email_title}</p>
          </div>
        </div>

        {/* Email Açıklaması */}
        {emailMeta.email_description && (
          <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
            <div className="flex min-w-0 flex-col gap-0.5">
              <p className="text-xs font-medium text-gray-600">Email Açıklaması</p>
              <p className="text-sm whitespace-pre-wrap text-gray-800">
                {emailMeta.email_description}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-gray-100 bg-white px-6 py-4"></div>
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
