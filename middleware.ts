// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'dev-secret')

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('token')?.value

  const isSupervisorPath = pathname.startsWith('/supervisor')
  const isStudentPath = pathname.startsWith('/student')

  if (!isSupervisorPath && !isStudentPath) return NextResponse.next()

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    const { payload } = await jwtVerify(token, secret)
    const role = payload.role as string

    // If role doesn't match the protected area, send back to login
    if (isSupervisorPath && role !== 'SUPERVISOR') {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    if (isStudentPath && role !== 'STUDENT') {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: ['/supervisor/:path*', '/student/:path*'],
}