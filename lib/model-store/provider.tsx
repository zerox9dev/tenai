// Современный Zustand store заменяет Context провайдер
import { ModelConfig } from "@/lib/models/types"
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserKeyStatus = {
  openrouter: boolean
  openai: boolean
  xai: boolean
  anthropic: boolean
}

interface ModelsStore {
  models: ModelConfig[]
  userKeyStatus: UserKeyStatus
  favoriteModels: string[]
  isLoading: boolean
  
  // Actions
  setModels: (models: ModelConfig[]) => void
  setUserKeyStatus: (status: UserKeyStatus) => void
  setFavoriteModels: (models: string[]) => void
  setLoading: (loading: boolean) => void
  
  // Async actions
  fetchModels: () => Promise<void>
  fetchUserKeyStatus: () => Promise<void>
  fetchFavoriteModels: () => Promise<void>
  refreshAll: () => Promise<void>
}

export const useModel = create<ModelsStore>()(
  persist(
    (set, get) => ({
      models: [],
      userKeyStatus: { openai: false, anthropic: false, xai: false, openrouter: false },
      favoriteModels: [],
      isLoading: false,
      
      setModels: (models) => set({ models }),
      setUserKeyStatus: (userKeyStatus) => set({ userKeyStatus }),
      setFavoriteModels: (favoriteModels) => set({ favoriteModels }),
      setLoading: (isLoading) => set({ isLoading }),
      
      fetchModels: async () => {
        try {
          const { fetchWithCSRF } = await import("@/lib/fetch")
          const data = await fetchWithCSRF("/api/models")
          set({ models: data.models || [] })
        } catch (error) {
          console.error("Failed to fetch models:", error)
        }
      },
      
      fetchUserKeyStatus: async () => {
        try {
          const { fetchWithCSRF } = await import("@/lib/fetch")
          const data = await fetchWithCSRF("/api/user-key-status")
          set({ userKeyStatus: data })
        } catch (error) {
          console.error("Failed to fetch user key status:", error)
          set({ userKeyStatus: { openrouter: false, openai: false, xai: false, anthropic: false } })
        }
      },
      
      fetchFavoriteModels: async () => {
        try {
          const { fetchWithCSRF } = await import("@/lib/fetch")
          const data = await fetchWithCSRF("/api/user-preferences/favorite-models")
          set({ favoriteModels: data.favorite_models || [] })
        } catch (error) {
          console.error("Failed to fetch favorite models:", error)
          set({ favoriteModels: [] })
        }
      },
      
      refreshAll: async () => {
        const { fetchModels, fetchUserKeyStatus, fetchFavoriteModels } = get()
        set({ isLoading: true })
        try {
          await Promise.all([
            fetchModels(),
            fetchUserKeyStatus(),
            fetchFavoriteModels(),
          ])
        } finally {
          set({ isLoading: false })
        }
      },
    }),
    { name: 'models-store' }
  )
)

// Обратная совместимость - заглушка для старого провайдера
export function ModelProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
