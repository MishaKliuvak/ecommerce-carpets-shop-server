const express = require('express')
const router = express.Router()

const { authCheck } = require('../middlewares/auth')
const { userCart, getUserCart, emptyCart, saveAddress, applyCoupon, createOrder, orders } = require('../controllers/user')

router.post('/user/cart', authCheck, userCart)
router.post('/user/address', authCheck, saveAddress)
router.post('/user/cart/coupon', authCheck, applyCoupon)
router.post('/user/order', authCheck, createOrder)

router.get('/user/cart', authCheck, getUserCart)
router.get('/user/orders', authCheck, orders)

router.delete('/user/cart', authCheck, emptyCart)

module.exports = router
