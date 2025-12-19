import { logoutServerFn } from '@/api/handlers/logout'
import { useProfileEditModal } from '@/features/auth/modals/modal-edit-profile'
import { useAuth } from '@/providers/auth'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import {
  Download,
  Eye,
  FilePlus,
  FormInput,
  History,
  Home,
  LogOut,
  Mail,
  Save,
  Settings,
} from 'lucide-react'
import { LoadingIndicator } from '../../../components/loading-indicator'
import { useDownloadModal } from '../modals/modal-download'
import { useFormModeModal } from '../modals/modal-form-mode'
import { useDocumentHistoryModal } from '../modals/modal-history'
import { useMailModal } from '../modals/modal-send-mail'
import { useSaveDocument } from '../queries/use-save-document'
import { useSendEmail } from '../queries/use-send-email'
import { useDocumentStore } from '../store'
import { useConfirmationModal } from '../modals/modal-confirmation'

interface Props {
  formData?: FornModeInputConfig[]
}

export const EditorMenu = ({ formData }: Props) => {
  const { user } = useAuth()
  const store = useDocumentStore()
  const config = store.config

  const search = useSearch({ from: config.from })
  const navigate = useNavigate({ from: config.from })

  const isMenuHidden = search.hideMenu === 'yes'
  const isMenuVisible = search.showMenu === 'yes'
  const hasHash = Boolean(search.hash)

  const [saveDocument] = useSaveDocument()

  const { openMailModal } = useMailModal()
  const { openDocumentHistoryModal } = useDocumentHistoryModal()
  const { openProfileEditModal } = useProfileEditModal()
  const { openFormModeModal } = useFormModeModal()
  const { openDownloadModal } = useDownloadModal()
  const { openConfirmationModal } = useConfirmationModal()

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

  const handleNewDocument = async () => {
    if (search.hash) {
      openConfirmationModal({
        title: 'Yeni Kayıt Oluştur',
        description: `Yeni bir kayıt oluşturmak üzeresiniz. Mevcut değişiklikleriniz yeni belgeye aktarılacak. Devam etmek istiyor musunuz?`,
        confirmText: 'Kayıt Oluştur',
        cancelText: 'İptal',
        variant: 'warning',
        onSubmit: () => {
          return new Promise<void>((resolve) => {
            navigate({
              replace: true,
              search: {
                ...search,
                hash: undefined,
              },
            })
              .then(() => {
                saveDocument.refetch()
              })
              .finally(() => resolve())
          })
        },
      })
    } else {
      saveDocument.refetch()
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
        {/* Menüyü Göster */}
        <button
          onClick={handleToggleEditMode}
          data-hidden={!isMenuVisible}
          hidden={isMenuVisible}
          className="absolute top-4 left-2 w-fit rounded-full bg-primary px-4 py-2 text-xs font-semibold text-nowrap text-white transition-opacity duration-300 hover:opacity-75 focus:bg-primary-500"
        >
          Menüyü Göster
        </button>

        <div
          hidden={!isMenuVisible}
          className="flex w-full min-w-46 flex-col items-start rounded-t-2xl border border-stone-200 bg-white/70 py-4 backdrop-blur-xs"
        >
          <div className="flex w-full flex-col px-2">
            <div className="mb-1.5 ml-1 flex w-full items-start justify-between gap-2">
              <button
                onClick={openProfileEditModal}
                disabled={isLoading}
                className="flex size-8 items-center justify-center rounded-full border-primary bg-primary-400 text-white transition-[colors_opacity] duration-180 hover:bg-primary-500 focus:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-80"
              >
                <Settings className="size-4" />
              </button>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-stone-900">
                  {user?.name || 'Kullanıcı'}
                </p>
                <p className="truncate text-xs text-stone-500">@{user?.username}</p>
              </div>
            </div>

            <Link
              to="/"
              search={(prev) => ({
                ...prev,
                hash: undefined,
              })}
              className="flex h-9 w-full items-center gap-2.5 rounded-md border border-transparent px-3 text-xs font-medium text-stone-700 hover:border-current/20 hover:bg-current/6 hover:ring-0 disabled:cursor-not-allowed disabled:opacity-75"
            >
              <Home className="size-4" />
              <span>Anasayfa</span>
            </Link>

            <MenuButton
              onClick={handleLogout}
              disabled={isLoading}
              icon={<LogOut className="size-4" />}
              label="Çıkış Yap"
              variant="danger"
            />
          </div>

          <hr className="my-1 h-px w-full border-stone-200" />

          <div className="flex w-full flex-col px-2">
            {/* Document Actions Section */}
            <MenuButton
              onClick={handleToggleEditMode}
              icon={<Eye className="size-4" />}
              label={'İncele'}
            />

            <MenuButton
              onClick={handleDownload}
              disabled={isLoading}
              icon={<Download className="size-4" />}
              label="İndir"
            />

            <MenuButton
              onClick={() => saveDocument.refetch()}
              disabled={isLoading}
              icon={<Save className="size-4" />}
              label="Kaydet"
            />

            {hasHash && (
              <MenuButton
                onClick={handleNewDocument}
                disabled={isLoading}
                icon={<FilePlus className="size-4" />}
                label={'Yeni Kayıt'}
              />
            )}

            <MenuButton
              onClick={handleOpenFormMode}
              icon={<FormInput className="size-4" />}
              label="Form Modu"
            />

            <MenuButton
              onClick={openDocumentHistoryModal}
              disabled={isLoading}
              icon={<History className="size-4" />}
              label="Geçmiş Belgeler"
            />
          </div>

          <hr className="my-1 h-px w-full border-stone-200" />

          {/* Language Section */}
          <div className="w-full space-y-1.5 px-4 py-1.5">
            <p className="text-xs font-medium tracking-wider text-stone-500 uppercase">Dil</p>
            <div className="grid grid-cols-2 gap-2">
              <LanguageButton
                language="en"
                isActive={config.language === 'en'}
                onClick={() => handleToggleLanguage('en')}
              />
              <LanguageButton
                language="tr"
                isActive={config.language === 'tr'}
                onClick={() => handleToggleLanguage('tr')}
              />
            </div>
          </div>
        </div>

        {/* Mail Action Button */}
        <button
          hidden={!isMenuVisible}
          onClick={openMailModal}
          disabled={isLoading}
          className="flex h-11 items-center justify-center gap-2 rounded-b-2xl border border-zinc-950/10 bg-primary px-4 text-sm font-bold text-white transition-[colors_opacity] duration-180 hover:bg-primary-500 focus:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-80"
        >
          <span>Mail Gönder</span>
          <Mail className="size-4" strokeWidth="2" />
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
    'flex h-9 w-full items-center gap-2.5 rounded-md border border-transparent px-3 text-xs font-medium  hover:border-current/20 hover:bg-current/6 hover:ring-0 disabled:cursor-not-allowed disabled:opacity-75'
  const variantClasses = variant === 'danger' ? 'text-rose-600' : 'text-stone-700'

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
    className="flex h-8 items-center justify-center rounded-md border border-stone-200 bg-white text-xs font-medium text-stone-700 transition-[colors_opacity] duration-300 hover:bg-stone-50 hover:text-primary-heavy focus:bg-stone-50 focus:text-primary-heavy disabled:cursor-not-allowed disabled:bg-primary disabled:text-white disabled:hover:bg-primary disabled:hover:opacity-100"
  >
    {language.toUpperCase()}
  </button>
)
