import { NextResponse } from 'next/server'

import { roleModel } from '@/src/models/roleModel'

export async function GET() {
  const result = await roleModel.findAll()
  return NextResponse.json(result)
}
