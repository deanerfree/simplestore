const router = require('express').Router()
const { Category } = require('../model/category')
const { Product } = require('../model/productSchema')

//Type GET
//Find all product names and images except the id in the DB
router.get('/', async (req, res) => {
  const productList = await Product.find().select('name image -_id')
  res.send(productList)
})

//Type GET
//Find product by id in the DB

router.get('/:id', async (req, res) => {
  const productId = await Product.findById(req.params.id)
  try {
    if (productId) {
      res.status(200).send(productId)
    }
    if (!productId) {
      res.status(500).send({ message: 'Product not found' })
    }
  } catch (err) {
    res.status(500).send((err) => {
      console.error(err)
    })
  }
})

//Type POST
//create new product. Product is dependant on existing category found by id in DB
router.post('/', async (req, res) => {
  const category = await Category.findById(req.body.category)
  if (!category) return res.status(400).send('Invalid Category')

  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    description: req.body.description,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  })
  await product.save()
  try {
    if (!product) {
      return res.status(500).send('Product is not found')
    }
    res.status(200).send(product)
  } catch (err) {
    res.status(500).send((err) => {
      console.error(err)
    })
  }
})

module.exports = router
