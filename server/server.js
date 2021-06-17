const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv/config')
app.use(cors())
const port = process.env.PORT
const api = process.env.API_URL
const authJwt = require('./helper/jwt')
const errHandler = require('./helper/errHandler')
//routes
const productRoutes = require('./routes/products')
const categories = require('./routes/categories')
const userRoutes = require('./routes/users')

//Middleware
app.use(express.json())
app.options('*', cors())
//morgan is used to log the requests
app.use(morgan('tiny'))
app.use(authJwt())
app.use(errHandler)
//option * permits requests to the entire server otherwise set routes for specific
app.use(`${api}/products`, productRoutes)
app.use(`${api}/categories`, categories)
app.use(`${api}/users`, userRoutes)
//Connect to DB
//useFindAndModify set to false due to depreciation when using findById
mongoose
  .connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    dbName: 'simpleshop',
  })
  .then(() => console.log('Connected to DB'))
  .catch((err) => {
    console.error(err)
  })

//Set server
app.listen(port, console.log(`Listening on ${port}`))
