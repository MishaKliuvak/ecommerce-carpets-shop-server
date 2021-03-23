const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId } = mongoose.Schema

const orderSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: ObjectId,
        ref: 'Product'
      },
      count: Number
    }
  ],
  paymentIntent: {},
  orderStatus: {
    type: String,
    default: 'Not processed',
    enum: [
      'Not processed',
      'Processing',
      'Dispatched',
      'Cancelled',
      'Completed'
    ]
  },
  orderedBy: {
    type: ObjectId,
    ref: 'User'
  }
}, { timestamps: true})

module.exports = mongoose.model('Order', orderSchema)
