const { Order } = require('../model/orderSchema')
const router = require('express').Router()

router.get('/', async (req, res) => {
  const orderList = await Order.find()

  if (!orderList) {
    res.status(500).json({ success: false })
  }
  res.send(orderList)
})

router.post('/', async (req, res) => {
  const order = new Order({
    orderItems: req.body.orderItems,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: req.body.totalPrice,
    userId: req.body.user,
  })
  order = await order.save()
})
