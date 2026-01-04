import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'

import { useQueryClient } from '@tanstack/react-query'

import { authApi } from '../lib/api/auth-api'
import { LoginCredentials, LoginResponse } from '../types/api'
import { useMutationWithProgress } from './use-mutation-with-progress'

interface UseLoginOptions {
  onSuccess?: (data: LoginResponse) => void
  onError?: (error: Error) => void
  redirectTo?: string
  onProgress?: (progress: number) => void
}

export function useLogin(options: UseLoginOptions = {}) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const locale = useLocale()

  const { onSuccess, onError, redirectTo = `/${locale}/admin` } = options

  return useMutationWithProgress({
    mutationKey: ['login'],
    mutationFn: async (data: LoginCredentials) => {
      const response = await authApi.login(data)
      console.log('useLogin: Login response', response)
      return response
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['me'] })
      if (onSuccess) {
        onSuccess(data as LoginResponse)
      }
      router.push(redirectTo)
    },
    onError: (error: Error) => {
      if (onError) {
        onError(error)
      }
    },
    retry: 1,
    retryDelay: 1000,
    onProgress: options.onProgress,
  })
}
