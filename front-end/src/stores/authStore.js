import { create } from "zustand"
import { persist } from "zustand/middleware"
import { authService } from "../services/authService"

export const useAuthStore = create()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const response = await authService.login({ email, password })
          const { user, token } = response.data

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (data) => {
        set({ isLoading: true })
        try {
          const response = await authService.register(data)
          const { user, token } = response.data

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        authService.logout().catch(() => {
          // Ignore errors on logout
        })
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      },

      setUser: (user) => {
        set({ user })
      },

      checkAuth: async () => {
        const { token } = get()
        if (!token) return

        try {
          const response = await authService.me()
          set({ user: response.data, isAuthenticated: true })
        } catch (error) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          })
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
