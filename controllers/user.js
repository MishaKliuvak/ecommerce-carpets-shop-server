const User = require('../models/user')
const Product = require('../models/product')
const Cart = require('../models/cart')
const Coupon = require('../models/coupon')
const Order = require('../models/order')

const uniqid = require('uniqid')

exports.userCart = async (req, res) => {
  const { cart } = req.body
  let products = []

  const user = await User.findOne({ email: req.user.email }).exec()
  let cartExistByThisUser = await Cart.findOne({ orderedBy: user._id }).exec()

  if (cartExistByThisUser) {
    await cartExistByThisUser.remove()
  }

  for (let i = 0; i < cart.length; i++) {
    let obj = {}

    obj.product = cart[i]._id
    obj.count = cart[i].count

    let { price } = await Product.findById( cart[i]._id).select('price').exec()
    obj.price = price

    products.push(obj)
  }

  let cartTotal = 0
  for (let i = 0; i < products.length; i++) {
    cartTotal = cartTotal + products[i].price * products[i].count
  }

  let newCart = await new Cart({
    products,
    cartTotal,
    orderedBy: user._id
  }).save()

  console.log(newCart)
  res.json({ ok: true })
}

exports.getUserCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec()

  let cart = await Cart.findOne({ orderedBy: user._id})
    .populate('products.product')
    .exec()

  const { products, cartTotal, totalAfterDiscount } = cart
  res.json({ products, cartTotal, totalAfterDiscount })
}

exports.emptyCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec()

  const cart = await Cart.findOneAndRemove({ orderedBy: user._id }).exec()
  res.json(cart)
}

exports.saveAddress = async (req, res) => {
  const userAddress = await User.findOneAndUpdate(
    { email: req.user.email },
    { address: req.body.address })
    .exec()

  res.json({ ok: 'true' })
}

exports.applyCoupon = async (req, res) => {
  const { coupon } = req.body

  console.log(coupon)
  const validCoupon = await Coupon.findOne({ name: coupon }).exec()
  if (validCoupon === null) {
    return res.json({
      err: 'Not found coupon'
    })
  }

  const user = await User.findOne({ email: req.user.email }).exec()
  let { products, cartTotal } = await Cart.findOne({ orderedBy: user._id})
    .populate('products.product', '_id title price')
    .exec()

  let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount / 100)).toFixed(2)

  await Cart.findOneAndUpdate({ orderedBy: user._id }, { totalAfterDiscount }, { new: true }).exec()

  res.json(totalAfterDiscount)
}

exports.createOrder = async (req, res) => {
  const { paymentIntent } = req.body.stripeResponse
  const user = await User.findOne({ email: req.user.email }).exec()

  let { products } = await Cart.findOne({ orderedBy: user._id }).exec()

  let newOrder = await new Order({
    products,
    paymentIntent,
    orderedBy: user._id
  }).save()

  let bulkOption = products.map(product => {
    return {
      updateOne: {
        filter: { _id: product.product._id },
        update: { $inc: { quantity: -product.count, sold: +product.count } }
      }
    }
  })

  let updated = await Product.bulkWrite(bulkOption, {})
  res.json({ ok: true })
}

exports.createCashOrder = async (req, res) => {
  const { COD, couponApplied } = req.body

  if (!COD) return res.status(400).send('Create cash order failed')

  const user = await User.findOne({ email: req.user.email }).exec()
  let userCart = await Cart.findOne({ orderedBy: user._id }).exec()

  let finalAmount = userCart.cartTotal * 100

  if (couponApplied && userCart.totalAfterDiscount)
    finalAmount = userCart.totalAfterDiscount * 100

  let newOrder = await new Order({
    products: userCart.products,
    paymentIntent: {
      id: uniqid(),
      amount: finalAmount,
      currency: 'usd',
      status: 'Cash on delivery',
      created: Date.now(),
      payment_method_types: ['cash']
    },
    orderedBy: user._id,
    orderStatus: 'Cash on delivery'
  }).save()

  let bulkOption = userCart.products.map(product => {
    return {
      updateOne: {
        filter: { _id: product.product._id },
        update: { $inc: { quantity: -product.count, sold: +product.count } }
      }
    }
  })

  let updated = await Product.bulkWrite(bulkOption, {})
  res.json({ ok: true })
}

exports.orders = async (req, res) => {
  let user = await User.findOne({ email: req.user.email }).exec()

  let userOrders = await Order.find({ orderedBy: user._id })
    .populate('products.product')
    .sort({ createdAt: -1 })
    .exec()

  res.json(userOrders)
}

exports.wishlist = async (req, res) => {
  const list = await User.findOne({ email: req.user.email })
                         .select("wishlist")
                         .populate("wishlist")
                         .exec();

  res.json(list);
}

exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.params
  const user = await User.findOneAndUpdate(
      { email: req.user.email },
      { $pull: { wishlist: productId } }).exec()

  res.json({ ok: true })
}

exports.addToWishlist = async (req, res) => {
  const { productId } = req.body

  const user = await User.findOneAndUpdate(
      { email: req.user.email },
      { $addToSet: {
          wishlist: productId
        }
      }).exec()

  res.json({ ok: true })
}
