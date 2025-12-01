/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { authController } from '../controllers/authController';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export function signAccessToken(payload: any) {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET!, { expiresIn: '1d' });
}

export function signRefreshToken(payload: any) {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET!, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string) {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET!);
    return decoded;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Token verification failed:", error);
    }
    let err: Error & { status?: number };
    if (error instanceof jwt.TokenExpiredError) {
      err = new Error("Token expired");
      err.status = 401;
      throw err;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      err = new Error("Invalid token");
      err.status = 401;
      throw err;
    }
    err = new Error("Token verification failed");
    err.status = 401;
    throw err;
  }
}

export function verifyRefreshToken(token: string) {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET!);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Refresh token verification failed:", error);
    }
    throw new Error("Invalid refresh token");
  }
}

export async function getTokenFromCookies(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;
    const refreshToken = req.cookies.get("refreshToken")?.value;

    console.log("→ AccessToken exists:", !!accessToken);
    console.log("→ RefreshToken exists:", !!refreshToken);

    // Try to verify the access token
    try {
      if (accessToken) {
        const decoded = verifyAccessToken(accessToken) as { id: number };
        console.log("→ Access token valid, user ID:", decoded.id);
        
        const userWithPermissions = await authController.getUserWithPermissions(decoded.id);
        
        if (!userWithPermissions) {
          console.log("→ User not found in database");
          return null;
        }
        
        return {
          user: userWithPermissions,
          needsRefresh: false,
        };
      }
    } catch (error) {
      console.log("→ Access token invalid/expired");
      
      // If access token is expired but refresh token exists, try to refresh
      if (error instanceof Error && error.message === "Token expired" && refreshToken) {
        console.log("→ Attempting token refresh...");
        
        try {
          const decoded = verifyRefreshToken(refreshToken) as { id: number };
          console.log("→ Refresh token valid, user ID:", decoded.id);
          
          const userWithPermissions = await authController.getUserWithPermissions(decoded.id);
          
          if (!userWithPermissions) {
            console.log("→ User not found in database");
            return null;
          }
          
          // Generate new tokens
          const newAccessToken = signAccessToken({ id: decoded.id });
          const newRefreshToken = signRefreshToken({ id: decoded.id });
          
          console.log("→ New tokens generated");
          
          return {
            user: userWithPermissions,
            needsRefresh: true,
            newAccessToken,
            newRefreshToken,
          };
        } catch (refreshError) {
          console.error("→ Refresh token invalid:", refreshError);
          return null;
        }
      }
      
      return null;
    }

    return null;
  } catch (error) {
    console.error("→ Token verification error:", error);
    return null;
  }
}