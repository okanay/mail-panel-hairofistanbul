import { useGlobalModalStore } from '@/features/modals/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearch } from '@tanstack/react-router'
import { Loader2, X } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod/v4'
import { useSaveDocument } from '../queries/use-save-document'
import { useSendEmail } from '../queries/use-send-email'
import { DocumentStore, useDocumentStore } from '../store'
import { useState } from 'react'

const mailFormSchema = z.object({
  sendMail: z.literal(true),
  emailAddress: z.email('Geçerli bir email adresi giriniz').optional(),
  emailTitle: z
    .string()
    .min(1, 'Mail başlığı zorunludur')
    .max(200, 'Başlık en fazla 200 karakter olabilir')
    .optional(),
  emailDescription: z.string().max(2000, 'Açıklama en fazla 2000 karakter olabilir').optional(),
})

type MailFormData = z.infer<typeof mailFormSchema>

interface MailModalProps {
  onClose: () => void
  store: DocumentStore
  isSaving: boolean
}

export function MailModal({ onClose, store, isSaving }: MailModalProps) {
  const { language, type } = store.config
  const search = useSearch({ from: store.config.from })
  const [emailData, setEmailData] = useState<any>(null)
  const [emailError, setEmailError] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<MailFormData>({
    resolver: zodResolver(mailFormSchema),
    defaultValues: {
      sendMail: true,
      emailAddress: '',
      emailTitle: EMAIL_TEMPLATES[type][language].title,
      emailDescription: EMAIL_TEMPLATES[type][language].description,
    },
    mode: 'onChange',
  })

  const { mutate, isPending } = useSendEmail({
    store,
    onSuccess: (data) => {
      setEmailData(data)
      setEmailError(null)
    },
    onError: (error) => {
      setEmailError(error.message)
      setEmailData(null)
    },
  })

  const onSubmit = (formData: MailFormData) => {
    if (!search.hash) {
      setEmailError('Hash parameter missing')
      return
    }

    if (!formData.emailAddress || !formData.emailTitle) {
      setEmailError('Email adresi ve başlık zorunludur')
      return
    }

    mutate({
      sendMail: formData.sendMail,
      emailAddress: formData.emailAddress,
      emailTitle: formData.emailTitle,
      emailDescription: formData.emailDescription,
      hash: search.hash,
      language: language,
    })
  }

  const isProcessing = isPending || isSaving
  const showForm = !isProcessing && !emailError && !emailData
  const showSuccess = emailData !== null
  const showError = emailError !== null

  return (
    <div className="flex h-dvh w-screen flex-col overflow-hidden bg-white md:h-auto md:max-h-[85vh] md:w-lg md:max-w-lg md:rounded-lg md:shadow-2xl">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-4">
        <div>
          <h2 className="text-lg font-bold text-gray-950">Mail Gönder</h2>
          <p className="mt-0.5 text-xs text-gray-500">Dokümanınızı PDF olarak gönderin</p>
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
        {/* Loading State */}
        {isProcessing && (
          <div className="z-10 flex h-40 items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm font-medium text-gray-600">
                {isSaving ? 'Doküman kaydediliyor...' : 'Mail gönderiliyor...'}
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {showError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-900">Hata</p>
            <p className="mt-1 text-sm text-red-700">{emailError}</p>
          </div>
        )}

        {/* Success State */}
        {showSuccess && (
          <div className="space-y-4">
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <p className="text-sm font-medium text-green-900">Başarılı</p>
              <p className="mt-1 text-sm text-green-700">
                PDF başarıyla oluşturuldu ve mail gönderildi.
              </p>
            </div>

            <div className="space-y-2">
              <div className="rounded-lg border border-gray-200 bg-white p-3">
                <p className="text-xs font-medium text-gray-500">PDF URL</p>
                <a
                  href={emailData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block truncate text-sm text-primary hover:underline"
                >
                  {emailData.url}
                </a>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-3">
                <p className="text-xs font-medium text-gray-500">Dosya Hash</p>
                <p className="mt-1 truncate text-sm text-gray-900">{emailData.hash}</p>
              </div>

              {emailData.emailSent && emailData.emailMessageId && (
                <div className="rounded-lg border border-gray-200 bg-white p-3">
                  <p className="text-xs font-medium text-gray-500">Email Message ID</p>
                  <p className="mt-1 truncate text-sm text-gray-900">{emailData.emailMessageId}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Form State */}
        {showForm && (
          <form id="mail-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Address */}
            <div className="space-y-1.5">
              <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700">
                Email Adresi <span className="text-red-500">*</span>
              </label>
              <Controller
                name="emailAddress"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    id="emailAddress"
                    type="email"
                    placeholder="ornek@email.com"
                    className={`h-11 w-full rounded-lg border bg-white px-3 text-base transition-colors outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm ${
                      errors.emailAddress
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                        : 'border-gray-200'
                    }`}
                  />
                )}
              />
              {errors.emailAddress && (
                <p className="text-xs text-red-600">{errors.emailAddress.message}</p>
              )}
            </div>

            {/* Email Title */}
            <div className="space-y-1.5">
              <label
                htmlFor="emailTitle"
                className="block text-base font-medium text-gray-700 sm:text-sm"
              >
                Mail Başlığı <span className="text-red-500">*</span>
              </label>
              <Controller
                name="emailTitle"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    id="emailTitle"
                    type="text"
                    placeholder="Mail başlığını giriniz"
                    className={`h-11 w-full rounded-lg border bg-white px-3 text-base transition-colors outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm ${
                      errors.emailTitle
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                        : 'border-gray-200'
                    }`}
                  />
                )}
              />
              {errors.emailTitle && (
                <p className="text-xs text-red-600">{errors.emailTitle.message}</p>
              )}
            </div>

            {/* Email Description */}
            <div className="space-y-1.5">
              <label htmlFor="emailDescription" className="block text-sm font-medium text-gray-700">
                Mail Açıklaması
              </label>
              <Controller
                name="emailDescription"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    id="emailDescription"
                    rows={14}
                    placeholder="Mail içeriğini giriniz"
                    className={`w-full resize-none rounded-lg border bg-white px-3 py-2.5 text-sm transition-colors outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                      errors.emailDescription
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                        : 'border-gray-200'
                    }`}
                  />
                )}
              />
              {errors.emailDescription && (
                <p className="text-xs text-red-600">{errors.emailDescription.message}</p>
              )}
            </div>
          </form>
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-gray-100 bg-white px-6 py-4">
        <button
          type="submit"
          form="mail-form"
          disabled={
            isProcessing ||
            !search.hash ||
            showSuccess ||
            !isValid ||
            !watch('emailAddress') ||
            !watch('emailTitle')
          }
          className="flex h-12 w-full items-center justify-center gap-2 rounded-sm border border-zinc-950/10 bg-primary px-4 text-sm font-bold text-white shadow-lg transition-all hover:opacity-90 disabled:opacity-50"
        >
          {isProcessing ? (
            <span>{isSaving ? 'Kaydediliyor...' : 'Gönderiliyor...'}</span>
          ) : showSuccess ? (
            'Belge Gönderildi'
          ) : (
            'Mail Gönder'
          )}
        </button>
      </div>
    </div>
  )
}

export const useMailModal = () => {
  const { open } = useGlobalModalStore()
  const store = useDocumentStore()
  const [query] = useSaveDocument()

  const openMailModal = () => {
    query.refetch()
    open(MailModal as any, { store, isSaving: query.isFetching })
  }

  return { openMailModal }
}

const EMAIL_TEMPLATES: Record<
  DocumentContentType,
  Record<DocumentLanguage, { title: string; description: string }>
> = {
  'with-otel': {
    en: {
      title: 'Appointment Confirmation',
      description: `Dear <<Müşteri Adı>>,

We are sending you the document containing all the details, hotel, and transfer information regarding your hair transplant operation scheduled for <<Operasyon Tarihi>>.

Please carefully review the points you need to consider before the operation.

We will be happy to welcome you to Istanbul.

Best regards,
Hair of Istanbul Team`,
    },
    tr: {
      title: 'Randevu Onayı',
      description: `Sayın <<Müşteri Adı>>,

<<Operasyon Tarihi>> tarihinde planlanan saç ekimi operasyonunuz ile ilgili tüm detayları, otel ve transfer bilgilerini içeren doküman ekte yer almaktadır.

Operasyon öncesi dikkat etmeniz gereken hususları lütfen dikkatlice inceleyiniz.

Sizi İstanbul'da ağırlamaktan mutluluk duyacağız.

Saygılarımızla,
Hair of Istanbul Ekibi`,
    },
  },
  'without-otel': {
    en: {
      title: 'Appointment Confirmation',
      description: `Dear <<Müşteri Adı>>,

We are sending you the document containing all the details and transfer information regarding your hair transplant operation scheduled for <<Operasyon Tarihi>>.

Please carefully review the points you need to consider before the operation.

We will be happy to welcome you to Istanbul.

Best regards,
Hair of Istanbul Team`,
    },
    tr: {
      title: 'Randevu Onayı',
      description: `Sayın <<Müşteri Adı>>,

<<Operasyon Tarihi>> tarihinde planlanan saç ekimi operasyonunuz ile ilgili tüm detayları ve transfer bilgilerini içeren doküman ekte yer almaktadır.

Operasyon öncesi dikkat etmeniz gereken hususları lütfen dikkatlice inceleyiniz.

Sizi İstanbul'da ağırlamaktan mutluluk duyacağız.

Saygılarımızla,
Hair of Istanbul Ekibi`,
    },
  },
  'without-otel-transfer': {
    en: {
      title: 'Appointment Confirmation',
      description: `Dear <<Müşteri Adı>>,

We are sending you the document containing all the details regarding your hair transplant operation scheduled for <<Operasyon Tarihi>>.

Please carefully review the points you need to consider before the operation.

We will be happy to welcome you to Istanbul.

Best regards,
Hair of Istanbul Team`,
    },
    tr: {
      title: 'Randevu Onayı',
      description: `Sayın <<Müşteri Adı>>,

<<Operasyon Tarihi>> tarihinde planlanan saç ekimi operasyonunuz ile ilgili tüm detayları içeren doküman ekte yer almaktadır.

Operasyon öncesi dikkat etmeniz gereken hususları lütfen dikkatlice inceleyiniz.

Sizi İstanbul'da ağırlamaktan mutluluk duyacağız.

Saygılarımızla,
Hair of Istanbul Ekibi`,
    },
  },
}
