import { X, FileText, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useEditDocument } from '../queries/use-edit-document'
import { useGlobalModalStore } from '@/features/modals/store'

interface EditDocumentModalProps {
  hash: string
  currentTitle?: string
  currentDescription?: string
  onClose: () => void
}

export function EditDocumentModal({
  hash,
  currentTitle = '',
  currentDescription = '',
  onClose,
}: EditDocumentModalProps) {
  const [title, setTitle] = useState(currentTitle)
  const [description, setDescription] = useState(currentDescription)
  const { mutate: editDocument, isPending } = useEditDocument()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    editDocument(
      {
        hash,
        title: title.trim() || undefined,
        description: description.trim() || undefined,
      },
      {
        onSuccess: () => {
          onClose()
        },
      },
    )
  }

  return (
    <div className="flex h-auto w-screen flex-col overflow-hidden bg-white sm:w-sm sm:rounded-lg sm:shadow-2xl">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
            <FileText className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Not Ekle</h2>
            <p className="mt-0.5 text-xs text-gray-600">Dökümanınız için notlar oluşturun.</p>
          </div>
        </div>
        <button
          onClick={onClose}
          disabled={isPending}
          className="group flex size-8 items-center justify-center rounded-full border border-gray-100 bg-gray-50 transition-colors hover:border-gray-200 hover:bg-red-50 disabled:opacity-50"
        >
          <X className="size-4 text-gray-800 transition-colors group-hover:text-red-600" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-sm font-medium text-gray-800">
            Başlık
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Doküman başlığı"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
            disabled={isPending}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="text-sm font-medium text-gray-800">
            Açıklama
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Doküman açıklaması"
            rows={4}
            className="resize-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
            disabled={isPending}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="flex flex-1 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              'Kaydet'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export const useEditDocumentModal = () => {
  const { open } = useGlobalModalStore()

  const openEditDocumentModal = (props: Omit<EditDocumentModalProps, 'onClose'>) => {
    open(EditDocumentModal as any, props)
  }

  return { openEditDocumentModal }
}
