import { NextResponse } from 'next/server'
import { connect } from '../../../../lib/mongo'
import fs from 'fs'
import path from 'path'

export async function POST(req){
  const body = await req.json()
  const { email, name, role, photoBase64 } = body || {}

  if(!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 })

  const conn = await connect()
  if(!conn) return NextResponse.json({ error: 'Database not configured' }, { status: 500 })

  const User = require('../../../../models/User')

  let user = await User.findOne({ email })
  if(user){
    // If already exists, don't error — return success. Update name/role/photo if provided.
    if(name) user.name = name
    if(role) user.role = role
    if(photoBase64){
      try{
        const filename = `${Date.now()}-${(email).replace(/[^a-z0-9\\-_.@]/gi,'')}.jpg`
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
        if(!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
        const dest = path.join(uploadsDir, filename)
        const b = Buffer.from(photoBase64, 'base64')
        fs.writeFileSync(dest, b)
        user.photo = `/uploads/${filename}`
      }catch(e){}
    }
    await user.save()
    return NextResponse.json({ ok: true, existing: true, role: user.role })
  }

  const newUser = new User({ email, name: name || '', role: role || 'STUDENT' })

  if(photoBase64){
    try{
      const filename = `${Date.now()}-${(email).replace(/[^a-z0-9\\-_.@]/gi,'')}.jpg`
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
      if(!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
      const dest = path.join(uploadsDir, filename)
      const b = Buffer.from(photoBase64, 'base64')
      fs.writeFileSync(dest, b)
      newUser.photo = `/uploads/${filename}`
    }catch(e){}
  }

  await newUser.save()
  return NextResponse.json({ ok: true, role: newUser.role })
}