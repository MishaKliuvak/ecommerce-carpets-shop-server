const express = require('express')
const router = express.Router()

const { authCheck } = require('../middlewares/auth')
const { userCart, getUserCart, emptyCart, saveAddress, applyCoupon } = require('../controllers/user')

router.post('/user/cart', authCheck, userCart)
router.post('/user/address', authCheck, saveAddress)
router.post('/user/cart/coupon', authCheck, applyCoupon)
router.get('/user/cart', authCheck, getUserCart)
router.delete('/user/cart', authCheck, emptyCart)

module.exports = router
