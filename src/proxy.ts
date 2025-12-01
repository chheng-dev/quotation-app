import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { getTokenFromCookies } from "./lib/jwt";

// Define supported locales
const locales = ["en", "km"] as const;
const defaultLocale = "en";

// Create next-intl middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always", // Always use locale prefix
});

const rules = [
  { path: /^\/(en|km)\/admin/, resource: "admin", action: "access" },
  { path: /^\/api\/users/, resource: "users", action: "read" },
  { path: /^\/api\/roles/, resource: "roles", action: "read" },
];

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  console.log("\n=== PROXY DEBUG START ===");
  console.log("Pathname:", pathname);
  console.log("Method:", req.method);

  // Skip i18n for API routes and apply auth directly
  if (pathname.startsWith("/api")) {
    console.log("→ API Route detected");
    const tokenResult = await getTokenFromCookies(req);
    console.log("→ Token result exists:", !!tokenResult);
    
    const token = tokenResult?.user;
    
    if (token) {
      console.log("→ Token roles:", token.roles);
      console.log("→ Token permissions:", token.permissions);
    }

    // Check if route requires authentication
    const requiresAuth = rules.some(rule => rule.path.test(pathname));
    console.log("→ Requires auth:", requiresAuth);

    if (requiresAuth && !token) {
      console.log("→ BLOCKED: No token for protected route");
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check permissions for protected API routes
    if (token) {
      const roles = (token.roles as number[]) || [];
      const isSuperadmin = roles.includes(1);
      console.log("→ Is superadmin:", isSuperadmin);

      if (req.nextUrl.pathname.startsWith('/login')){
        return NextResponse.redirect(new URL('/admin', req.url));
      }
      
      // Superadmin has access to all routes, skip permission checks
      if (isSuperadmin) {
        console.log("→ ALLOWED: Superadmin access");
        const response = NextResponse.next();
        
        // If tokens were refreshed, set new cookies
        if (tokenResult?.needsRefresh && tokenResult.newAccessToken && tokenResult.newRefreshToken) {
          console.log("→ Setting refreshed tokens in cookies");
          response.cookies.set("accessToken", tokenResult.newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 1 day
          });
          response.cookies.set("refreshToken", tokenResult.newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
          });
        }
        
        return response;
      }

      // For non-superadmin users, check permissions
      for (const rule of rules) {
        if (rule.path.test(pathname)) {
          console.log("→ Checking rule:", rule.resource, rule.action);
          const permissions = (token.permissions as { resource: string; action: string }[]) || [];
          const hasAccess = permissions.some(
            (p) => p.resource === rule.resource && p.action === rule.action
          );
          console.log("→ Has access:", hasAccess);

          if (!hasAccess) {
            console.log("→ BLOCKED: Insufficient permissions");
            return NextResponse.json(
              { message: "Forbidden: Not enough permissions" },
              { status: 403 }
            );
          }
        }
      }
    }

    console.log("→ ALLOWED: API route access granted");
    console.log("=== PROXY DEBUG END ===\n");
    
    const response = NextResponse.next();
    
    // If tokens were refreshed, set new cookies
    if (tokenResult?.needsRefresh && tokenResult.newAccessToken && tokenResult.newRefreshToken) {
      console.log("→ Setting refreshed tokens in cookies");
      response.cookies.set("accessToken", tokenResult.newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 1 day
      });
      response.cookies.set("refreshToken", tokenResult.newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }
    
    return response;
  }

  // Apply i18n middleware for non-API routes
  console.log("→ Non-API route, applying i18n middleware");
  const intlResponse = intlMiddleware(req);

  // Check if intl middleware returned a redirect (for locale handling)
  if (intlResponse.status === 307 || intlResponse.status === 308) {
    console.log("→ REDIRECT: i18n locale redirect");
    console.log("=== PROXY DEBUG END ===\n");
    return intlResponse;
  }

  // Then apply auth middleware for protected routes
  const tokenResult = await getTokenFromCookies(req);
  console.log("→ Token result exists:", !!tokenResult);
  
  const token = tokenResult?.user;
  
  if (token) {
    console.log("→ Token roles:", token.roles);
    console.log("→ Token permissions:", token.permissions);
  }

  // Check if route requires authentication
  const requiresAuth = rules.some(rule => rule.path.test(pathname));
  console.log("→ Requires auth:", requiresAuth);

  if (requiresAuth && !token) {
    // Redirect to login with locale prefix
    const locale = pathname.split('/')[1];
    const isValidLocale = locales.includes(locale as "en" | "km");
    const loginUrl = isValidLocale 
      ? `/${locale}/login` 
      : `/${defaultLocale}/login`;
    console.log("→ REDIRECT: No token, redirecting to:", loginUrl);
    console.log("=== PROXY DEBUG END ===\n");
    return NextResponse.redirect(new URL(loginUrl, req.url));
  } 

  // Check permissions for protected routes
  if (token) {
    const roles = (token.roles as number[]) || [];
    const isSuperadmin = roles.includes(1);
    console.log("→ Is superadmin:", isSuperadmin);
    
    // Superadmin has access to all routes, skip permission checks
    if (isSuperadmin) {
      console.log("→ ALLOWED: Superadmin access");
      console.log("=== PROXY DEBUG END ===\n");
      
      const response = NextResponse.next();
      
      // If tokens were refreshed, set new cookies
      if (tokenResult?.needsRefresh && tokenResult.newAccessToken && tokenResult.newRefreshToken) {
        console.log("→ Setting refreshed tokens in cookies");
        response.cookies.set("accessToken", tokenResult.newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24, // 1 day
        });
        response.cookies.set("refreshToken", tokenResult.newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
      }
      
      return response;
    }

    // For non-superadmin users, check permissions
    for (const rule of rules) {
      if (rule.path.test(pathname)) {
        console.log("→ Checking rule:", rule.resource, rule.action);
        const permissions = (token.permissions as { resource: string; action: string }[]) || [];
        const hasAccess = permissions.some(
          (p) => p.resource === rule.resource && p.action === rule.action
        );
        console.log("→ Has access:", hasAccess);

        if (!hasAccess) {
          console.log("→ BLOCKED: Insufficient permissions");
          console.log("=== PROXY DEBUG END ===\n");
          return NextResponse.json(
            { message: "Forbidden: Not enough permissions" },
            { status: 403 }
          );
        }
      }
    }
  }

  console.log("→ ALLOWED: Route access granted");
  console.log("=== PROXY DEBUG END ===\n");
  
  const response = NextResponse.next();
  
  // If tokens were refreshed, set new cookies
  if (tokenResult?.needsRefresh && tokenResult.newAccessToken && tokenResult.newRefreshToken) {
    console.log("→ Setting refreshed tokens in cookies");
    response.cookies.set("accessToken", tokenResult.newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
    });
    response.cookies.set("refreshToken", tokenResult.newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }
  
  return response;
}

export default proxy;

export const config = {
  matcher: [
    // Protected routes with locale prefix
    "/(en|km)/admin/:path*",
    // API routes
    "/api/users/:path*",
    "/api/roles/:path*",
    // Enable next-intl for all non-API routes
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
