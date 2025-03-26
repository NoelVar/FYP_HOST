// NOTE: IMPORTS ----------------------------------------------------------------------------------
const express = require('express')
const {
    loginUser,
    registerUser,
    getAllUsers,
    getSingleUser,
    getUserById,
    updateUser
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

// NOTE: GET SINGLE USER INFO BY ID
router.post('/single-user-id', getUserById)

// NOTE: UPDATE USER STATUS
router.patch('/update-status', updateUser)

module.exports = router

// END OF DOCUMENT --------------------------------------------------------------------------------