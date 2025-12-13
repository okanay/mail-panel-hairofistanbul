import { logoutServerFn } from '@/api/handlers/logout'
import { useAuth } from '@/providers/auth'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import {
  Download,
  Eye,
  EyeOff,
  FormInput,
  History,
  Home,
  LogOut,
  Mail,
  Save,
  Settings,
} from 'lucide-react'
import { useState } from 'react'
import { useSaveDocument } from '../queries/use-save-document'
import { useSendEmail } from '../queries/use-send-email'
import { useDocumentStore } from '../store'
import { LoadingIndicator } from '../../../components/loading-indicator'
import { useDocumentHistoryModal } from '../modals/modal-history'
import { useMailModal } from '../modals/modal-send-mail'
import { useFormModeModal } from '../modals/modal-form-mode'
import { useDownloadModal } from '../modals/modal-download'
import { useProfileEditModal } from '@/features/auth/modals/modal-edit-profile'

interface Props {
  formData?: DocumentFormData
}

export const EditorMenu = ({ formData }: Props) => {
  const store = useDocumentStore()
  const config = store.config

  const search = useSearch({ from: config.from })
  const navigate = useNavigate({ from: config.from })

  const { user } = useAuth()

  const [query] = useSaveDocument()
  const [hideMenu, setHideMenu] = useState(search.hideMenu === 'yes')
  const [isDownloading, setIsDownloading] = useState(false)
  const { openMailModal } = useMailModal()
  const { openDocumentHistoryModal } = useDocumentHistoryModal()
  const { openProfileEditModal } = useProfileEditModal()
  const { openFormModeModal } = useFormModeModal()
  const { openDownloadModal } = useDownloadModal()

  const { mutate: downloadPdf } = useSendEmail({
    store,
    onSuccess: (data) => {
      if (data.url) {
        openDownloadModal(data.url)
        setIsDownloading(false)
      }
    },
    onError: () => {
      setIsDownloading(false)
    },
  })

  const mode = search.editable === 'yes'
  const showMenu = search.showMenu === 'yes'
  const isLoading = query.isFetching || isDownloading
  const loadingMessage = query.isFetching ? 'Kaydediliyor...' : 'PDF Oluşturuluyor...'

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

  const handleOpenFormMode = () => {
    if (formData) {
      openFormModeModal({ formData, store })
    }
  }

  const handleHide = async () => {
    setHideMenu(!hideMenu)
    navigate({
      search: {
        ...search,
        hideMenu: hideMenu ? 'no' : 'yes',
      },
    })
  }

  if (!showMenu) return null

  return (
    <div className="pointer-events-none fixed top-0 left-0 z-50 flex w-full justify-start p-4">
      <LoadingIndicator isVisible={isLoading}>{loadingMessage}</LoadingIndicator>
      <div className="pointer-events-auto flex flex-col">
        {/* User Profile Card & Hide*/}
        <div className="relative">
          {/* User Profile */}
          <div
            hidden={hideMenu}
            className="flex w-full flex-col items-start gap-2 rounded-tl-lg border border-gray-200 bg-white p-3"
          >
            <div className="flex w-full items-start justify-between gap-2">
              <button
                onClick={openProfileEditModal}
                disabled={query.isFetching}
                className="flex size-8 items-center justify-center rounded-lg border-primary bg-primary text-white transition-opacity duration-300 hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-75"
              >
                <Settings className="size-4" />
              </button>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {user?.name || 'Kullanıcı'}
                </p>
                <p className="truncate text-xs text-gray-500">@{user?.username}</p>
              </div>
            </div>

            <Link
              to="/"
              search={(prev) => ({
                ...prev,
                hash: undefined,
              })}
              className="flex h-9 w-full items-center gap-2.5 rounded-md px-3 text-sm font-medium text-gray-700 transition-opacity hover:bg-gray-100"
            >
              <Home className="-ml-1 size-4" />
              <span>Anasayfa</span>
            </Link>

            <MenuButton
              onClick={handleLogout}
              disabled={query.isFetching}
              icon={<LogOut className="-ml-1 size-4" />}
              label="Çıkış Yap"
              variant="danger"
            />
          </div>

          {/* Account Section */}
          <button
            onClick={handleHide}
            data-hidden={hideMenu}
            className="absolute top-0 -right-16 rounded-r-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-opacity duration-300 hover:opacity-75 data-[hidden=true]:-right-18 data-[hidden=true]:rounded-l-lg data-[hidden=true]:border-l"
          >
            {hideMenu ? 'Göster' : 'Gizle'}
          </button>

          {/* Main Menu */}
          <div
            hidden={hideMenu}
            className="pointer-events-auto flex w-fit min-w-52 flex-col gap-1 border-x border-gray-200 bg-white py-2"
          >
            {/* Document Actions Section */}
            <div className="space-y-0.5 px-2">
              <MenuButton
                onClick={handleOpenFormMode}
                icon={<FormInput className="size-4" />}
                label="Form Modu"
              />

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
            <div className="space-y-1.5 px-4 py-1.5">
              <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">Dil</p>
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
          </div>
        </div>

        {/* Mail Action Button */}
        <button
          hidden={hideMenu}
          onClick={openMailModal}
          disabled={query.isFetching}
          className="flex h-11 items-center justify-center gap-2 rounded-b-lg border border-zinc-950/10 bg-primary px-4 text-sm font-semibold text-white transition-opacity hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-75"
        >
          <Mail className="size-4" />
          <span>Mail Gönder</span>
        </button>
      </div>
    </div>
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
    'flex h-9 w-full items-center font-medium gap-2.5 rounded-md px-3 text-sm  transition-opacity duration-300 disabled:cursor-not-allowed disabled:opacity-75'
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
    className="flex h-8 items-center justify-center rounded-md border border-gray-200 bg-white text-xs font-medium text-gray-700 transition-[colors_opacity] duration-300 hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-primary disabled:text-white disabled:hover:bg-primary disabled:hover:opacity-75"
  >
    {language.toUpperCase()}
  </button>
)
