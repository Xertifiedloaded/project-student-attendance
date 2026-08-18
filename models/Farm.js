const mongoose = require('mongoose')
const { Schema } = mongoose

const FarmSchema = new Schema({
  name: String,
  latitude: Number,
  longitude: Number,
  radius: Number,
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.models.Farm || mongoose.model('Farm', FarmSchema)
