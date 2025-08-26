// Современный API client с автоматическим кешированием
import { QueryClient, useQuery } from '@tanstack/react-query'

// Глобальный query client с умными настройками
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 минут
      gcTime: 10 * 60 * 1000,   // 10 минут  
      retry: (failureCount, error) => {
        // Не ретраить 4xx ошибки
        if (error.message.includes('4')) return false
        return failureCount < 3
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    }
  }
})

// Fetch с автоматической обработкой ошибок и CSRF
export async function fetchWithCSRF(url: string, options?: RequestInit) {
  const csrf = document.cookie.split('; ')
    .find(c => c.startsWith('csrf_token='))?.split('=')[1]
    
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-csrf-token': csrf || '',
      ...options?.headers,
    }
  })
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }
  
  return response.json()
}

// React Query hooks заменяют все кастомные провайдеры
export const useModels = () => useQuery({
  queryKey: ['models'],
  queryFn: () => fetchWithCSRF('/api/models'),
  staleTime: 1000 * 60 * 5, // 5 минут кеш
})

export const useUserKeyStatus = () => useQuery({
  queryKey: ['user-key-status'], 
  queryFn: () => fetchWithCSRF('/api/user-key-status'),
  staleTime: 1000 * 60 * 2, // 2 минуты кеш
})

export const useFavoriteModels = () => useQuery({
  queryKey: ['user-preferences', 'favorite-models'],
  queryFn: () => fetchWithCSRF('/api/user-preferences/favorite-models'),
  staleTime: 1000 * 60 * 2, // 2 минуты кеш
})


