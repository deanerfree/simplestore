const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: {
    type: String,
    required: true,
  },
  richDescription: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  images: [
    {
      type: String,
      default: '',
    },
  ],
  brand: {
    type: String,
    default: '',
  },
  countInStock: { type: Number, required: true, min: 0, max: 255 },
  price: {
    type: Number,
    default: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
    required: true,
  },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
})

exports.Product = mongoose.model('Product', productSchema)
