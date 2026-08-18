import { NextResponse } from 'next/server'
import { connect } from '../../../../lib/mongo'
import bcrypt from 'bcryptjs'
import { sign } from '../../../../lib/auth'

export async function POST(req){
  const { email, password } = await req.json()
  if(!email || !password) return NextResponse.json({ error: 'Missing' }, { status: 400 })

  await connect()
  const User = require('../../../../models/User')
  const user = await User.findOne({ email }).lean()
  if(!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

  const ok = bcrypt.compareSync(password, user.password || '')
  if(!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

  const token = sign({ userId: user._id, role: user.role, name: user.name, email: user.email })
  const res = NextResponse.json({ ok: true })
  res.cookies.set('token', token, { httpOnly: true, path: '/' })
  return res
}
