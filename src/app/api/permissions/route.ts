import { NextResponse } from 'next/server'

import { permissionController } from '@/src/controllers/permissionController'
import { handleProtectedRoute } from '@/src/lib/apiRouteWrappers'

export const GET = handleProtectedRoute(
  async (request) => {
    try {
      const params = await request.nextUrl.searchParams
      const page = Number(params.get('page')) || undefined
      const limit = Number(params.get('limit')) || undefined

      const result = await permissionController.list({ page, limit })
      return NextResponse.json(result)
    } catch (error) {
      return NextResponse.json(
        {
          message:
            error instanceof Error
              ? error.message
              : 'Failed to fetch permissions',
        },
        { status: 400 },
      )
    }
  },
  { permissions: [{ resource: 'roles', action: 'read' }] },
)

export const POST = handleProtectedRoute(
  async (request) => {
    try {
      const body = await request.json()
      const result = await permissionController.create(body)
      return NextResponse.json(result)
    } catch (error) {
      return NextResponse.json(
        {
          message:
            error instanceof Error
              ? error.message
              : 'Failed to create permission',
        },
        { status: 400 },
      )
    }
  },
  { permissions: [{ resource: 'roles', action: 'create' }] },
)
