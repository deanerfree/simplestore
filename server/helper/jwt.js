const expressJwt = require('express-jwt')

const authJwt = () => {
  const secret = process.env.TOKEN
  return expressJwt({ secret, algorithms: ['HS256'] }).unless({
    path: [
      // { url: '/api/v1/products/*', methods: ['GET', 'OPTIONS'] },
      //We are using regular expressions because this will allow all requests under products to be excluded from needing a token
      // the(.*) allows to specify everything after the endpoint
      { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
      '/api/v1/users/login',
      '/api/v1/users/register',
    ],
  })
}

module.exports = authJwt
