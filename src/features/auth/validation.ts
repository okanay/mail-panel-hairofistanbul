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

export type AuthFormData = z.infer<typeof authValidation>
