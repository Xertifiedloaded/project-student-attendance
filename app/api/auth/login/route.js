import { NextResponse } from 'next/server'
import { connect } from '../../../../lib/mongo'
import { sign } from '../../../../lib/auth'

export async function POST(req){
  const body = await req.json()
  const { email, password, photoBase64 } = body || {}
  if(!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 })

  const conn = await connect()
  if(!conn) return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  const User = require('../../../../models/User')
  let user = await User.findOne({ email })
  if(!user) return NextResponse.json({ error: 'No user with that email. Please register.' }, { status: 401 })

  if(photoBase64){
    try{
      const fs = require('fs')
      const path = require('path')
      const filename = `${Date.now()}-${(email).replace(/[^a-z0-9\\-_.@]/gi,'')}.jpg`
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
      if(!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
      const dest = path.join(uploadsDir, filename)
      const b = Buffer.from(photoBase64, 'base64')
      fs.writeFileSync(dest, b)
      user.photo = `/uploads/${filename}`
      await user.save()
    }catch(e){}
  }

  const token = sign({ userId: user._id, role: user.role, name: user.name, email: user.email })
  const res = NextResponse.json({ ok: true, role: user.role })
  // ensure cookie has sensible defaults for modern browsers
  res.cookies.set('token', token, { httpOnly: true, path: '/', sameSite: 'lax', secure: process.env.NODE_ENV === 'production' })
  return res
}
