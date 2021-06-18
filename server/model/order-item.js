const mongoose = require('mongoose')
//This table is imported in order.js
const orderItemSchema = new mongoose.Schema({
  quantity: { type: Number, required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
})

exports.OrderItem = mongoose.model('OrderItem', orderItemSchema)
