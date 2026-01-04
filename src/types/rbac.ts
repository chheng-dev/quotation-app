export type Action = string
export type Resource = string

export interface Permission {
  resource: Resource
  actions: Action[]
  conditions?: Record<string, unknown>
}

// Flat permission format from API
export interface FlatPermission {
  resource: Resource
  action: Action
  conditions?: Record<string, unknown>
}

export interface Role {
  id: number
  name: string
  permissions?: Permission[]
}

export interface User {
  id: number
  email: string
  name: string
  roles?: Role[]
  permissions?: Permission[] | FlatPermission[]
}

export interface UserProfile {
  id: number
  email: string
  name: string
  roles?: Role[]
  permissions?: Permission[] | FlatPermission[]
  metadata?: Record<string, unknown>
}

export interface LoginResponse {
  user: UserProfile
  tokens?: {
    accessToken: string
    refreshToken: string
  }
  expiresIn?: number
}

export interface PermissionCheck {
  resource: Resource
  action: Action
  data?: Record<string, unknown>
}
