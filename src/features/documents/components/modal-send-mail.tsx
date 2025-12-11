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
  emailAddress: z.email('Geçerli bir email adresi giriniz'),
  emailTitle: z
    .string()
    .min(1, 'Mail başlığı zorunludur')
    .max(200, 'Başlık en fazla 200 karakter olabilir'),
  emailDescription: z.string().max(2000, 'Açıklama en fazla 2000 karakter olabilir'),
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
    formState: { errors, isValid },
  } = useForm<MailFormData>({
    resolver: zodResolver(mailFormSchema),
    defaultValues: {
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

    mutate({
      emailAddress: formData.emailAddress,
      emailTitle: formData.emailTitle,
      emailDescription: formData.emailDescription,
      hash: search.hash,
      language: language,
    })
  }

  const isProcessing = isPending || isSaving

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-white md:h-auto md:max-h-[85vh] md:w-lg md:max-w-lg md:rounded-lg md:shadow-2xl">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-4">
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
      <div className="relative flex-1 overflow-y-auto bg-gray-50/50 px-4 py-4">
        {/* Loading Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm font-medium text-gray-600">
                {isSaving ? 'Doküman kaydediliyor...' : 'Mail gönderiliyor...'}
              </p>
            </div>
          </div>
        )}

        {emailError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-900">Hata</p>
            <p className="mt-1 text-sm text-red-700">{emailError}</p>
          </div>
        )}

        {emailData ? (
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
            </div>
          </div>
        ) : (
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
                    disabled={isProcessing}
                    className={`h-11 w-full rounded-lg border bg-white px-3 text-sm transition-colors outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 ${
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
              <label htmlFor="emailTitle" className="block text-sm font-medium text-gray-700">
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
                    disabled={isProcessing}
                    className={`h-11 w-full rounded-lg border bg-white px-3 text-sm transition-colors outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 ${
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
                    rows={6}
                    placeholder="Mail içeriğini giriniz"
                    disabled={isProcessing}
                    className={`w-full resize-none rounded-lg border bg-white px-3 py-2.5 text-sm transition-colors outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 ${
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
      <div className="shrink-0 border-t border-gray-100 bg-white p-4">
        <button
          type="submit"
          form="mail-form"
          disabled={isProcessing || !search.hash || !!emailData || !isValid}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-sm border border-zinc-950/10 bg-primary px-4 text-sm font-bold text-white shadow-lg transition-all hover:opacity-90 disabled:opacity-50"
        >
          {isProcessing ? (
            <span>{isSaving ? 'Kaydediliyor...' : 'Gönderiliyor...'}</span>
          ) : emailData ? (
            'Gönderildi'
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
      title: 'Appointment Confirmation - <<Müşteri Adı>>',
      description: `Dear <<Müşteri Adı>>,

We are sending you the document containing all the details, hotel, and transfer information regarding your hair transplant operation scheduled for <<Operasyon Tarihi>>.

Please carefully review the points you need to consider before the operation.

We will be happy to welcome you to Istanbul.

Best regards,
Hair of Istanbul Team`,
    },
    tr: {
      title: 'Randevu Onayı - <<Müşteri Adı>>',
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
      title: 'Appointment Confirmation - <<Müşteri Adı>>',
      description: `Dear <<Müşteri Adı>>,

We are sending you the document containing all the details and transfer information regarding your hair transplant operation scheduled for <<Operasyon Tarihi>>.

Please carefully review the points you need to consider before the operation.

We will be happy to welcome you to Istanbul.

Best regards,
Hair of Istanbul Team`,
    },
    tr: {
      title: 'Randevu Onayı - <<Müşteri Adı>>',
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
      title: 'Appointment Confirmation - <<Müşteri Adı>>',
      description: `Dear <<Müşteri Adı>>,

We are sending you the document containing all the details regarding your hair transplant operation scheduled for <<Operasyon Tarihi>>.

Please carefully review the points you need to consider before the operation.

We will be happy to welcome you to Istanbul.

Best regards,
Hair of Istanbul Team`,
    },
    tr: {
      title: 'Randevu Onayı - <<Müşteri Adı>>',
      description: `Sayın <<Müşteri Adı>>,

<<Operasyon Tarihi>> tarihinde planlanan saç ekimi operasyonunuz ile ilgili tüm detayları içeren doküman ekte yer almaktadır.

Operasyon öncesi dikkat etmeniz gereken hususları lütfen dikkatlice inceleyiniz.

Sizi İstanbul'da ağırlamaktan mutluluk duyacağız.

Saygılarımızla,
Hair of Istanbul Ekibi`,
    },
  },
}
