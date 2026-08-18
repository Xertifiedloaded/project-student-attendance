import { NextResponse } from 'next/server'

function clearToken(res){
  res.cookies.set('token', '', { httpOnly: true, path: '/', sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 0 })
}

export async function GET(){
  const res = NextResponse.redirect('/login')
  clearToken(res)
  return res
}

export async function POST(){
  const res = NextResponse.json({ ok: true })
  clearToken(res)
  return res
}
