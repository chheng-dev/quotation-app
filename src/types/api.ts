import { Permission, Role } from './rbac';

export type LoginCredentials = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type LoginResponse = {
  user: {
    id: number;
    email: string;
    name: string;
    roles: Role[];
    permissions: Permission[];
    metadata?: {
      lastLoginAt?: string;
      isVerified?: boolean;
      expiredAt?: string;
    };
  };
  tokens?: {
    accessToken: string;
    refreshToken: string;
    expiresIn?: number;
  };
  permissions?: Permission[];
};

export type ApiError = {
  message: string;
  error?: string;
  statusCode?: number;
};

export type ApiConfig = {
  baseURL: string;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
  params?: Record<string, string | number | boolean>;
};

export type ApiClientOptions = RequestInit & {
  baseURL?: string;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
  params?: Record<string, string | number | boolean>;
};
