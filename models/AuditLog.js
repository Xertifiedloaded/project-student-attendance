const mongoose = require('mongoose')
const { Schema } = mongoose

const AuditLogSchema = new Schema({
  whoId: Schema.Types.ObjectId,
  whoName: String,
  action: String,
  oldValue: Schema.Types.Mixed,
  newValue: Schema.Types.Mixed,
  reason: String,
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema)
