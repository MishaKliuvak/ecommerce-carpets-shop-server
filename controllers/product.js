const Product = require('../models/product')
const User = require('../models/user')
const slugify = require('slugify')

exports.create = async (req, res) => {
  try {
    console.log(req.body)
    req.body.slug = slugify(req.body.title)
    const newProduct = await new Product(req.body).save()

    res.json(newProduct)
  } catch (err) {
    //res.status(400).send('Create product failed: ' + err.message)
    res.status(400).json({
      err: err.message
    })
  }
}

exports.listAll = async (req, res) => {
  let products = await Product.find({})
    .limit(parseInt(req.params.count))
    .populate('category')
    .populate('subs')
    .sort([['createdAt', 'desc']])
    .exec()
  res.json(products)
}

exports.remove = async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndRemove({ slug: req.params.slug }).exec()

    res.json(deletedProduct)
  } catch (err) {
    console.log(err)
    return res.status(400).message('Product delete failed')
  }
}

exports.read = async (req, res) => {
  let product = await Product.findOne({ slug: req.params.slug })
    .populate('category')
    .populate('subs')
    .exec()
  res.json(product)
}

exports.update = async (req, res) => {
  try {
    if (req.body.title) req.body.slug = slugify(req.body.title)

    const updated = await Product.findOneAndUpdate(
      { slug: req.params.slug }, req.body, { new: true }).exec()

    res.json(updated)
  } catch (err) {
    console.log(err)
    res.status(400).json({
      err: err.message
    })
  }
}

exports.list = async (req, res) => {
  try {
    const { sort, order, page } = req.body

    const currentPage = page || 1
    const perPage = 3

    const products = await Product.find({ })
      .skip((currentPage - 1) * perPage)
      .populate('category')
      .populate('subs')
      .sort([[sort, order]])
      .limit(perPage)
      .exec()

    res.json(products)
  } catch (err) {
    console.log(err)
    res.status(400).json({
      err: err.message
    })
  }
}

exports.productsCount = async (req, res) => {
  let total = await Product.find({}).estimatedDocumentCount().exec()
  res.json(total)
}

exports.updateRating = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec()
  const user = await User.findOne({ email: req.user.email }).exec()

  const { star } = req.body

  let existingRatingObj = product.ratings.find((item) => item.postedBy.toString() === user._id.toString())

  if (existingRatingObj === undefined) {
    let ratingAdded = await Product.findByIdAndUpdate(product._id, {
      $push: { ratings: { star, postedBy: user._id } }
    }, { new: true }).exec()
    console.log(ratingAdded)

    res.json(ratingAdded)
  } else {
    const ratingUpdated = await Product.updateOne(
      { ratings: { $elemMatch: existingRatingObj } },
      { $set: { "ratings.$.star": star } },
      { new: true}
    ).exec()

    console.log(ratingUpdated)
    res.json(ratingUpdated)
  }
}

exports.listRelated = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec()

  const related = await Product.find({ _id: { $ne: product._id }, category: product.category })
    .limit(3)
    .populate('category')
    .populate('subs')
    .populate('postedBy')
    .exec()

  res.json(related)
}

