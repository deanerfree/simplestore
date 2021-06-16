const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  street: { type: String, default: '' },
  apartment: { type: String, default: '' },
  city: { type: String, default: '' },
  zip: { type: Number, default: 0 },
  country: { type: String, default: '' },
  phone: { type: String, default: '' },
  isAdmin: { type: Boolean, default: false },
})

//This bit of code will set _id to id
userSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

userSchema.set('toJSON', {
  virtuals: true,
})

exports.User = mongoose.model('User', userSchema)
exports.userSchema = userSchema
