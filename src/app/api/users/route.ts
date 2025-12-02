import { userController } from '@/src/controllers/userController';
import { handleProtectedRoute } from '@/src/lib/apiRouteWrappers';
import { NextRequest, NextResponse } from 'next/server';

export const GET = handleProtectedRoute(
  async () => {
    try {
      const users = await userController.list();
      return NextResponse.json({ users }, { status: 200 });
    } catch (error) {
      console.error('Failed to fetch users:', error);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
  },
  { permissions: [{ resource: 'users', action: 'read' }] },
);

export const POST = handleProtectedRoute(
  async (req: NextRequest) => {
    const { name, email, password } = await req.json();
    const user = await userController.createUser({ name, email, password });
    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  },
  { permissions: [{ resource: 'users', action: 'create' }] },
);
