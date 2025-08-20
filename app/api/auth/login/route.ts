import { NextResponse } from 'next/server'
import { serialize } from 'cookie'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { accessToken, user } = body

    if (!accessToken || !user) {
      return NextResponse.json({ message: 'Access token and user are required' }, { status: 400 })
    }

    
    const serializedCookie = serialize('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 60 * 60, 
      path: '/'
    });

    
    return NextResponse.json({ user }, {
      status: 200,
      headers: {
        'Set-Cookie': serializedCookie,
      },
    });

  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}