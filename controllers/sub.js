const Sub = require('../models/sub')
const slugify = require('slugify')

exports.create = async (req, res) => {
  try {
    const { name, parent } = req.body
    const sub = await new Sub({ name, parent, slug: slugify(name).toLowerCase() }).save()

    res.json(sub)
  } catch (err) {
    res.status(400).send('Create sub failed: ' + err.message)
  }
}

exports.read = async (req, res) => {
  let sub = await Sub.findOne({ slug: req.params.slug }).exec()
  res.json(sub)
}

exports.list = async (req, res) => {
  res.json(await Sub.find({}).sort({ createdAt: -1 }).exec())
}

exports.update = async (req, res) => {
  const { name, parent } = req.body
  try {
    const updated = await Sub.findOneAndUpdate(
      { slug: req.params.slug },
      { name, parent, slug: slugify(name) },
      { new: true}
    ).exec()
    res.json(updated)
  } catch (err) {
    res.status(400).send("Update sub failed" + err.message)
  }
}

exports.remove = async (req, res) => {
  try {
    const deleted = await Sub.findOneAndDelete({ slug: req.params.slug })
    res.json(deleted)
  } catch (err) {
    res.code(400).send('Delete failed: ' + err.message)
  }
}
