/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

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
    if (process.env.NODE_ENV === 'development') {
      console.error('Token verification failed:', error);
    }

    if (error instanceof jwt.TokenExpiredError) {
      const err = new Error('Token expired') as Error & { status?: number; code?: string };
      err.status = 401;
      err.code = 'TOKEN_EXPIRED';
      throw err;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      const err = new Error('Invalid token') as Error & { status?: number; code?: string };
      err.status = 401;
      err.code = 'TOKEN_INVALID';
      throw err;
    }
    const err = new Error('Token verification failed') as Error & {
      status?: number;
      code?: string;
    };
    err.status = 401;
    err.code = 'TOKEN_VERIFICATION_FAILED';
    throw err;
  }
}

export function verifyRefreshToken(token: string) {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET!);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Refresh token verification failed:', error);
    }

    if (error instanceof jwt.TokenExpiredError) {
      const err = new Error('Refresh token expired') as Error & { status?: number; code?: string };
      err.status = 401;
      err.code = 'REFRESH_TOKEN_EXPIRED';
      throw err;
    }

    const err = new Error('Invalid refresh token') as Error & { status?: number; code?: string };
    err.status = 401;
    err.code = 'REFRESH_TOKEN_INVALID';
    throw err;
  }
}

// Edge Runtime compatible version - just verifies tokens without DB access
export async function getTokenFromCookies(req: NextRequest) {
  try {
    const accessToken = req.cookies.get('accessToken')?.value;
    const refreshToken = req.cookies.get('refreshToken')?.value;

    // Try to verify the access token
    try {
      if (accessToken) {
        const decoded = verifyAccessToken(accessToken) as { id: number };

        return {
          userId: decoded.id,
          needsRefresh: false,
        };
      }
    } catch (error) {
      // If access token is expired but refresh token exists, try to refresh
      if (error instanceof Error && error.message === 'Token expired' && refreshToken) {
        try {
          const decoded = verifyRefreshToken(refreshToken) as { id: number };

          // Generate new tokens
          const newAccessToken = signAccessToken({ id: decoded.id });
          const newRefreshToken = signRefreshToken({ id: decoded.id });

          return {
            userId: decoded.id,
            needsRefresh: true,
            newAccessToken,
            newRefreshToken,
          };
        } catch (refreshError) {
          console.error('→ Refresh token invalid:', refreshError);
          return null;
        }
      }

      return null;
    }

    return null;
  } catch (error) {
    console.error('→ Token verification error:', error);
    return null;
  }
}
