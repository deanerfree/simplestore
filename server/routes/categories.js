const { Category } = require('../model/category')
const router = require('express').Router()

//Get all categories
router.get('/', async (req, res) => {
  const categoryList = await Category.find()

  if (!categoryList) {
    res.status(500).json({ success: false })
  }
  res.status(201).send(categoryList)
})
//Get category by ID
router.get('/:id', async (req, res) => {
  const categoryId = await Category.findById(req.params.id)
  try {
    if (categoryId) {
      res.status(200).send(categoryId)
    }
    if (!categoryId) {
      res.status(500).send({ message: 'Catogory not found' })
    }
  } catch (err) {
    res.status(500).send((err) => {
      console.error(err)
    })
  }
})

//Create new category
router.post('/', async (req, res) => {
  const category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  })
  await category.save()
  if (!category) {
    return res.status(404).send('The category cannot be created')
  }
  try {
    res.status(201).send(category)
  } catch (err) {
    res.status(500).send((err) => {
      console.error(err)
    })
  }
})

//Update category

router.put('/:id', async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    },
    { new: true },
  )

  if (!category) {
    return res.status(400).send('the category cannot be updated')
  }
  res.status(200).send('the category has been updated')
})
//Delete category
router.delete('/:id', async (req, res) => {
  const category = await Category.findByIdAndRemove(req.params.id)

  try {
    if (category) {
      res.status(200).json({ success: true, message: 'Category deleted' })
    }
    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found' })
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err })
  }
})
module.exports = router
