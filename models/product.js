const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
    text: true
  },
  slug: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    index: true
  },
  description: {
    type: String,
    required: true,
    text: true
  },
  price: {
    type: Number,
    trim: true,
    required: true
  },
  category: {
    type: ObjectId,
    ref: 'Category',
    required: true
  },
  subs: [
    {
      type: ObjectId,
      ref: 'Sub',
      required: true
    }
  ],
  quantity: Number,
  sold: {
    type: Number,
    default: 0
  },
  images: {
    type: Array
  },
  shipping: {
    type: String,
    enum: ['Yes', 'No']
  },
  color: {
    type: String,
    enum: ['Black', 'White', 'Brown', 'Silver', 'Blue', 'Red']
  },
  brand: {
    type: String,
    enum: ['IKEA', 'Karat', 'AW', 'ITC', 'Ideal', 'Kartal', 'Looshchoow', 'Penny', 'Sanat', 'Киевгума', 'Лущув']
  },
  ratings: [
    {
      star: Number,
      postedBy: {
        type: ObjectId,
        ref: 'User'
      },
      text: {
        type: String,
        trim: true
      }
    }
  ]
}, { timestamps: true })

module.exports = mongoose.model('Product', productSchema)


