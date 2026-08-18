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
  const imageHash = require('image-hash')

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

  // Helper: compute perceptual hash for image file (returns hex string) if file exists
  function computeHash(filePath){
    return new Promise((resolve) => {
      if(!fs.existsSync(filePath)) return resolve(null)
      try{
        // 16 -> hash size; true -> hex format
        imageHash(filePath, 16, true, (err, data) => {
          if(err) return resolve(null)
          resolve(String(data))
        })
      }catch(e){
        return resolve(null)
      }
    })
  }

  function hexHammingDistance(h1, h2){
    if(!h1 || !h2 || h1.length !== h2.length) return 9999
    let dist = 0
    for(let i=0;i<h1.length;i++){
      const a = parseInt(h1[i],16)
      const b = parseInt(h2[i],16)
      const x = a ^ b
      // count bits in x (0-15)
      dist += ((x & 1) + ((x>>1)&1) + ((x>>2)&1) + ((x>>3)&1))
    }
    return dist
  }

  // Attempt face matching if both registered photo and captured photo are available
  let faceMatch = false
  if(userDoc.photo && photoPath){
    try{
      const regPath = path.join(process.cwd(),'public', userDoc.photo.replace(/^\/+/, ''))
      const capPath = path.join(process.cwd(),'public', photoPath.replace(/^\/+/, ''))
      const [h1, h2] = await Promise.all([computeHash(regPath), computeHash(capPath)])
      if(h1 && h2){
        const dist = hexHammingDistance(h1, h2)
        // threshold chosen conservatively; adjust as needed
        faceMatch = dist <= 10
      }
    }catch(e){
      // ignore failures and fall back to not matched
      faceMatch = false
    }
  }

  // If both location and face match, mark as auto-verified so supervisor action isn't required
  const autoVerified = locationVerified && faceMatch

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
    notes: notes || null,
    autoVerified: autoVerified,
    verifiedAt: autoVerified ? timestamp : null,
    verifiedBy: autoVerified ? 'SYSTEM' : null
  })
  await att.save()

  // populate student's user info for response
  const studentUser = await User.findById(student.user).lean()
  return NextResponse.json({ ok: true, locationVerified, faceMatch, autoVerified, attendance: { id: att._id, timestamp: att.timestamp, shiftName: att.shiftName }, student: { name: studentUser?.name || '', photo: studentUser?.photo || '' } })
}

