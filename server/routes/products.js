const router = require('express').Router()
const { Category } = require('../model/category')
const { Product } = require('../model/productSchema')

router.route('/').get(async (req, res) => {
  const productList = await Product.find()
  res.send(productList)
})
router.route('/').post(async (req, res) => {
  const category = await Category.findById(req.body.category)
  if (!category) return res.status(400).send('Invalid Category')

  const product = await new Product({
    name: req.body.name,
    image: req.body.image,
    description: req.body.description,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.countInStock,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  })
  product = await product.save()

  if (!product) {
    return res.status(500).send('Product is not found')
  }
  res.send(product)
})

module.exports = router
