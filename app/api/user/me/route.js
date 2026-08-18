import { NextResponse } from 'next/server'
import { verify } from '../../../../lib/auth'
import { connect } from '../../../../lib/mongo'

export async function GET(req){
  const token = req.cookies.get('token')?.value
  const payload = verify(token)
  if(!payload) return NextResponse.json({ ok: false, error: 'Not authenticated' }, { status: 401 })
  await connect()
  const User = require('../../../../models/User')
  const user = await User.findById(payload.userId).lean()
  if(!user) return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 })
  return NextResponse.json({ ok: true, user: { name: user.name, email: user.email, role: user.role, photo: user.photo } })
}
