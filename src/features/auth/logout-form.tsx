import { logoutServerFn } from '@/api/handlers/logout'
import { useNavigate } from '@tanstack/react-router'

export const LogoutForm = () => {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col items-center justify-start gap-y-6 pt-16 leading-relaxed">
      <img src="/logo-y.svg" alt="hair-of-istanbul" className="h-40" />
      <form
        onSubmit={async (event) => {
          event.preventDefault()

          const response = await logoutServerFn()
          if (response.success) {
            navigate({
              reloadDocument: true,
              replace: true,
              search: {
                editable: 'no',
                showMenu: 'no',
              } as any,
            })
          }
        }}
        className="m-4 flex w-full max-w-sm flex-col gap-y-2"
      >
        <button type="submit" className="h-10 rounded-xs bg-primary font-bold text-white">
          Logout
        </button>
      </form>
    </div>
  )
}
