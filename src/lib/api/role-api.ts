import { QueryOptions } from '@/src/types/api'

import { apiClient } from '../api-client'

export const roleApi = {
  list: async (options?: QueryOptions) => {
    const params = new URLSearchParams()
    if (options) {
      params.set('page', options.pagination.page.toString())
      params.set('limit', options.pagination.limit.toString())
    }

    const response = await apiClient.get(`/roles?${params.toString()}`)
    return response
  },

  get: async (name: string) => {
    const response = await apiClient.get(`/roles/${name}`)
    return response
  },

  update: async (
    name: string,
    data: { name: string; description?: string; permissions: number[] },
  ) => {
    const response = await apiClient.put(`/roles/${name}`, data)
    return response
  },
}
