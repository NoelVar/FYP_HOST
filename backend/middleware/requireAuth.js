// ADAPTED FROM https://www.youtube.com/watch?v=MrEoixi8QY4&list=PL4cUxeGkcC9g8OhpOZxNdhXggFz2lOuCT&index=14
// NOTE: IMPORTS
const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')

// NOTE: 'requireAuth' MIDDLEWARE, NEXT IS USED TO INVOKE THE FOLLOWING MIDDLEWARE FUNCTION
const requireAuth = async (req, res, next) => {
    // VERIFY AUTHENTICATION
    const { authorization } = req.headers

    // CHECKING IF THE HEADER HAS BEEN SENT TO THE MIDDLEWARE
    if (!authorization) {
        return res.status(401).json({error: 'Authorization token required.'})
    }

    // SPLITTING 'Bearer token' TO ONLY GET TOKEN PART
    const token = authorization.split(' ')[1]

    // TRYING TO GET THE USER ID FROM THE TOKEN
    try {
        const { _id } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        req.user = await userModel.findOne({_id}).select('_id')
        next()

    } catch (err) {
        // console.log(err)
        res.status(401).json({error: 'Request is not authorized.'})
    }

}

module.exports = requireAuth