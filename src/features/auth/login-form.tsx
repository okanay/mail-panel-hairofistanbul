import { loginServerFn } from '@/api/handlers/login'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

export const authValidation = z.object({
  username: z
    .string({ message: 'Kullanıcı adı gerekli' })
    .min(3, { message: 'Kullanıcı adı en az 3 karakter olmalıdır' })
    .max(20, { message: 'Kullanıcı adı en fazla 20 karakter olmalıdır' })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'Kullanıcı adı sadece harfler, sayılar ve alt çizgiler içerebilir',
    }),
  password: z
    .string({ message: 'Şifre gerekli' })
    .min(6, { message: 'Şifre en az 6 karakter olmalıdır' })
    .max(16, { message: 'Şifre en fazla 16 karakter olmalıdır' }),
})

type AuthFormData = z.infer<typeof authValidation>

export const LoginForm = () => {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authValidation),
    mode: 'onSubmit',
  })

  const onSubmit = async (data: AuthFormData) => {
    setIsSubmitting(true)
    setApiError(null)

    try {
      const response = await loginServerFn({
        data: { username: data.username, password: data.password },
      })

      if (response.success) {
        navigate({
          reloadDocument: true,
          replace: true,
          search: {
            editable: 'yes',
            showMenu: 'yes',
          } as any,
        })
      } else {
        setApiError(response.message || 'Login failed')
      }
    } catch (error) {
      setApiError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-start gap-y-6 p-4 pt-16 leading-relaxed">
      <img src="/logo-y.svg" alt="hair-of-istanbul" className="h-40" />

      <div className="m-4 flex w-full max-w-sm flex-col gap-y-4">
        <div className="flex flex-col gap-y-1">
          <label className="text-sm font-semibold" htmlFor="username">
            Username
          </label>
          <input
            {...register('username')}
            id="username"
            type="text"
            placeholder="Username"
            className={`h-10 rounded-xs border px-3 transition-colors focus:ring-2 focus:outline-none ${
              errors.username
                ? 'border-rose-500 focus:ring-rose-500'
                : 'border-gray-200 focus:ring-primary'
            }`}
          />
          {errors.username && (
            <div className="flex items-center gap-x-1.5 text-sm text-rose-600">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>{errors.username.message}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-y-1">
          <label className="text-sm font-semibold" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              {...register('password')}
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className={`h-10 w-full rounded-xs border px-3 pr-11 transition-colors focus:ring-2 focus:outline-none ${
                errors.password
                  ? 'border-rose-500 focus:ring-rose-500'
                  : 'border-gray-200 focus:ring-primary'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <div className="flex items-center gap-x-1.5 text-sm text-rose-600">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>{errors.password.message}</span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="h-10 rounded-xs bg-primary font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>

        {apiError && (
          <div className="flex items-center gap-x-2 rounded-xs border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{apiError}</span>
          </div>
        )}
      </div>
    </div>
  )
}
