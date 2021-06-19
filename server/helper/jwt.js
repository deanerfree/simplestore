const expressJwt = require('express-jwt')

//We use the isRevoked to handle revoke cases so if someone isn't an admin they can't POST items
const authJwt = () => {
  const secret = process.env.TOKEN
  return expressJwt({
    secret,
    algorithms: ['HS256'],
    isRevoked: isRevoked,
  }).unless({
    path: [
      // { url: '/api/v1/products/*', methods: ['GET', 'OPTIONS'] },
      //We are using regular expressions because this will allow all requests under products to be excluded from needing a token
      // the(.*) allows to specify everything after the endpoint
      { url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
      '/api/v1/users/login',
      '/api/v1/users/register',
    ],
  })
}

const isRevoked = async (req, payload, done) => {
  if (!payload.isAdmin) {
    done(null, true)
  }
  done()
}

module.exports = authJwt
