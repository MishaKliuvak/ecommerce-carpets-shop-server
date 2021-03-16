const Product = require('../models/product');
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