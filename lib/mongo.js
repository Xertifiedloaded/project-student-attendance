const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI

if(!MONGODB_URI){
  console.warn('MONGODB_URI not set. MongoDB connection will not be established. Set .env.local with your Atlas URI')
}

let cached = global._mongo
if(!cached) cached = global._mongo = { conn: null, promise: null }

async function connect(){
  if(cached.conn) return cached.conn
  if(!MONGODB_URI){
    console.warn('MONGODB_URI not set. Skipping connection.')
    return null
  }
  if(!cached.promise){
    cached.promise = mongoose.connect(MONGODB_URI).then(m=>m)
  }
  cached.conn = await cached.promise
  return cached.conn
}

module.exports = { connect, mongoose }
