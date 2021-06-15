const router = require('express').Router()
const { Product } = require('../model/productSchema')

router.route('/product').get(async (req, res) => {
  const productList = await Product.find()
  res.send(productList)
})
router.route('/product').post((req, res) => {
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  })
  product
    .save()
    .then((createProduct) => {
      res.status(201).json(createProduct)
    })
    .catch((err) => {
      res.status(500).json({ error: err, success: false })
    })
})

module.exports = router
