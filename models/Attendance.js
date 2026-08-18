const mongoose = require('mongoose')
const { Schema } = mongoose

const AttendanceSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  date: Date,
  shiftName: String,
  status: { type: String, enum: ['PRESENT','LATE','ABSENT','EXCUSED','REJECTED','NEEDS_REVIEW'] },
  timestamp: Date,
  latitude: Number,
  longitude: Number,
  accuracy: Number,
  distance: Number,
  photoPath: String,
  notes: String,
  correctedBy: Schema.Types.ObjectId,
  correctedAt: Date
})

module.exports = mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema)
