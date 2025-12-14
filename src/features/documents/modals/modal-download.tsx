import { useModalStore } from '@/features/modals/store'
import { X } from 'lucide-react'

interface DownloadModalProps {
  onClose: () => void
  url: string
}

export function DownloadModal({ onClose, url }: DownloadModalProps) {
  return (
    <div className="flex h-dvh w-screen flex-col overflow-hidden bg-white md:h-auto md:max-h-[85vh] md:w-lg md:max-w-lg md:rounded-lg md:shadow-2xl">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-4">
        <div>
          <h2 className="text-xl font-bold text-gray-950">Dosya İndirme</h2>
          <p className="mt-0.5 text-xs text-gray-500">Dokümanınızı PDF olarak görüntüleyin.</p>
        </div>
        <button
          onClick={onClose}
          className="group flex size-8 items-center justify-center rounded-full border border-gray-100 bg-gray-50 transition-colors hover:border-gray-200 hover:bg-red-50"
        >
          <X className="size-4 text-gray-500 transition-colors group-hover:text-red-600" />
        </button>
      </div>

      {/* Content */}
      <div className="relative overflow-y-auto bg-gray-50/50 px-6 py-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="rounded-lg border border-gray-200 bg-white p-3">
              <p className="text-xs font-medium text-gray-500">PDF URL</p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block truncate text-sm text-primary hover:underline"
              >
                {url}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-gray-100 bg-white px-6 py-4">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-sm border border-zinc-950/10 bg-primary px-4 text-sm font-bold text-white shadow-lg transition-all hover:opacity-90 disabled:opacity-50"
        >
          Dosyayı Görüntüle
        </a>
      </div>
    </div>
  )
}

export const useDownloadModal = () => {
  const { open } = useModalStore()

  const openDownloadModal = (url: string) => {
    open(DownloadModal as any, { url })
  }

  return { openDownloadModal }
}
