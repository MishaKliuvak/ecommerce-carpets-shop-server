const express = require('express')
const router = express.Router()

const { authCheck, adminCheck } = require('../middlewares/auth')

const { create, listAll } = require('../controllers/product')

router.post('/product', authCheck, adminCheck, create)
router.get('/products/:count', listAll)



module.exports = router
