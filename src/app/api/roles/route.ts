import { roleModel } from '@/src/models/roleModel';
import { NextResponse } from 'next/server';

export async function GET() {
  const result = await roleModel.findAll();
  return NextResponse.json(result);
}
