/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken';

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
