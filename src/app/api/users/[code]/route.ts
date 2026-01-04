import { userController } from "@/src/controllers/userController";
import { handleProtectedRoute, User } from "@/src/lib/apiRouteWrappers";
import { NextResponse } from "next/server";

export const getByCode = async (code: string) => {
  const user = await userController.findByCode(code);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return user;
}

export const GET = handleProtectedRoute(async (req, { user, params, query }) => {
  const code = params?.code;
  
  if (!code) {
    return NextResponse.json({ error: 'Code parameter is required' }, { status: 400 });
  }

  const userData = await getByCode(code as string);
  return NextResponse.json(userData);
}, { permissions: [{ resource: 'users', action: 'read' }] });

export const PUT = handleProtectedRoute(async (req, { user, params, query }) => {
  try {
    const code = params?.code;
  
    if (!code) {
      return NextResponse.json({ error: 'Code parameter is required' }, { status: 400, statusText: 'Code parameter is required' });
    }

    const body = await req.json();
    const updatedUser = await userController.updateUser(code as string, body as Partial<User>);
    return NextResponse.json(
      {
        message: 'User updated successfully',
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to update user',
    }, { status: 500 });
  }
}, { permissions: [{ resource: 'users', action: 'update' }] });

export const DELETE = handleProtectedRoute(async (req, { user, params, query }) => {
  try {
    const code = params?.code;
    if (!code) {
      return NextResponse.json({ error: 'Code parameter is required' }, { status: 400 });
    }
    const deletedUser = await userController.deleteUser(code as string);
    return NextResponse.json(
      {
        message: 'User deleted successfully',
        user: deletedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to delete user',
    }, { status: 500 });
  }
}, { permissions: [{ resource: 'users', action: 'delete' }] });