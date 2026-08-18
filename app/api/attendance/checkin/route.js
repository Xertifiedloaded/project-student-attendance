import { NextResponse } from 'next/server'
import { connect } from '../../../../lib/mongo'
import { verify } from '../../../../lib/auth'
import fs from 'fs'
import path from 'path'
import geolib from 'geolib'

export async function POST(req){
  const token = req.cookies.get('token')?.value
  const user = verify(token)
  if(!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  await connect()
  const User = require('../../../../models/User')
  const Student = require('../../../../models/Student')
  const Farm = require('../../../../models/Farm')
  const Attendance = require('../../../../models/Attendance')

  const body = await req.json()
  const { shiftName, latitude, longitude, photoBase64, notes } = body
  if(!shiftName) return NextResponse.json({ error: 'Missing shift' }, { status: 400 })

  const userDoc = await User.findById(user.userId).lean()
  if(!userDoc) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const student = await Student.findOne({ user: userDoc._id }).lean()
  if(!student) return NextResponse.json({ error: 'Student record not found' }, { status: 404 })

  const farm = await Farm.findOne().lean()

  const timestamp = new Date()

  let photoPath = null
  if(photoBase64){
    const uploads = path.join(process.cwd(),'public','uploads')
    fs.mkdirSync(uploads, { recursive: true })
    const buffer = Buffer.from(photoBase64, 'base64')
    const filename = `${Date.now()}-${student.studentId}.jpg`
    fs.writeFileSync(path.join(uploads, filename), buffer)
    photoPath = `/uploads/${filename}`
  }

  let distance = null
  let locationVerified = false
  if(latitude && longitude && farm){
    distance = geolib.getDistance({ latitude, longitude }, { latitude: farm.latitude, longitude: farm.longitude })
    locationVerified = distance <= (farm.radius || 0)
  }

  const att = new Attendance({
    student: student._id,
    date: new Date().toISOString().split('T')[0],
    shiftName,
    status: locationVerified ? 'PRESENT' : 'NEEDS_REVIEW',
    timestamp,
    latitude: latitude || null,
    longitude: longitude || null,
    distance,
    photoPath,
    notes: notes || null
  })
  await att.save()

  // populate student's user info for response
  const studentUser = await User.findById(student.user).lean()
  return NextResponse.json({ ok: true, locationVerified, attendance: { id: att._id, timestamp: att.timestamp, shiftName: att.shiftName }, student: { name: studentUser?.name || '', photo: studentUser?.photo || '' } })
}

