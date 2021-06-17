const expressJwt = require('express-jwt')

const authJWT = () => {
  secret = process.env.TOKEN
  return expressJwt({ secret, algorithms: ['HS256'] })
}

module.exports = authJWT
