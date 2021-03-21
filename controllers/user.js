const User = require('../models/user')
const Product = require('../models/product')
const Cart = require('../models/cart')

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
