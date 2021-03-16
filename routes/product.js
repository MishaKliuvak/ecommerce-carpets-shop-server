const express = require('express')
const router = express.Router()

const { authCheck, adminCheck } = require('../middlewares/auth')

const { create, listAll, remove, read, update, list, productsCount } = require('../controllers/product')

router.post('/product', authCheck, adminCheck, create)
router.post('/products', list)

router.get('/products/total', productsCount)
router.get('/products/:count', listAll)
router.get('/product/:slug', read)

router.delete('/products/:slug', authCheck, adminCheck, remove)

router.put('/product/:slug', authCheck, adminCheck, update)

module.exports = router
