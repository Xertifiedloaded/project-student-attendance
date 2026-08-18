import { NextResponse } from 'next/server'
import { verify } from '../../../../lib/auth'

export async function GET(req){
  const token = req.cookies.get('token')?.value
  if(!token) return NextResponse.json({ user: null })
  const payload = verify(token)
  if(!payload) return NextResponse.json({ user: null })
  return NextResponse.json({ user: payload })
}
