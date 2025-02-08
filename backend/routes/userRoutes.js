const express = require('express')
const {
    getAllUsers,
    getSingleUser,
    createUser,
    deleteUser,
    updateUser
} = require('../controllers/userController')

const router = express.Router()

// NOTE: GET ALL USERS
router.get('/', getAllUsers)

// NOTE: GET SINGLE USER
router.get('/:id', getSingleUser)

// NOTE: POST NEW USER
router.post('/', createUser)

// NOTE: DELETE USER
router.delete('/:id', deleteUser)

// NOTE: UPDATE USER
router.patch('/:id', updateUser)

module.exports = router