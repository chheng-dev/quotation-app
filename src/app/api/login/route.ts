import { NextRequest, NextResponse } from 'next/server'

import { authController } from '@/src/controllers/authController'
import { setAccessTokenCookie, setRefreshTokenCookie } from '@/src/lib/cookies'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 },
      )
    }

    const result = await authController.login(email, password)

    // Set cookies (await them)
    await setAccessTokenCookie(result.accessToken)
    await setRefreshTokenCookie(result.refreshToken)

    const data = {
      email: result.user.email,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    }

    return NextResponse.json(
      {
        message: 'Login successful',
        data,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: (error as Error).message || 'Login failed' },
      { status: 401 },
    )
  }
}
