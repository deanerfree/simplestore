const router = require('express').Router()
const { User } = require('../model/userSchema')

router.post('/', async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: req.body.passwordHash,
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

module.exports = router
