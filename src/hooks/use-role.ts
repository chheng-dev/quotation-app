import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { roleApi } from '../lib/api/role-api'

export function transform(data: any[]) {
  return data.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    totalPermissions: item.totalPermissions,
  }))
}

export function getRole(name: string) {
  return useQuery({
    queryKey: ['role', name],
    queryFn: async () => {
      const result = await roleApi.get(name)
      return result
    },
    enabled: !!name,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function getRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const result = await roleApi.list()
      return transform(result as any)
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useUpdateRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['update-role'],
    mutationFn: ({
      name,
      data,
    }: {
      name: string
      data: { name: string; description?: string; permissions: number[] }
    }) => roleApi.update(name, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      queryClient.invalidateQueries({ queryKey: ['role'] })
    },
  })
}
