import { NextResponse } from 'next/server'
import { connect } from '../../../../lib/mongo'
import { verify } from '../../../../lib/auth'

export async function POST(req){
  const token = req.cookies.get('token')?.value
  const user = verify(token)
  if(!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  if(user.role !== 'SUPERVISOR') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  await connect()
  const Attendance = require('../../../../models/Attendance')

  const body = await req.json()
  const { attendanceId, action } = body || {}
  if(!attendanceId) return NextResponse.json({ error: 'Missing attendanceId' }, { status: 400 })

  const att = await Attendance.findById(attendanceId)
  if(!att) return NextResponse.json({ error: 'Attendance not found' }, { status: 404 })

  if(action === 'verify'){
    att.status = 'PRESENT'
  } else if(action === 'unverify'){
    att.status = 'NEEDS_REVIEW'
  }

  await att.save()
  return NextResponse.json({ ok: true, attendance: att })
}
