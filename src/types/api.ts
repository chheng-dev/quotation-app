export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
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