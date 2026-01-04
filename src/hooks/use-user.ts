import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { userApi } from '../lib/api/user-api'
import { NewUser } from '../models/userModel'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useUsers(query?: any, limit: number = 10, page: number = 1) {
  return useQuery({
    queryKey: ['users', query, limit, page],
    queryFn: () => userApi.getUsers(query, limit, page),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useUser(code: string) {
  return useQuery({
    queryKey: ['user', code],
    queryFn: () => userApi.getUser(code),
    enabled: !!code,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['create-user'],
    mutationFn: (user: NewUser) => userApi.createUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['update-user'],
    mutationFn: ({ code, user }: { code: string; user: NewUser }) =>
      userApi.updateUser(code, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['delete-user'],
    mutationFn: (code: string) => userApi.deleteUser(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
