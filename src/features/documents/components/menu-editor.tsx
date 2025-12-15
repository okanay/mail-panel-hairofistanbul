import { logoutServerFn } from '@/api/handlers/logout'
import { useProfileEditModal } from '@/features/auth/modals/modal-edit-profile'
import { useAuth } from '@/providers/auth'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { Download, Eye, FormInput, History, Home, LogOut, Mail, Save, Settings } from 'lucide-react'
import { LoadingIndicator } from '../../../components/loading-indicator'
import { useDownloadModal } from '../modals/modal-download'
import { useFormModeModal } from '../modals/modal-form-mode'
import { useDocumentHistoryModal } from '../modals/modal-history'
import { useMailModal } from '../modals/modal-send-mail'
import { useSaveDocument } from '../queries/use-save-document'
import { useSendEmail } from '../queries/use-send-email'
import { useDocumentStore } from '../store'

interface Props {
  formData?: FormFieldConfig[]
}

export const EditorMenu = ({ formData }: Props) => {
  const { user } = useAuth()
  const store = useDocumentStore()
  const config = store.config

  const search = useSearch({ from: config.from })
  const navigate = useNavigate({ from: config.from })

  const isMenuHidden = search.hideMenu === 'yes'
  const isMenuVisible = search.showMenu === 'yes'

  const [saveDocument] = useSaveDocument()

  const { openMailModal } = useMailModal()
  const { openDocumentHistoryModal } = useDocumentHistoryModal()
  const { openProfileEditModal } = useProfileEditModal()
  const { openFormModeModal } = useFormModeModal()
  const { openDownloadModal } = useDownloadModal()

  const { mutate: downloadPdf, isPending } = useSendEmail({
    store,
    onSuccess: (data) => {
      if (data.url) {
        openDownloadModal(data.url)
      }
    },
  })

  const handleDownload = async () => {
    const data = await saveDocument.refetch()

    downloadPdf({
      sendMail: false,
      hash: data.data?.hash || '',
      language: config.language,
    })
  }

  const handleToggleEditMode = () => {
    navigate({
      replace: true,
      search: {
        ...search,
        editable: isMenuVisible ? 'no' : 'yes',
        showMenu: isMenuVisible ? 'no' : 'yes',
        hideMenu: 'no',
      },
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

  const loadingStates = [
    {
      isLoading: saveDocument.isFetching,
      message: 'Kaydediliyor...',
    },
    {
      isLoading: isPending,
      message: 'PDF Oluşturuluyor...',
    },
  ]

  const isLoading = loadingStates.some((state) => state.isLoading)
  const loadingMessage = loadingStates.find((state) => state.isLoading)?.message || ''

  if (isMenuHidden) return null

  return (
    <div className="pointer-events-none fixed top-0 left-0 z-50 flex w-full justify-start p-4">
      <LoadingIndicator isVisible={isLoading}>{loadingMessage}</LoadingIndicator>
      <div className="pointer-events-auto flex flex-col">
        {/* User Profile Card & Hide*/}
        <div className="relative">
          {/* User Profile */}
          <div
            hidden={!isMenuVisible}
            className="flex w-full flex-col items-start gap-2 rounded-t-lg border border-gray-200 bg-white p-3"
          >
            <div className="flex w-full items-start justify-between gap-2">
              <button
                onClick={openProfileEditModal}
                disabled={isLoading}
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
              disabled={isLoading}
              icon={<LogOut className="-ml-1 size-4" />}
              label="Çıkış Yap"
              variant="danger"
            />
          </div>

          {/* Account Section */}
          <button
            onClick={handleToggleEditMode}
            data-hidden={!isMenuVisible}
            hidden={isMenuVisible}
            className="absolute top-0 left-2 w-fit rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-nowrap text-white transition-opacity duration-300 hover:opacity-75"
          >
            Menüyü Göster
          </button>

          {/* Main Menu */}
          <div
            hidden={!isMenuVisible}
            className="pointer-events-auto flex w-fit min-w-52 flex-col gap-1 border-x border-gray-200 bg-white py-2"
          >
            {/* Document Actions Section */}
            <div className="space-y-0.5 px-2">
              <MenuButton
                onClick={() => saveDocument.refetch()}
                disabled={isLoading}
                icon={<Save className="size-4" />}
                label="Kaydet"
              />

              <MenuButton
                onClick={handleDownload}
                disabled={isLoading}
                icon={<Download className="size-4" />}
                label="İndir"
              />

              <MenuButton
                onClick={handleToggleEditMode}
                icon={<Eye className="size-4" />}
                label={'İncele'}
              />

              <MenuButton
                onClick={handleOpenFormMode}
                icon={<FormInput className="size-4" />}
                label="Form Modu"
              />

              <MenuButton
                onClick={openDocumentHistoryModal}
                disabled={isLoading}
                icon={<History className="size-4" />}
                label="Kayıtlı Dosyalar"
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
          hidden={!isMenuVisible}
          onClick={openMailModal}
          disabled={isLoading}
          className="flex h-11 items-center justify-center gap-2 rounded-b-lg border border-zinc-950/10 bg-orange-500 px-4 text-sm font-bold text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-80"
        >
          <span>Mail Gönder</span>
          <Mail className="size-4" strokeWidth="2.75" />
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
