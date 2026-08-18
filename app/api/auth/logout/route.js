import { NextResponse } from 'next/server'

export async function GET(){
  const res = NextResponse.redirect('/login')
  // Clear cookie
  res.cookies.set('token', '', { httpOnly: true, path: '/', maxAge: 0, sameSite: 'lax' })
  return res
}