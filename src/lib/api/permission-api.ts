import { QueryOptions } from '@/src/types/api'

import { apiClient } from '../api-client'

export const permissionApi = {
  list: async (options?: QueryOptions) => {
    const params = new URLSearchParams()
    if (options) {
      params.set('page', options.pagination.page.toString())
      params.set('limit', options.pagination.limit.toString())
    }
    const response = await apiClient.get(`/permissions?${params.toString()}`)
    return response as QueryOptions
  },
}
