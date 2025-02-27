// NOTE: IMPORTS ----------------------------------------------------------------------------------
const express = require('express')
const {
    loginUser,
    registerUser,
    logoutUser
} = require('../controllers/userController')

// NOTE: CREATING ROUTER COMPONENT
const router = express.Router()

// NOTE: LOG USER IN
router.post('/login', loginUser)

// NOTE: REGISTER USER
router.post('/register', registerUser)

// NOTE: LOG USER OUT

module.exports = router

// END OF DOCUMENT --------------------------------------------------------------------------------