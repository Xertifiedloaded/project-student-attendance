const mongoose = require('mongoose')
const { Schema } = mongoose

const FieldSchema = new Schema({
  name: String,
  type: String,
  unit: String,
  required: Boolean,
  options: [String]
}, { _id: false })

const DataCollectionSessionSchema = new Schema({
  project: { type: Schema.Types.ObjectId, ref: 'Project' },
  date: Date,
  time: String,
  activity: String,
  fields: [FieldSchema]
})

module.exports = mongoose.models.DataCollectionSession || mongoose.model('DataCollectionSession', DataCollectionSessionSchema)
