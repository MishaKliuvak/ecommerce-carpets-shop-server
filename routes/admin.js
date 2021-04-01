const express = require('express')
const router = express.Router()

const { authCheck, adminCheck } = require('../middlewares/auth')
const { orders, updateOrderStatus } = require('../controllers/admin')

router.get('/admin/orders', authCheck, adminCheck, orders)
router.put('/admin/order-status', authCheck, adminCheck, updateOrderStatus)

module.exports = router
