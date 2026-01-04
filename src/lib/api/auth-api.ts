import { LoginCredentials } from '@/src/types/api'

import { apiClient } from '../api-client'

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    return apiClient.post('/login', credentials)
  },

  logout: () => apiClient.post('/logout'),

  refreshToken: () => apiClient.post('/refresh-token'),

  getMe: () => apiClient.get('/auth/me'),
}
