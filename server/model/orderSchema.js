const mongoose = require('mongoose')

//Need to setup a relation between orders and order items
//ref: 'OrderItem' is a table
//Whats different from the category seen in products is that we can have more than one orderItem
const orderSchema = mongoose.Schema({
  orderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrderItem',
      required: true,
    },
  ],
  shippingAddress1: { type: String, required: true },
  shippingAddress2: { type: String },
  city: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, required: true, default: 'Pending' },
  totalPrice: { type: Number },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now },
})
orderSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

orderSchema.set('toJSON', {
  virtuals: true,
})
exports.Order = mongoose.model('Order', orderSchema)
