const mongoose = require('mongoose')
const { Schema } = mongoose

const StudentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  studentId: { type: String, unique: true, required: true },
  group: String,
  project: { type: Schema.Types.ObjectId, ref: 'Project' }
})

module.exports = mongoose.models.Student || mongoose.model('Student', StudentSchema)
