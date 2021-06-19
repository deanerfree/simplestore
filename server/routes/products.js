const router = require('express').Router()
const mongoose = require('mongoose')
const { Category } = require('../model/category')
const { Product } = require('../model/productSchema')
const multer = require('multer')

const FILE_TYPE_MAP = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = FILE_TYPE_MAP[file.mimetype]
    let uploadError = new Error('Invalid Image Type')
    if (isValid) {
      uploadError = null
    }
    cb(uploadError, 'public/uploads')
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.replace(' ', '-')
    const extension = FILE_TYPE_MAP[file.mimetype]
    cb(null, `${fileName}-${Date.now()}.${extension}`)
  },
})

const uploadOptions = multer({ storage: storage })
//Type GET
//Find all product names and images except the id in the DB
router.get('/', async (req, res) => {
  try {
    const productList = await Product.find()
    res.send(productList)
  } catch (err) {
    res.status(500).send((err) => {
      console.error(err)
    })
  }
})

//Type GET
//Find product by id in the DB we can also populate the category key and display more data

router.get('/:id', async (req, res) => {
  const productId = await Product.findById(req.params.id).populate('category')
  try {
    if (mongoose.isValidObjectId(req.params.id)) {
      res.status(400).send('Invalid ID')
    }
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
router.post('/', uploadOptions.single('image'), async (req, res) => {
  const category = await Category.findById(req.body.category)
  if (!category) return res.status(400).send('Invalid Category')

  const file = req.file
  if (!file) return res.status(400).send('No image found')
  const fileName = req.file.filename
  const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`

  const product = new Product({
    name: req.body.name,
    image: `${basePath}${fileName}`,
    description: req.body.description,
    richDescription: req.body.richDescription,
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

router.put('/:id', uploadOptions.single('image'), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send('Invalid Product ID')
  }
  try {
    const category = await Category.findById(req.body.category)
    if (!category) return res.status(400).send('Invalid Category')

    const product = await Product.findById(req.params.id)
    if (!product) return res.status(400).send('Invalid Product!')

    const file = req.file
    let imagePath
    console.log('This is req.file', file)
    console.log(product.image)
    if (file) {
      const fileName = req.file.filename
      const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
      imagepath = `${basePath}${fileName}`
    }
    if (!file || file === undefined) {
      imagepath = product.image
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      console.log('updating paramters'),
      req.params.id,
      {
        name: req.body.name,
        image: imagePath,
        description: req.body.description,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
      },
      { new: true },
      console.log('updating parameters'),
    )

    if (!updatedProduct) {
      return res.status(400).send('Product cannot be updated')
    }
    res.send(updatedProduct)
  } catch (err) {
    res.status(500).send((err) => {
      console.error(err)
    })
  }
})

//DELETE
//Delete product
router.delete('/:id', async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.id)

  try {
    if (product) {
      res.status(200).json({ success: true, message: 'Product deleted' })
    }
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' })
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err })
  }
})

//GET
//Request a count of all the items
router.get('/get/count', async (req, res) => {
  productCount = await Product.countDocuments((count) => count)
  try {
    if (!productCount) {
      res.status(404).json({ success: false, message: 'product not found' })
    }
    res.send({ productCount })
  } catch (err) {
    res.status(400).json({ success: false, message: err })
  }
})

//GET
//Return only a certain amount of products based on the number wanted
router.get('/get/featured/:count', async (req, res) => {
  count = req.params.count ? req.params.count : 0
  products = await Product.find({ isFeatured: true }).limit(+count)
  try {
    if (!products) {
      res.status(404).json({ success: false, message: 'product not found' })
    }
    res.send({ products })
  } catch (err) {
    res.status(400).json({ success: false, message: err })
  }
})

router.put(
  '/gallery-images/:id',
  uploadOptions.array('images', 10),
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid ID')
      }
      const files = req.files
      let imagesPath = []

      const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
      console.log('the file name', files)

      if (files) {
        files.map((file) => {
          imagesPath.push(`${basePath}${file.fileName}`)
        })
      }
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          images: imagesPath,
        },
        { new: true },
      )
      if (!updatedProduct) {
        return res.status(500).send('Product image not updated')
      }
      res.send(updatedProduct)
    } catch (err) {
      res.status(400).json({ success: false, message: err })
    }
  },
)

module.exports = router
