import { userController } from '@/src/controllers/userController';
import { handleProtectedRoute } from '@/src/lib/apiRouteWrappers';
import { NextRequest, NextResponse } from 'next/server';

export const GET = handleProtectedRoute(
  async () => {
    try {
      const result = await userController.list();
      return NextResponse.json(result, { status: 200 });
    } catch (error) {
      return NextResponse.json({ 
        message: error instanceof Error ? error.message : 'Failed to fetch users',
      }, { status: 400 });
    }
  },
  { permissions: [{ resource: 'users', action: 'read' }] },
);

export const POST = handleProtectedRoute(
  async (req: NextRequest) => {
    try {
      const body = await req.json();
      const user = await userController.createUser(body);
      return NextResponse.json({
        message: 'User created successfully',
        user
      }, { status: 201 });
    } catch (error) {
      return NextResponse.json({ 
        message: error instanceof Error ? error.message : 'Failed to create user',
      }, { status: 400 });
    }
  },
  { permissions: [{ resource: 'users', action: 'create' }] },
);
