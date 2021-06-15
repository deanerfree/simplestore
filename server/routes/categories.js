const { Category } = require('../model/category')
const router = require('express').Router()

router.get('/categories', async (req, res) => {
  const categoryList = await Category.find()

  if (!categoryList) {
    res.status(500).json({ success: false })
  }
  res.status(201).send(categoryList)
})

router.post('/categories', async (req, res) => {
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

router.delete('/categories/:id', async (req, res) => {
  let category = await Category.findByIdAndRemove(req.params.id)

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
