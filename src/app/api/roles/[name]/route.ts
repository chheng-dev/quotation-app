import { NextRequest, NextResponse } from 'next/server'

import { roleController } from '@/src/controllers/roleController'
import { handleProtectedRoute } from '@/src/lib/apiRouteWrappers'

export const GET = handleProtectedRoute(
  async (req, { params, query }) => {
    const name = params?.name as string
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    const result = await roleController.findRoleWithPermissions(name as string)
    return NextResponse.json(result, { status: 200 })
  },
  {
    requireAuth: true,
    permissions: [{ resource: 'roles', action: 'read' }],
  },
)

export const PUT = handleProtectedRoute(
  async (req: NextRequest, { params }) => {
    const name = params?.name as string
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    try {
      const body = await req.json()
      const result = await roleController.updateRoleWithPermissions(name, body)
      return NextResponse.json(result, { status: 200 })
    } catch (error) {
      return NextResponse.json(
        {
          message:
            error instanceof Error ? error.message : 'Failed to update role',
        },
        { status: 400 },
      )
    }
  },
  {
    requireAuth: true,
    permissions: [{ resource: 'roles', action: 'update' }],
  },
)
