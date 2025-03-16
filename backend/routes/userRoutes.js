// NOTE: IMPORTS ----------------------------------------------------------------------------------
const express = require('express')
const {
    loginUser,
    registerUser,
    getAllUsers,
    getSingleUser
} = require('../controllers/userController')

// NOTE: CREATING ROUTER COMPONENT
const router = express.Router()

// NOTE: LOG USER IN
router.post('/login', loginUser)

// NOTE: REGISTER USER
router.post('/register', registerUser)

// NOTE: GET ALL USERS
router.get('/all-users', getAllUsers)

// NOTE: GET SINGLE USER INFO
router.post('/single-user', getSingleUser)

module.exports = router

// END OF DOCUMENT --------------------------------------------------------------------------------