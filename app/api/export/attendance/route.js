import { NextResponse } from 'next/server'
import { connect } from '../../../../lib/mongo'
import { verify } from '../../../../lib/auth'
import ExcelJS from 'exceljs'

export async function GET(req){
  // require authenticated supervisor
  const token = req.cookies.get('token')?.value
  const user = verify(token)
  if(!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  if(user.role !== 'SUPERVISOR') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  await connect()
  const url = new URL(req.url)
  const scope = url.searchParams.get('scope') || 'current-week'
  const Project = require('../../../../models/Project')
  const Student = require('../../../../models/Student')
  const Attendance = require('../../../../models/Attendance')

  const project = await Project.findOne().sort({ createdAt: -1 }).lean()
  if(!project) return NextResponse.json({ error: 'No project configured' }, { status: 404 })

  // determine date range for current week
  const start = project.startDate
  const now = new Date()
  const daysSince = Math.floor((now - start) / (1000*60*60*24))
  const week = Math.floor(daysSince/7) + 1
  const weekStart = new Date(start)
  weekStart.setDate(weekStart.getDate() + (week-1)*7)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 7)

  // fetch students and attendance
  const students = await Student.find({ project: project._id }).populate('user').lean()
  const att = await Attendance.find({ date: { $gte: weekStart.toISOString().split('T')[0], $lt: weekEnd.toISOString().split('T')[0] } }).lean()

  const workbook = new ExcelJS.Workbook()
  const summarySheet = workbook.addWorksheet('Summary')
  summarySheet.addRow(['Project', project.name])
  summarySheet.addRow(['Week', week])
  summarySheet.addRow(['Students', students.length])
  summarySheet.addRow([])

  const details = workbook.addWorksheet('Detailed Attendance')
  details.addRow(['Date','Week','Day','Session','Student ID','Student Name','Session Type','Check-in Time','Status','Latitude','Longitude','Distance','Location Verified','Photo','Notes'])

  // populate rows
  for(const a of att){
    const s = students.find(x => String(x._id) === String(a.student))
    details.addRow([
      a.date,
      week,
      new Date(a.date).toLocaleDateString('en-GB', { weekday: 'short' }),
      a.shiftName,
      s?.studentId || '',
      s?.user?.name || '',
      a.shiftName,
      a.timestamp ? new Date(a.timestamp).toLocaleTimeString('en-GB') : '',
      a.status,
      a.latitude || '',
      a.longitude || '',
      a.distance || '',
      (a.status === 'PRESENT') ? 'Yes' : 'No',
      a.photoPath || '',
      a.notes || ''
    ])
  }

  const buf = await workbook.xlsx.writeBuffer()
  const res = new NextResponse(buf)
  res.headers.set('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.headers.set('Content-Disposition', `attachment; filename="attendance-week-${week}.xlsx"`)
  return res
}
