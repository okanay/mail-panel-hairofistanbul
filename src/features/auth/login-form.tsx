import { loginServerFn } from '@/api/handlers/login'
import { useNavigate } from '@tanstack/react-router'
import { Eye } from 'lucide-react'

export const LoginForm = () => {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col items-center justify-start gap-y-6 p-4 pt-16 leading-relaxed">
      <img src="/logo-y.svg" alt="hair-of-istanbul" className="h-40" />
      <form
        onSubmit={async (event) => {
          event.preventDefault()

          const formData = new FormData(event.currentTarget)
          const username = formData.get('username')?.toString()
          const password = formData.get('password')?.toString()

          if (username && password) {
            const response = await loginServerFn({ data: { username, password } })
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
              alert('Login fail.')
            }
          }
        }}
        className="m-4 flex w-full max-w-sm flex-col gap-y-4"
      >
        <div className="flex flex-col gap-y-1">
          <label className="text-sm font-semibold" htmlFor="username">
            Username
          </label>
          <input
            name="username"
            id="username"
            type="text"
            placeholder="Admin"
            className="h-10 rounded-xs border border-gray-200 px-3 focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        <div className="relative flex flex-col gap-y-1">
          <label className="text-sm font-semibold" htmlFor="password">
            Password
          </label>
          <input
            name="password"
            id="password"
            type="password"
            placeholder="Test1234"
            className="h-10 rounded-xs border border-gray-200 px-3 focus:ring-2 focus:ring-primary focus:outline-none"
          />
          <button
            className="absolute right-4 bottom-2"
            onClick={(e) => {
              e.preventDefault()
              const passwordInput = document.getElementById('password') as HTMLInputElement
              if (passwordInput) {
                passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password'
              }
            }}
          >
            <Eye />
          </button>
        </div>

        <button type="submit" className="h-10 rounded-xs bg-primary font-bold text-white">
          Submit
        </button>
      </form>
    </div>
  )
}
