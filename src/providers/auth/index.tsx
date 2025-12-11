import { UserView } from '@/api/db/schema/users'
import { logoutServerFn } from '@/api/handlers/logout'
import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated'

// ================================
// STORE
// ================================

interface AuthState {
  user: UserView | null
  sessionStatus: SessionStatus
}

interface AuthActions {
  clearAuth: () => void
  logout: () => Promise<void>
  setUser: (updates: Partial<UserView>) => void
  setSessionStatus: (status: SessionStatus) => void
}

export type AuthStore = AuthState & AuthActions

// ================================
// CREATOR
// ================================

const createAuthStore = (initialUser: UserView | null) => {
  return createStore<AuthStore>()(
    immer((set, get) => ({
      user: initialUser,
      sessionStatus: initialUser ? 'authenticated' : 'unauthenticated',

      clearAuth: () => {
        set((state) => {
          state.user = null
          state.sessionStatus = 'unauthenticated'
        })
      },

      logout: async () => {
        try {
          await logoutServerFn()
          get().clearAuth()
        } catch (error) {
          console.error('Logout failed:', error)
        }
      },

      setUser: (updates) => {
        set((state) => {
          if (state.user) {
            state.user = { ...state.user, ...updates }
          }
        })
      },

      setSessionStatus: (status: SessionStatus) => {
        set((state) => {
          state.sessionStatus = status
        })
      },
    })),
  )
}

// ================================
// PROVIDER
// ================================

const AuthContext = createContext<StoreApi<AuthStore> | undefined>(undefined)

interface Props extends PropsWithChildren {
  initialUser: UserView | null
}

export function AuthProvider({ children, initialUser }: Props) {
  const [store] = useState(() => createAuthStore(initialUser))

  return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>
}

// ================================
// HOOK
// ================================

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return useStore(context)
}
