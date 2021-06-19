const { Order } = require('../model/orderSchema')
const { OrderItem } = require('../model/order-item')
const router = require('express').Router()

//GET
//Get a list of orders
router.get('/', async (req, res) => {
  const orderList = await Order.find()
    .populate('user')
    .populate({
      path: 'orderItems',
      populate: { path: 'product', populate: 'category' },
    })

  if (!orderList) {
    res.status(500).json({ success: false })
  }
  res.send(orderList)
})

//GET
//Get a single order
router.get('/:id', async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user')
    .populate({
      path: 'orderItems',
      populate: { path: 'product', populate: 'category' },
    })

  if (!order) {
    res.status(500).json({ success: false })
  }
  res.send(order)
})

//POST
//Create a list of orders
router.post('/', async (req, res) => {
  const orderItemIds = Promise.all(
    req.body.orderItems.map(async (item) => {
      let newItem = new OrderItem({
        quantity: item.quantity,
        product: item.product,
      })
      newItem = await newItem.save()
      return newItem._id
    }),
  )
  const orderItemIdsResolved = await orderItemIds
  console.log(orderItemIdsResolved)
  //order cannot be a constant because you cannot assign new data to a constant but a let can be updated
  const totalPrices = await Promise.all(
    orderItemIdsResolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        'product',
        'price',
      )
      console.log(orderItem)
      const totalPrice = orderItem.product.price * orderItem.quantity
      return totalPrice
    }),
  )
  const totalPrice = totalPrices.reduce((a, b) => a + b, 0)

  let order = new Order({
    orderItems: orderItemIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
  })
  order = await order.save()

  if (!order) {
    res.status(400).send('The order cannot be created.')
  }
  res.send(order)
})

//Update
router.put('/:id', async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true },
  )

  if (!order) {
    return res.status(400).send('the order cannot be updated')
  }
  res.status(200).send(order)
})

//DELETE
//Delete ORDER
router.delete('/:id', async (req, res) => {
  const order = await Order.findById(req.params.id)
  try {
    if (order) {
      const removeOrderItems = async () => {
        await order.orderItems.map(async (orderItem) => {
          await OrderItem.findByIdAndRemove(orderItem)
        })
        await Order.findByIdAndRemove(req.params.id)
        return res
          .status(200)
          .json({ success: true, message: 'The order has been removed' })
      }
      removeOrderItems()
    }
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' })
    }
  } catch (err) {
    res.status(err.status).json({ success: false, message: err })
  }
})

router.get('/get/totalSales', async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalsales: { $sum: '$totalPrice' } } },
  ])
  try {
    if (!totalSales) {
      return res.status(400).send('The total sales is not found')
    }
    res.send({ totalSales: totalSales.pop().totalsales })
  } catch (err) {
    res.status(err.status).send({ err: err.message })
  }
})
router.get('/get/orderCount', async (req, res) => {
  const orderCount = await Order.countDocuments((count) => count)
  try {
    if (!orderCount) {
      return res.status(400).send('The total sales is not found')
    }
    res.send({ ordercount: orderCount })
  } catch (err) {
    res.status(err.status).send({ err: err.message })
  }
})

//GET
//Get a list of orders
router.get('/get/userOrders/:userid', async (req, res) => {
  const userOrderList = await Order.find({ user: req.params.userid })
    .populate({
      path: 'orderItems',
      populate: { path: 'product', populate: 'category' },
    })
    .sort({ date: -1 })

  if (!userOrderList) {
    res.status(500).json({ success: false })
  }
  res.send(userOrderList)
})

module.exports = router
