import { NewUser, User } from "@/src/models/userModel";
import { apiClient } from "../api-client";

export interface UsersResponse {
  items: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const userApi = {
  getUsers: async (query?: any, limit?: number, page?: number): Promise<UsersResponse> => {
    const params = new URLSearchParams();
    if (query) {
      params.set('query', query);
    }
    if (limit) {
      params.set('limit', limit.toString());
    }
    if (page) {
      params.set('page', page.toString());
    }
    
    const response = await apiClient.get(`/users?${params.toString()}`);
    return response as UsersResponse;
  },

  getUser: async (id: string) => {
    const response = await apiClient.get(`/users/${id}`);
    return response;
  },

  createUser: async (user: NewUser) => {
    const response = await apiClient.post('/users', user);
    return response;
  },

  updateUser: async (id: string, user: NewUser) => {
    const response = await apiClient.put(`/users/${id}`, user);
    return response;
  },

  deleteUser: async (id: string) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response;
  },
};