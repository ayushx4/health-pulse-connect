const jwt = require('jsonwebtoken')

function authenticateJwt (req, res, next){
  const authHeader = req.headers.authorization

  if(!authHeader || !authHeader.startsWith('Bearer '))
    return next()

  const token = authHeader.split(' ')[1]

  try{
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    req.user = decode
    return next()
  } catch(error){
    return res.status(403).json({ message: 'Token is invalid or expired' })
  }
}

module.exports = {
  authenticateJwt
}