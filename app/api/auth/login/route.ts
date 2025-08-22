import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(req: NextRequest) {
    const token = req.cookies.get('accessToken')?.value

    if(!token) {
        return NextResponse.json({ user: null }, { status: 401 })
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET!)
        return  NextResponse.json({ status: 200 })
        
    } catch {
        return NextResponse.json({ user: null }, { status: 401 })
    }
}