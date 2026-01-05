import { NextRequest, NextResponse } from 'next/server'

import { roleController } from '@/src/controllers/roleController'

export async function GET() {
  const result = await roleController.findAllWithPermissions()
  return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = await roleController.createRoleWithPermissions(body)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : 'Failed to create role',
      },
      { status: 400 },
    )
  }
}
