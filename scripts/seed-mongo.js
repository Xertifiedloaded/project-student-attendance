require('dotenv').config({ path: '.env.local' })

const { connect } = require('../lib/mongo')
const User = require('../models/User')
const Student = require('../models/Student')
const Farm = require('../models/Farm')
const Project = require('../models/Project')
const Shift = require('../models/Shift')
const bcrypt = require('bcryptjs')

async function seed() {
  console.log('Checking MongoDB configuration...')

  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is not set.')
    console.error('Create a .env.local file in the project root with:')
    console.error('MONGODB_URI="your-mongodb-connection-string"')
    process.exit(1)
  }

  console.log('✓ MONGODB_URI found')

  const conn = await connect()

  if (!conn) {
    console.error('❌ Could not connect to MongoDB.')
    process.exit(1)
  }

  console.log('✓ MongoDB connected')
  console.log('Seeding MongoDB...')

  // Clear existing seed collections
  await Promise.all([
    User.deleteMany({}),
    Student.deleteMany({}),
    Farm.deleteMany({}),
    Project.deleteMany({}),
    Shift.deleteMany({}),
  ])

  // Create farm
  const farm = await Farm.create({
    name: 'University Farm',

    // Replace these with the actual farm coordinates
    latitude: 0.0,
    longitude: 0.0,

    radius: 100,
  })

  console.log(`✓ Farm created: ${farm.name}`)

  // Create 10-week project
  const start = new Date()

  const weeks = 10

  const end = new Date(start)
  end.setDate(end.getDate() + weeks * 7 - 1)

  const project = await Project.create({
    name: 'Final Year Farm Practical',
    startDate: start,
    endDate: end,
  })

  console.log('✓ 10-week project created')

  // Create supervisor
  const supPass = await bcrypt.hash('supervisor', 10)

  const supervisor = await User.create({
    email: 'supervisor@example.com',
    name: 'PG Supervisor',
    role: 'SUPERVISOR',
    password: supPass,
  })

  console.log(`✓ Supervisor created: ${supervisor.email}`)

  // Create 10 students
  for (let i = 1; i <= 10; i++) {
    const num = String(i).padStart(2, '0')

    const hashed = await bcrypt.hash('password', 10)

    const user = await User.create({
      email: `student${num}@example.com`,
      name: `Student ${num}`,
      role: 'STUDENT',
      password: hashed,
    })

    await Student.create({
      user: user._id,
      studentId: `STU${num}`,
      group: 'A',
      project: project._id,
    })

    console.log(`✓ Student ${num} created`)
  }

  // Create Monday-Friday shifts
  for (let d = 1; d <= 5; d++) {
    await Shift.create({
      name: 'Morning',
      startTime: '08:00',
      endTime: '12:00',
      weekday: d,
    })

    await Shift.create({
      name: 'Evening',
      startTime: '16:00',
      endTime: '18:00',
      weekday: d,
    })
  }

  console.log('✓ Morning and evening shifts created')

  console.log('')
  console.log('=================================')
  console.log('        SEED COMPLETE')
  console.log('=================================')
  console.log('')
  console.log(`Project: ${project.name}`)
  console.log(`Duration: ${weeks} weeks`)
  console.log('Students: 10')
  console.log('Weekday shifts: Morning + Evening')
  console.log('')
  console.log('Supervisor login:')
  console.log('Email: supervisor@example.com')
  console.log('Password: supervisor')
  console.log('')
  console.log('Student login example:')
  console.log('Email: student01@example.com')
  console.log('Password: password')
  console.log('')

  process.exit(0)
}

seed().catch((error) => {
  console.error('')
  console.error('❌ Seed failed:')
  console.error(error)
  process.exit(1)
})