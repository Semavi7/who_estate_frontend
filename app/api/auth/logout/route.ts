import { NextResponse } from 'next/server'
import { serialize } from 'cookie'

export async function POST() {
  const serializedCookie = serialize('accessToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: -1, 
    path: '/',
  })

  return NextResponse.json({ message: 'Logged out' }, {
    status: 200,
    headers: {
      'Set-Cookie': serializedCookie,
    },
  })
}