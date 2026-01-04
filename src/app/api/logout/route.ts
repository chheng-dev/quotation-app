import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logout successful',
      },
      { status: 200 },
    )

    // Delete cookies
    response.cookies.delete('accessToken')
    response.cookies.delete('refreshToken')

    return response
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message: (error as Error).message || 'Logout failed',
      },
      { status: 500 },
    )
  }
}
