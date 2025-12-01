import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Define rule patterns for RBAC
const rules = [
  { path: /^\/admin/, resource: "admin", action: "access" },
  { path: /^\/api\/users/, resource: "users", action: "read" },
  { path: /^\/api\/roles/, resource: "roles", action: "read" },
];

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  for (const rule of rules) {
    if (rule.path.test(req.nextUrl.pathname)) {
      // roles were already injected into token earlier
      const roles = token.roles || [];
      const isSuperadmin = roles.includes(1); // assuming role ID 1 is superadmin
      if (isSuperadmin) return NextResponse.next();

      const hasAccess = token.permissions?.some(
        (p) => p.resource === rule.resource && p.action === rule.action
      );

      if (!hasAccess) {
        return NextResponse.json(
          { message: "Forbidden: Not enough permissions" },
          { status: 403 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/users/:path*",
    "/api/roles/:path*",
  ],
};
