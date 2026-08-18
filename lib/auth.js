const jwt = require('jsonwebtoken')
const SECRET = process.env.NEXTAUTH_SECRET || 'dev-secret'

function sign(payload){
  return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}

function verify(token){
  try{
    return jwt.verify(token, SECRET)
  }catch(e){
    return null
  }
}

module.exports = { sign, verify }
