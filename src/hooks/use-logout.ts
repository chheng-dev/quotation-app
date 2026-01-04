import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'

import { useQueryClient } from '@tanstack/react-query'

import { authApi } from '../lib/api/auth-api'
import { useMutationWithProgress } from './use-mutation-with-progress'

interface UseLogoutOptions {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useLogout(options: UseLogoutOptions = {}) {
  const queryClient = useQueryClient()
  const { onSuccess, onError } = options
  const router = useRouter()
  const locale = useLocale()

  return useMutationWithProgress({
    mutationKey: ['logout'],
    mutationFn: async () => authApi.logout(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['me'] })
      queryClient.clear()

      if (onSuccess) {
        onSuccess()
      }

      router.push(`/${locale}/login`)
    },
    onError: (error: Error) => {
      if (onError) {
        onError(error)
      }
    },
  })
}
