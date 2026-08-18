const mongoose = require('mongoose')
const { Schema } = mongoose

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  name: String,
  role: { type: String, enum: ['SUPERVISOR','STUDENT'], default: 'STUDENT' },
  password: String,
  // optional captured face photo path (public/uploads/...)
  photo: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.models.User || mongoose.model('User', UserSchema)
