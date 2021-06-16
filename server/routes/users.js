const router = require('express').Router()
const { User } = require('../model/userSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
//GET
//Get User
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash')
    res.send(users)
  } catch (err) {
    res.status(500).send((err) => {
      console.error(err)
    })
  }
})

router.get('/:id', async (req, res) => {
  const userId = await User.findById(req.params.id).select('-passwordHash')
  try {
    if (userId) {
      res.status(200).send(userId)
    }
    if (!userId) {
      res.status(500).send({ message: 'User not found' })
    }
  } catch (err) {
    res.status(500).send((err) => {
      console.error(err)
    })
  }
})

//POST
//Create User
router.post('/', async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    street: req.body.street,
    apartment: req.body.apartment,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
  })
  await user.save()
  try {
    if (!user) {
      return res.status(500).send('Product is not found')
    }
    res.status(200).send(user)
  } catch (err) {
    res.status(500).send((err) => {
      console.error(err)
    })
  }
})

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email })

  try {
    if (!user) {
      return res.status(400).send('User is not found')
    }
    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
      res.status(200).send('User Authenticated')
    } else {
      res.status(400).send('Invalid Password')
    }
  } catch (err) {
    res.status(500).send((err) => {
      console.error(err)
    })
  }
})
module.exports = router
