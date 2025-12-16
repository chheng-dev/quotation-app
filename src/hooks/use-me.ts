import { useQuery } from '@tanstack/react-query';
import { authApi } from '../lib/api/auth-api';

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => authApi.getMe(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
