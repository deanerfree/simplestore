const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv/config')
const app = express()
const port = process.env.PORT
const api = process.env.API_URL
//routes
const productRoutes = require('./routes/products')
const categories = require('./routes/categories')

//Middleware
app.use(express.json())
//morgan is used to log the requests
app.use(morgan('tiny'))
app.use(cors())
//option * permits requests to the entire server otherwise set routes for specific
app.options('*', cors())
app.use(api, productRoutes)
app.use(api, categories)
//Connect to DB
mongoose
  .connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'simpleshop',
  })
  .then(() => console.log('Connected to DB'))
  .catch((err) => {
    console.error(err)
  })

//Set server
app.listen(port, console.log(`Listening on ${port}`))
