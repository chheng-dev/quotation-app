import { NextRequest, NextResponse } from 'next/server'

import { authController } from '../controllers/authController'

export interface User {
  id: number
  email: string
  name: string
  roles?: number[]
  permissions?: { resource: string; action: string }[]
}

export interface ApiHandlerContext {
  params?: Record<string, string | string[]>
  query?: Record<string, string | string[]>
  user?: User | null
}

export type ApiHandler<T = unknown> = (
  req: NextRequest,
  context: ApiHandlerContext,
) => Promise<NextResponse<T>> | Promise<Response>

export interface ApiRouteOptions {
  requireAuth?: boolean
  permissions?: { resource: string; action: string }[]
}

// Base wrapper
export const handleApiRoute = <T = unknown>(
  handler: ApiHandler<T>,
  options: ApiRouteOptions = {},
) => {
  return async (
    req: NextRequest,
    {
      params,
    }: {
      params?: Promise<Record<string, string>> | Record<string, string>
    } = {},
  ) => {
    const { requireAuth = false, permissions = [] } = options
    let user: User | null = null

    // Await params if it's a Promise (Next.js 15+)
    const resolvedParams = params instanceof Promise ? await params : params

    // Extract query parameters
    const url = new URL(req.url)
    const query = Object.fromEntries(url.searchParams.entries())

    if (requireAuth) {
      const token = req.cookies.get('accessToken')?.value

      if (!token) {
        return NextResponse.json(
          {
            error: 'Unauthorized - No token',
          },
          { status: 401 },
        )
      }

      try {
        const payload = await authController.verifyAccessToken(token)

        if (!payload || typeof payload === 'string' || !('id' in payload)) {
          return NextResponse.json(
            { error: 'Unauthorized - Invalid token' },
            { status: 401 },
          )
        }

        const userData = await authController.getUserWithPermissions(
          payload.id as number,
        )
        if (!userData) {
          return NextResponse.json(
            { error: 'Unauthorized - User not found' },
            { status: 401 },
          )
        }

        user = userData
      } catch (error) {
        const err = error as Error & { code?: string }
        const isTokenExpired =
          err.code === 'TOKEN_EXPIRED' || err.message?.includes('expired')
        const isTokenInvalid =
          err.code === 'TOKEN_INVALID' ||
          err.code === 'TOKEN_VERIFICATION_FAILED'

        const response = NextResponse.json(
          {
            error: 'Unauthorized',
            code: isTokenExpired ? 'TOKEN_EXPIRED' : 'TOKEN_INVALID',
            message: isTokenExpired
              ? 'Your session has expired. Please login again.'
              : 'Invalid authentication token.',
          },
          { status: 401 },
        )

        response.cookies.delete('accessToken')
        response.cookies.delete('refreshToken')

        return response
      }

      // Check permissions
      if (permissions.length > 0 && user?.permissions) {
        const hasAllPerms = permissions.every((requiredPerm) =>
          user!.permissions!.some(
            (userPerm) =>
              userPerm.resource === requiredPerm.resource &&
              userPerm.action === requiredPerm.action,
          ),
        )

        if (!hasAllPerms) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }
      }
    }

    // Call handler with user, params, and query
    return handler(req, { user, params: resolvedParams, query })
  }
}

// Convenience wrappers
export const handleProtectedRoute = <T = unknown>(
  handler: ApiHandler<T>,
  options: ApiRouteOptions = {},
) => handleApiRoute(handler, { ...options, requireAuth: true })

export const handlePublicRoute = <T = unknown>(handler: ApiHandler<T>) =>
  handleApiRoute(handler, { requireAuth: false })
