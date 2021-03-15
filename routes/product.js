const express = require('express')
const router = express.Router()

const { authCheck, adminCheck } = require('../middlewares/auth')

const { create, listAll, remove, read } = require('../controllers/product')

router.post('/product', authCheck, adminCheck, create)
router.get('/products/:count', listAll)

router.delete('/products/:slug', authCheck, adminCheck, remove)
router.get('/product/:slug', read)

module.exports = router
