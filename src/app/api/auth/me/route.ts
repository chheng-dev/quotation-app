import { handleProtectedRoute } from '@/src/lib/apiRouteWrappers';
import { NextResponse } from 'next/server';

export const GET = handleProtectedRoute(async (_req, user) => {
  try {
    if (!user) {
      return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
    }
    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          roles: user.roles || [],
          permissions: user.permissions || [],
        },
        message: 'User info retrieved successfully',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Failed to retrieve user info:', error);
    return NextResponse.json({ message: 'Failed to retrieve user info' }, { status: 500 });
  }
});
