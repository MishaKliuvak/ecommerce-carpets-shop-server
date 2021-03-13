const admin = require('../firebase/firebase')
const User = require('../models/user')

exports.authCheck = async (req, res, next) => {
    try {
        const firebaseUser = await admin
          .auth()
          .verifyIdToken(req.headers.authtoken)

        // console.log(firebaseUser)
        req.user = firebaseUser
    }
    catch (error) {
        res.statusCode(401).json({
            err: "Invalid or expired token"
        })
    }
    next()
}

exports.adminCheck = async (req,res,next) => {
    const { email } = req.user

    const adminUser = await User.findOne({ email }).exec()

    if (adminUser.role !== 'admin') {
        res.status(403).json({
            err: 'Admin resource. Access denied'
        })
    } else {
        next()
    }
}
