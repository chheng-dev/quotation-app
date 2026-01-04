import { useCurrentUser } from './use-current-user'
import { useLogin } from './use-login'
import { useLogout } from './use-logout'

export function useAuth() {
  const { data: user, isLoading, refetch: refetchUser } = useCurrentUser()
  const loginMutation = useLogin()
  const logoutMutation = useLogout()

  const isAuthenticated = !!user && !isLoading

  return {
    user,
    isLoading,
    isAuthenticated,
    refetchUser,
    loginMutation,
    logoutMutation,
  }
}
