const mongoose = require('mongoose')
const { Schema } = mongoose

const ProjectSchema = new Schema({
  name: String,
  startDate: Date,
  endDate: Date,
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.models.Project || mongoose.model('Project', ProjectSchema)
