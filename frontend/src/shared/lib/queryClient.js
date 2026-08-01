import { QueryClient } from '@tanstack/react-query'
import { extractApiError } from './utils'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      retry: (failureCount, error) => {
        // Don't retry on 401/403/404
        const status = error?.response?.status
        if (status === 401 || status === 403 || status === 404) return false
        return failureCount < 2
      },
    },
    mutations: {
      onError: (error) => {
        // Global mutation error logging (UI errors handled per-component)
        console.error('[Mutation Error]', extractApiError(error))
      },
    },
  },
})
