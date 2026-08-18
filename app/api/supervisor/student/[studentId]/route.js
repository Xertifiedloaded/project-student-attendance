import { NextResponse } from 'next/server'
import { connect } from '../../../../lib/mongo'
import { verify } from '../../../../lib/auth'

export async function GET(req, { params }){
  const token = req.cookies.get('token')?.value
  const user = verify(token)
  if(!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  if(user.role !== 'SUPERVISOR') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  await connect()
  const Student = require('../../../../models/Student')
  const User = require('../../../../models/User')
  const Attendance = require('../../../../models/Attendance')

  const { studentId } = params || {}
  if(!studentId) return NextResponse.json({ error: 'Missing studentId' }, { status: 400 })

  const student = await Student.findOne({ studentId }).lean()
  if(!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 })

  const userDoc = await User.findById(student.user).lean()
  const lastAttendance = await Attendance.findOne({ student: student._id }).sort({ timestamp: -1 }).lean()

  return NextResponse.json({ ok: true, student: { studentId: student.studentId, name: userDoc?.name || '', photo: userDoc?.photo || '' }, lastAttendance })
}
