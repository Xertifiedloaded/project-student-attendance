const mongoose = require('mongoose')
const { Schema } = mongoose

const ShiftSchema = new Schema({
  name: String,
  startTime: String,
  endTime: String,
  weekday: Number
})

module.exports = mongoose.models.Shift || mongoose.model('Shift', ShiftSchema)
