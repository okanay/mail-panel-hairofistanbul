import { useModalStore } from '@/features/modals/store'
import { X, Loader2, User, Mail, Phone, Check, Lock, EyeOff, Eye, CheckCircle2 } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { useState } from 'react'
import { useAuth } from '@/providers/auth'
import { useUpdateProfile } from '../queries/use-update-user'

const profileFormSchema = z.object({
  name: z.string().min(1, 'İsim zorunludur').max(100, 'İsim en fazla 100 karakter olabilir'),
  email: z.email('Geçerli bir email adresi giriniz').optional().or(z.literal('')),
  phone: z.string().max(20, 'Telefon en fazla 20 karakter olabilir').optional().or(z.literal('')),
  password: z
    .string({ message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' })
    .max(16, { message: 'Password must be at most 16 characters' })
    .optional(),
})

type ProfileFormData = z.infer<typeof profileFormSchema>

interface ProfileEditModalProps {
  onClose: () => void
}

type StatusMessageType = {
  type: 'success' | 'error' | null
  message: string | null
}

export function ProfileEditModal({ onClose }: ProfileEditModalProps) {
  const { user } = useAuth()

  const [statusMessage, setStatusMessage] = useState<StatusMessageType>({
    type: null,
    message: null,
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      password: undefined,
    },
    mode: 'onSubmit',
  })

  const { mutate, isPending } = useUpdateProfile({
    onSuccess: () => {
      setStatusMessage({ type: 'success', message: 'Profiliniz güncellendi.' })
    },
    onError: (error: Error) => {
      setStatusMessage({ type: 'error', message: error.message })
    },
  })

  const onSubmit = (formData: ProfileFormData) => {
    mutate({
      name: formData.name,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      password: formData.password || undefined,
    })
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-dvh w-screen flex-col overflow-hidden bg-white md:h-auto md:max-h-[85vh] md:w-lg md:max-w-lg md:rounded-lg md:shadow-2xl">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-stone-100 px-6 py-4">
        <div>
          <h2 className="text-xl font-bold text-stone-950">Profili Düzenle</h2>
          <p className="mt-0.5 text-sm text-stone-800">Kişisel bilgilerinizi güncelleyin</p>
        </div>
        <button
          onClick={onClose}
          disabled={isPending}
          className="group flex size-8 items-center justify-center rounded-full border border-stone-100 bg-stone-50 transition-colors hover:border-gray-200 hover:bg-red-50 disabled:opacity-50"
        >
          <X className="size-4 text-stone-800 transition-colors group-hover:text-red-600" />
        </button>
      </div>

      {/* Content */}
      <div className="relative overflow-y-auto bg-stone-50/50 px-6 py-6">
        {/* Loading Overlay */}
        {isPending && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm font-medium text-stone-800">Kaydediliyor...</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {statusMessage?.type === 'success' && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4">
            <CheckCircle2 className="size-4 text-green-600" />
            <p>
              <span className="mt-0.5 text-sm text-green-700">{statusMessage.message}</span>
            </p>
          </div>
        )}

        {/* Error Message */}
        {statusMessage?.type === 'error' && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-900">Hata</p>
            <p className="mt-1 text-sm text-red-700">{statusMessage.message}</p>
          </div>
        )}

        {/* Form */}
        <form id="profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="flex items-center gap-2 text-sm font-medium text-stone-800"
            >
              <User className="size-4" />
              İsim Soyisim <span className="text-red-500">*</span>
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  id="name"
                  type="text"
                  placeholder="İsminizi giriniz"
                  disabled={isPending}
                  className={`h-11 w-full rounded-lg border bg-white px-3 text-base transition-colors outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm ${
                    errors.name
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-stone-200'
                  }`}
                />
              )}
            />
            {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="flex items-center gap-2 text-sm font-medium text-stone-800"
            >
              <Mail className="size-4" />
              Email Adresi
            </label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  id="email"
                  type="email"
                  placeholder="ornek@email.com"
                  autoComplete="new-password"
                  disabled={isPending}
                  className={`h-11 w-full rounded-lg border bg-white px-3 text-base transition-colors outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm ${
                    errors.email
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-stone-200'
                  }`}
                />
              )}
            />
            {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="flex items-center gap-2 text-sm font-medium text-stone-800"
            >
              <Phone className="size-4" />
              Telefon Numarası
            </label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  id="phone"
                  type="tel"
                  placeholder="+90 555 123 45 67"
                  disabled={isPending}
                  className={`h-11 w-full rounded-lg border bg-white px-3 text-base transition-colors outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm ${
                    errors.phone
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-stone-200'
                  }`}
                />
              )}
            />
            {errors.phone && <p className="text-xs text-red-600">{errors.phone.message}</p>}
          </div>
          {/* Password */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="flex items-center gap-2 text-sm font-medium text-stone-800"
            >
              <Lock className="size-4" />
              Yeni Şifre
            </label>
            <div className="relative">
              <Controller
                name="password"
                control={control}
                render={({ field }) => {
                  const [showPassword, setShowPassword] = useState(false)
                  return (
                    <>
                      <input
                        {...field}
                        id="password"
                        autoComplete="new-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Yeni Şifre"
                        disabled={isPending}
                        className={`h-11 w-full rounded-lg border bg-white px-3 pr-11 text-base transition-colors outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm ${
                          errors.password
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                            : 'border-stone-200'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-stone-500 hover:text-stone-700"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </>
                  )
                }}
              />
              {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
            </div>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="flex shrink-0 gap-3 border-t border-stone-100 bg-white px-6 py-4">
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-stone-200 bg-white px-4 text-sm font-medium text-stone-800 transition-all hover:bg-gray-50 disabled:opacity-50"
        >
          İptal
        </button>
        <button
          type="submit"
          form="profile-form"
          disabled={isPending}
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-zinc-950/10 bg-primary px-4 text-sm font-bold text-white shadow-lg transition-all hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>
    </div>
  )
}

// ============================================
// 4. MODAL HOOK - useProfileEditModal.ts
// ============================================
export const useProfileEditModal = () => {
  const { open } = useModalStore()

  const openProfileEditModal = () => {
    open(ProfileEditModal as any, {})
  }

  return { openProfileEditModal }
}
