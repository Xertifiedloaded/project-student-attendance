const mongoose = require('mongoose')
const { Schema } = mongoose

const DataCollectionSubmissionSchema = new Schema({
  session: { type: Schema.Types.ObjectId, ref: 'DataCollectionSession' },
  student: { type: Schema.Types.ObjectId, ref: 'Student' },
  data: Schema.Types.Mixed,
  status: { type: String, enum: ['PENDING','IN_PROGRESS','SUBMITTED','VERIFIED','NEEDS_CORRECTION'], default: 'PENDING' },
  startedAt: Date,
  completedAt: Date,
  latitude: Number,
  longitude: Number,
  photoPath: String,
  notes: String
})

module.exports = mongoose.models.DataCollectionSubmission || mongoose.model('DataCollectionSubmission', DataCollectionSubmissionSchema)
