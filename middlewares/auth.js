const admin = require('../firebase/firebase')

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
