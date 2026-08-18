import { NextResponse } from 'next/server'
import { connect } from '../../../../lib/mongo'

export async function GET(req){
  await connect()
  const Project = require('../../../../models/Project')
  const Student = require('../../../../models/Student')
  const Attendance = require('../../../../models/Attendance')

  // For simplicity, get current project (latest)
  const project = await Project.findOne().sort({ createdAt: -1 }).lean()
  if(!project) return NextResponse.json({ error: 'No project configured' }, { status: 404 })

  // Calculate current week number and expected sessions per week
  const start = project.startDate
  const now = new Date()
  const daysSince = Math.floor((now - start) / (1000*60*60*24))
  const week = Math.floor(daysSince/7) + 1

  const students = await Student.find({ project: project._id }).populate('user').lean()

  // Get attendance counts for current week (simple date range)
  const weekStart = new Date(start)
  weekStart.setDate(weekStart.getDate() + (week-1)*7)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 7)

  const att = await Attendance.find({ date: { $gte: weekStart.toISOString().split('T')[0], $lt: weekEnd.toISOString().split('T')[0] } }).lean()

  // summarize per student
  const summary = students.map(s => {
    const sAtt = att.filter(a => String(a.student) === String(s._id))
    const morning = sAtt.filter(a => a.shiftName === 'Morning')
    const evening = sAtt.filter(a => a.shiftName === 'Evening')
    const morningPresent = morning.filter(a => a.status === 'PRESENT').length
    const eveningPresent = evening.filter(a => a.status === 'PRESENT').length
    return {
      studentId: s.studentId,
      name: s.user?.name || '',
      morningPresent,
      eveningPresent,
      totalPresent: sAtt.filter(a => a.status === 'PRESENT').length
    }
  })

  return NextResponse.json({ project: { id: project._id, name: project.name, week }, students: summary })
}
