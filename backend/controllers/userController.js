// BACKEND LOGIC FOR ROUTES
const userModel = require('../models/userModel')
const mongoose = require('mongoose')

// GET ALL USERS ----------------------------------------------------------------------------------
const getAllUsers = async (req, res) => {
    // NOTE: FETCHES ALL USERS FROM DB
    const users = await userModel.find({})
    
    // NOTE: RETURNS USERS IF STATUS IS OK
    res.status(200).json(users)
}

// GET SINGLE USER --------------------------------------------------------------------------------
const getSingleUser = async (req, res) => {
    const { id } = req.params

    // NOTE: VALIDATES ID FORMAT TO CHECK IF USER EXISTS
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such user exists'})
    }

    const user = await userModel.findById(id)
    
    // NOTE: CHECKS IF USER EXISTS IN DB
    if (!user) {
        return res.status(400).json({error: 'No user found'})
    }

    // NOTE: RETURNS USER IF STATUS IS OK
    res.status(200).json(user)
}

// CREATE USER ------------------------------------------------------------------------------------
const createUser = async (req, res) => {
    const {username, email, password, role} = req.body
    
    // NOTE: ATTEMPTS TO CREATE USER IN DB
    try {
        const user = await userModel.create({username, email, password, role})
        res.status(200).json(user)
    } catch (error) {
        // NOTE: CATCHES ERRORS AND RETURNS ERROR MESSAGE
        res.status(400).json({error: error.message})
    }
}

// DELETE USER ------------------------------------------------------------------------------------
const deleteUser = async (req, res) => {
    const {id} = req.params

    // NOTE: VALIDATES ID FORMAT TO CHECK IF USER EXISTS
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such user exists'})
    }

    const user = await userModel.findOneAndDelete({_id: id})
    
    // NOTE: CHECKS IF USER EXISTS IN DB
    if (!user) {
        return res.status(400).json({error: 'No user found'})
    }
    
    // NOTE: DELETES USER IF STATUS IS OK
    res.status(200).json(user)
}

// UPDATE USER ------------------------------------------------------------------------------------
const updateUser = async (req, res) => {
    const {id} = req.params

    // NOTE: VALIDATES ID FORMAT TO CHECK IF USER EXISTS
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such user exists'})
    }

    const user = await userModel.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    // NOTE: CHECKS IF USER EXISTS IN DB
    if (!user) {
        return res.status(400).json({error: 'No user found'})
    }

    // NOTE: UPDATES USER IF STATUS IS OK
    res.status(200).json(user)
}

module.exports = {
    getAllUsers,
    getSingleUser,
    createUser,
    deleteUser,
    updateUser
}