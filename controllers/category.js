const Category = require('../models/category')
const Sub = require('../models/sub')
const slugify = require('slugify')

exports.create = async (req, res) => {
    try {
      const { name } = req.body
      const category = await new Category({ name, slug: slugify(name).toLowerCase() }).save()

      res.json(category)
    } catch (err) {
      res.status(400).send('Create category failed: ' + err.message)
    }
}

exports.read = async (req, res) => {
  let category = await Category.findOne({ slug: req.params.slug }).exec()
  res.json(category)
}

exports.list = async (req, res) => {
  res.json(await Category.find({}).sort({ createdAt: -1 }).exec())
}

exports.update = async (req, res) => {
  const { name } = req.body
  try {
    const updated = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      { name, slug: slugify(name) },
      { new: true}
      ).exec()
    res.json(updated)
  } catch (err) {
    res.status(400).send("Update category failed" + err.message)
  }
}

exports.remove = async (req, res) => {
  try {
    const deleted = await Category.findOneAndDelete({ slug: req.params.slug })
    res.json(deleted)
  } catch (err) {
    res.code(400).send('Delete failed: ' + err.message)
  }
}

exports.getSubs = async (req, res) => {
  Sub.find({ parent: req.params._id }).exec((err, subs) => {
    if (err) console.log(err)
    res.json(subs)
  })
}
