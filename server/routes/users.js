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

//GET
//Return only a certain amount of user based on the number wanted
router.get('/get/:count', async (req, res) => {
  count = req.params.count ? req.params.count : 0
  userCount = await User.countDocuments((count) => count)
  try {
    if (!userCount) {
      res.status(404).json({ success: false, message: 'user not found' })
    }
    res.send({ userCount: userCount })
  } catch (err) {
    res.status(err.status).json({ success: false, message: err })
  }
})

//POST
//Admin Create User
router.post('/', async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
  })
  await user.save()
  try {
    if (!user) {
      return res.status(500).send('User is not found')
    }
    res.status(200).send(user)
  } catch (err) {
    res.status(500).send((err) => {
      console.error(err)
    })
  }
})

//POST
//Create User
router.post('/register', async (req, res) => {
  const existingUser = await User.findOne({ email: req.body.email })

  try {
    if (existingUser) {
      return res.status(401).send('User already exists')
    }
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
    })
    await user.save()
    if (!user) {
      return res.status(500).send('User is not found')
    }
    res.status(200).send(user)
  } catch (err) {
    res.status(500).send((err) => {
      console.error(err)
    })
  }
})

//POST
//Log users in
router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  const secret = process.env.TOKEN
  try {
    if (!user) {
      return res.status(400).send('User is not found')
    }
    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
      const token = jwt.sign(
        {
          userId: user.id,
          isAdmin: user.isAdmin,
        },
        secret,
        { expiresIn: '1d' },
      )

      res.status(200).send({ user: user.email, token: token })
    } else {
      res.status(400).send('Invalid Password')
    }
  } catch (err) {
    res.status(500).send((err) => {
      console.error(err)
    })
  }
})

//PUT
//Update user
router.put('/:id', async (req, res) => {
  const userExist = await User.findById(req.params.id)
  let newPassword
  if (req.body.password) {
    newPassword = bcrypt.hashSync(req.body.password, 10)
  } else {
    newPassword = userExist.passwordHash
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      passwordHash: newPassword,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    },
    { new: true },
  )

  if (!user) return res.status(400).send('the user cannot be created!')

  res.send(user)
})

//DELETE
//Delete USER
router.delete('/:id', async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id)

  try {
    if (user) {
      res.status(200).json({ success: true, message: 'User deleted' })
    }
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' })
    }
  } catch (err) {
    res.status(err.status).json({ success: false, message: err })
  }
})
module.exports = router
