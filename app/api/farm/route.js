import { NextResponse } from 'next/server'
import { connect } from '../../../lib/mongo'

export async function GET(){
  await connect()
  const Farm = require('../../../models/Farm')
  const farm = await Farm.findOne().lean()
  if(!farm) return NextResponse.json({ error: 'No farm configured' }, { status: 404 })
  return NextResponse.json({ farm: { name: farm.name, latitude: farm.latitude, longitude: farm.longitude, radius: farm.radius } })
}
