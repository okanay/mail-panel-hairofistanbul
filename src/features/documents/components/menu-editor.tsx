import { logoutServerFn } from '@/api/handlers/logout'
import { useAuth } from '@/providers/auth'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { Eye, EyeOff, History, Home, LogOut, Mail, Save, Settings, User } from 'lucide-react'
import { useSaveDocument } from '../queries/use-save-document'
import { useDocumentStore } from '../store'
import { LoadingIndicator } from './loading-indicator'
import { useProfileEditModal } from './modal-edit-profile'
import { useDocumentHistoryModal } from './modal-get-document'
import { useMailModal } from './modal-send-mail'

export const EditorMenu = () => {
  const { config } = useDocumentStore()
  const search = useSearch({ from: config.from })
  const navigate = useNavigate({ from: config.from })
  const mode = search.editable === 'yes'
  const showMenu = search.showMenu === 'yes'
  const [query] = useSaveDocument()
  const { user } = useAuth()

  const { openMailModal } = useMailModal()
  const { openDocumentHistoryModal } = useDocumentHistoryModal()
  const { openProfileEditModal } = useProfileEditModal()

  const handleToggleEditMode = () => {
    navigate({
      search: {
        ...search,
        editable: mode ? 'no' : 'yes',
      },
      replace: true,
    })
  }

  const handleToggleLanguage = (lang: DocumentLanguage) => {
    navigate({
      to: `/docs/${lang}/${config.type}`,
      search: () => ({
        ...search,
        language: lang,
      }),
      reloadDocument: true,
      replace: true,
    })
  }

  const handleLogout = async () => {
    try {
      const response = await logoutServerFn()
      if (response.success) {
        navigate({
          reloadDocument: true,
          replace: true,
        })
      }
    } catch {}
  }

  if (!showMenu) return null

  return (
    <div className="pointer-events-none fixed top-0 left-0 z-50 flex w-full justify-start p-4">
      <LoadingIndicator isVisible={query.isFetching}>Kaydediliyor...</LoadingIndicator>

      <div className="pointer-events-auto flex flex-col gap-3">
        {/* User Profile Card */}
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
            <User className="size-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900">
              {user?.name || 'Kullanıcı'}
            </p>
            <p className="truncate text-xs text-gray-500">@{user?.username}</p>
          </div>
          <button
            onClick={openProfileEditModal}
            disabled={query.isFetching}
            className="flex size-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:border-primary hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Settings className="size-4" />
          </button>
        </div>

        {/* Main Menu */}
        <div className="flex flex-col gap-1 rounded-lg border border-gray-200 bg-white p-2">
          {/* Navigation Section */}
          <div className="space-y-0.5">
            <Link
              to="/"
              search={(prev) => ({
                ...prev,
                hash: undefined,
              })}
              className="flex h-9 items-center gap-2.5 rounded-md px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
            >
              <Home className="size-4" />
              <span>Anasayfa</span>
            </Link>
          </div>

          <hr className="my-1 border-gray-200" />

          {/* Document Actions Section */}
          <div className="space-y-0.5">
            <button
              onClick={handleToggleEditMode}
              className="flex h-9 w-full items-center gap-2.5 rounded-md px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
            >
              {mode ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              <span>{mode ? 'Görüntüle' : 'Düzenle'}</span>
            </button>

            <button
              onClick={() => openDocumentHistoryModal()}
              disabled={query.isFetching}
              className="flex h-9 w-full items-center gap-2.5 rounded-md px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <History className="size-4" />
              <span>Geçmiş</span>
            </button>

            <button
              onClick={() => query.refetch()}
              disabled={query.isFetching}
              className="flex h-9 w-full items-center gap-2.5 rounded-md px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="size-4" />
              <span>Kaydet</span>
            </button>
          </div>

          <hr className="my-1 border-gray-200" />

          {/* Language Section */}
          <div className="space-y-1.5 px-2 py-1.5">
            <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Dil</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleToggleLanguage('tr')}
                disabled={config.language === 'tr'}
                className="flex h-8 items-center justify-center rounded-md border border-gray-200 bg-white text-xs font-semibold text-gray-700 transition-all hover:border-primary hover:bg-primary/5 disabled:border-primary disabled:bg-primary disabled:text-white"
              >
                TR
              </button>
              <button
                onClick={() => handleToggleLanguage('en')}
                disabled={config.language === 'en'}
                className="flex h-8 items-center justify-center rounded-md border border-gray-200 bg-white text-xs font-semibold text-gray-700 transition-all hover:border-primary hover:bg-primary/5 disabled:border-primary disabled:bg-primary disabled:text-white"
              >
                EN
              </button>
            </div>
          </div>

          <hr className="my-1 border-gray-200" />

          {/* Account Section */}
          <div className="space-y-0.5">
            <button
              onClick={handleLogout}
              disabled={query.isFetching}
              className="flex h-9 w-full items-center gap-2.5 rounded-md px-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogOut className="size-4" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>

        {/* Mail Action Button */}
        <button
          onClick={openMailModal}
          disabled={query.isFetching}
          className="flex h-11 items-center justify-center gap-2 rounded-lg border border-zinc-950/10 bg-primary px-4 text-sm font-bold text-white shadow-lg transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Mail className="size-4" />
          <span>Mail Gönder</span>
        </button>
      </div>
    </div>
  )
}
