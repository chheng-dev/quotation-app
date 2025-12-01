import { ApiClientOptions, ApiConfig } from "../types/api";

const DEFAULT_CONFIG: ApiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
};

class ApiError extends Error {
  constructor(public message: string, public statusCode?: number, public data?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

export class ApiClient {
  private config: ApiConfig;
  
  constructor(config?: ApiConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  private async request<T>(endpoint: string, options: ApiClientOptions = {}): Promise<T> {
    const { 
      baseURL = this.config.baseURL,
      headers = {},
      params,
      ...fetchOptions
    } = options;

    const url = new URL(`${baseURL}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    // Merge headers
    const mergedHeaders = {
      ...this.config.headers,
      ...headers,
    };

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: mergedHeaders,
        credentials: this.config.credentials,
      });

      const contentType = response.headers.get("Content-Type");
      const isJson = contentType && contentType.includes("application/json");

      if (!response.ok) {
        let errorData;

        if (isJson) {
          errorData = await response.json();
        } else {
          errorData = await response.text();
        }

        throw new ApiError(
          errorData?.message || `API Error: ${response.statusText}`,
          response.status,
          errorData
        );
      }

      if (response.status === 204 || !isJson) {
        return {} as T;
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new ApiError(
          error.message || "Network error occurred",
          0,
          error
        );
      }

      throw new ApiError("An unknown error occurred", 0);
    }
  }

  // HTTP methods 
  get<T>(endpoint: string, options?: ApiClientOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  post<T>(endpoint: string, body?: unknown, options?: ApiClientOptions): Promise<T> {
    return this.request<T>(endpoint, { 
      ...options, 
      method: "POST", 
      body: body ? JSON.stringify(body) : undefined 
    });
  }

  put<T>(endpoint: string, body?: unknown, options?: ApiClientOptions): Promise<T> {
    return this.request<T>(endpoint, { 
      ...options, 
      method: "PUT", 
      body: body ? JSON.stringify(body) : undefined 
    });
  }

  patch<T>(endpoint: string, body?: unknown, options?: ApiClientOptions): Promise<T> {
    return this.request<T>(endpoint, { 
      ...options, 
      method: "PATCH", 
      body: body ? JSON.stringify(body) : undefined 
    });
  }

  delete<T>(endpoint: string, options?: ApiClientOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }

  setAuthToken(token: string) {
    this.config.headers = {
      ...this.config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  clearAuthToken() {
    if (this.config.headers) {
      delete this.config.headers.Authorization;
    }
  }
}

export const apiClient = new ApiClient();