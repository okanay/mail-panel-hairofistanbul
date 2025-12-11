import { logoutServerFn } from '@/api/handlers/logout'
import { useAuth } from '@/providers/auth'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import {
  Download,
  Eye,
  EyeOff,
  History,
  Home,
  LogOut,
  Mail,
  Save,
  Settings,
  User,
} from 'lucide-react'
import { useState } from 'react'
import { useSaveDocument } from '../queries/use-save-document'
import { useSendEmail } from '../queries/use-send-email'
import { useDocumentStore } from '../store'
import { LoadingIndicator } from './loading-indicator'
import { useProfileEditModal } from './modal-edit-profile'
import { useDocumentHistoryModal } from './modal-get-document'
import { useMailModal } from './modal-send-mail'

export const EditorMenu = () => {
  const { config } = useDocumentStore()
  const store = useDocumentStore()
  const search = useSearch({ from: config.from })
  const navigate = useNavigate({ from: config.from })
  const { user } = useAuth()
  const [query] = useSaveDocument()
  const [isDownloading, setIsDownloading] = useState(false)

  const { openMailModal } = useMailModal()
  const { openDocumentHistoryModal } = useDocumentHistoryModal()
  const { openProfileEditModal } = useProfileEditModal()

  const { mutate: downloadPdf } = useSendEmail({
    store,
    onSuccess: (data) => {
      if (data.url) {
        window.open(data.url, '_blank')
      }
      setIsDownloading(false)
    },
    onError: () => {
      setIsDownloading(false)
    },
  })

  const mode = search.editable === 'yes'
  const showMenu = search.showMenu === 'yes'
  const isLoading = query.isFetching || isDownloading
  const loadingMessage = query.isFetching ? 'Kaydediliyor...' : 'PDF İndiriliyor...'

  const handleDownload = async () => {
    const data = await query.refetch()
    setIsDownloading(true)

    downloadPdf({
      sendMail: false,
      hash: data.data?.hash || '',
      language: config.language,
    })
  }

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
    <>
      {/* Desktop View (md ve üzeri) */}
      <div className="pointer-events-none fixed top-0 left-0 z-50 hidden w-full justify-start p-4 md:flex">
        <LoadingIndicator isVisible={isLoading}>{loadingMessage}</LoadingIndicator>

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
              <MenuButton
                onClick={handleToggleEditMode}
                icon={mode ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                label={mode ? 'Görüntüle' : 'Düzenle'}
              />

              <MenuButton
                onClick={openDocumentHistoryModal}
                disabled={query.isFetching}
                icon={<History className="size-4" />}
                label="Geçmiş"
              />

              <MenuButton
                onClick={() => query.refetch()}
                disabled={query.isFetching}
                icon={<Save className="size-4" />}
                label="Kaydet"
              />

              <MenuButton
                onClick={handleDownload}
                disabled={isLoading}
                icon={<Download className="size-4" />}
                label="Belgeyi İndir"
              />
            </div>

            <hr className="my-1 border-gray-200" />

            {/* Language Section */}
            <div className="space-y-1.5 px-2 py-1.5">
              <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Dil</p>
              <div className="grid grid-cols-2 gap-2">
                <LanguageButton
                  language="tr"
                  isActive={config.language === 'tr'}
                  onClick={() => handleToggleLanguage('tr')}
                />
                <LanguageButton
                  language="en"
                  isActive={config.language === 'en'}
                  onClick={() => handleToggleLanguage('en')}
                />
              </div>
            </div>

            <hr className="my-1 border-gray-200" />

            {/* Account Section */}
            <div className="space-y-0.5">
              <MenuButton
                onClick={handleLogout}
                disabled={query.isFetching}
                icon={<LogOut className="size-4" />}
                label="Çıkış Yap"
                variant="danger"
              />
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

      {/* Mobile View (md altı) */}
      <div className="pointer-events-none fixed top-0 left-0 z-50 flex w-full justify-center p-4 md:hidden">
        <LoadingIndicator isVisible={isLoading}>{loadingMessage}</LoadingIndicator>

        <div className="pointer-events-auto flex w-full max-w-5xl items-center gap-2 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
          {/* User Button */}
          <button
            onClick={openProfileEditModal}
            disabled={query.isFetching}
            className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:border-primary hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Settings className="size-4" />
          </button>

          {/* Action Buttons */}
          <div className="flex flex-1 items-center gap-1 overflow-x-auto">
            <Link
              to="/"
              search={(prev) => ({
                ...prev,
                hash: undefined,
              })}
              className="flex size-10 shrink-0 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-100"
            >
              <Home className="size-4" />
            </Link>

            <button
              onClick={handleToggleEditMode}
              className="flex size-10 shrink-0 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-100"
            >
              {mode ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
            </button>

            <button
              onClick={openDocumentHistoryModal}
              disabled={query.isFetching}
              className="flex size-10 shrink-0 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <History className="size-4" />
            </button>

            <button
              onClick={() => query.refetch()}
              disabled={query.isFetching}
              className="flex size-10 shrink-0 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="size-4" />
            </button>

            <button
              onClick={handleDownload}
              disabled={isLoading}
              className="flex size-10 shrink-0 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="size-4" />
            </button>

            <button
              onClick={handleLogout}
              disabled={query.isFetching}
              className="flex size-10 shrink-0 items-center justify-center rounded-lg text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogOut className="size-4" />
            </button>
          </div>

          {/* Mail Button */}
          <button
            onClick={openMailModal}
            disabled={query.isFetching}
            className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white shadow-lg transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Mail className="size-4" />
          </button>
        </div>
      </div>
    </>
  )
}

type MenuButtonProps = {
  onClick: () => void
  disabled?: boolean
  icon: React.ReactNode
  label: string
  variant?: 'default' | 'danger'
}

const MenuButton = ({ onClick, disabled, icon, label, variant = 'default' }: MenuButtonProps) => {
  const baseClasses =
    'flex h-9 w-full items-center gap-2.5 rounded-md px-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50'
  const variantClasses =
    variant === 'danger' ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-100'

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseClasses} ${variantClasses}`}>
      {icon}
      <span>{label}</span>
    </button>
  )
}

type LanguageButtonProps = {
  language: 'tr' | 'en'
  isActive: boolean
  onClick: () => void
}

const LanguageButton = ({ language, isActive, onClick }: LanguageButtonProps) => (
  <button
    onClick={onClick}
    disabled={isActive}
    className="flex h-8 items-center justify-center rounded-md border border-gray-200 bg-white text-xs font-semibold text-gray-700 transition-all hover:border-primary hover:bg-primary/5 disabled:border-primary disabled:bg-primary disabled:text-white"
  >
    {language.toUpperCase()}
  </button>
)
