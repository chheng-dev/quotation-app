import { useQuery } from '@tanstack/react-query';
import { authApi } from '../lib/api/auth-api';

export interface CurrentUser {
  id: number;
  email: string;
  name: string;
  roles: number[];
  permissions: { resource: string; action: string }[];
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      try {
        const response = (await authApi.getMe()) as { user: CurrentUser };
        return response.user;
      } catch (error) {
        if (error instanceof Error && error.message.includes('401')) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useIsAuthenticated() {
  const { data: user, isLoading } = useCurrentUser();
  return {
    isAuthenticated: !!user,
    isLoading,
    user,
  };
}
