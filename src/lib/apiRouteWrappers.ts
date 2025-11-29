import { NextRequest, NextResponse } from "next/server";
import { authController } from "../controllers/authController";

export interface User {
  id: number;
  email: string;
  name: string;
  roles?: number[];
  permissions?: { resource: string; action: string }[];
}

export type ApiHandler<T = unknown> = (
  req: NextRequest, 
  user?: User | null
) => Promise<NextResponse<T>> | Promise<Response>;

export interface ApiRouteOptions {
  requireAuth?: boolean;
  permissions?: { resource: string; action: string }[];
}

// Base wrapper
export const handleApiRoute = <T = unknown>(
  handler: ApiHandler<T>,
  options: ApiRouteOptions = {}
) => {
  return async (req: NextRequest) => {
    const { requireAuth = false, permissions = [] } = options;

    let user: User | null = null;

    if (requireAuth) {
      const allCookies = req.cookies.getAll();
      const token = req.cookies.get("accessToken")?.value 

      if (!token) {
        return NextResponse.json({ 
          error: "Unauthorized - No token",
          debug: {
            availableCookies: allCookies.map(c => c.name),
            expectedCookie: "accessToken"
          }
        }, { status: 401 });
      }

      try {
        const payload = await authController.verifyAccessToken(token);
        
        if (!payload || typeof payload === 'string' || !('id' in payload)) {
          return NextResponse.json({ error: "Unauthorized - Invalid token" }, { status: 401 });
        }

        // Fetch full user data with roles and permissions
        const userData = await authController.getUserWithPermissions(payload.id as number);
        if (!userData) {
          return NextResponse.json({ error: "Unauthorized - User not found" }, { status: 401 });
        }

        user = userData;
      } catch (error) {
        console.error("Token verification error:", error);
        return NextResponse.json({ error: "Unauthorized - Token verification failed" }, { status: 401 });
      }

      // Check permissions
      if (permissions.length > 0 && user?.permissions) {
        const userPermissions = user.permissions;
        
        const hasAllPerms = permissions.every(requiredPerm => 
          userPermissions.some(
            userPerm => 
              userPerm.resource === requiredPerm.resource && 
              userPerm.action === requiredPerm.action
          )
        );

        if (!hasAllPerms) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
      }
    }

    return handler(req, user);
  };
};

// Convenience wrappers
export const handleProtectedRoute = <T = unknown>(
  handler: ApiHandler<T>,
  options: ApiRouteOptions = {}
) => handleApiRoute(handler, { ...options, requireAuth: true });

export const handlePublicRoute = <T = unknown>(handler: ApiHandler<T>) =>
  handleApiRoute(handler, { requireAuth: false });
