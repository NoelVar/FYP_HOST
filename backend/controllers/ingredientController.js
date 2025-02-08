// BACKEND LOGIC FOR ROUTES
const ingredientModel = require('../models/ingredientModel.js')
const mongoose = require('mongoose')

// GET ALL INGREDIENTS ----------------------------------------------------------------------------
const getAllIngredients = async (req, res) => {
    // NOTE: FETCHES ALL INGREDIENTS FROM DB
    const ingredients = await ingredientModel.find({})
    
    // NOTE: RETURNS INGREDIENT IF STATUS IS OK
    res.status(200).json(ingredients)
}

// GET SINGLE INGREDIENT --------------------------------------------------------------------------
const getSingleIngredient = async (req, res) => {
    const { id } = req.params

    // NOTE: VALIDATES ID FORMAT TO CHECK IF RECIPE EXISTS
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such ingredient exists'})
    }

    const ingredient = await recipeModel.findById(id)
    
    // NOTE: CHECKS IF INGREDIENT EXISTS IN DB
    if (!ingredient) {
        return res.status(400).json({error: 'No ingredient found'})
    }

    // NOTE: RETURNS INGREDIENT IF STATUS IS OK
    res.status(200).json(ingredient)
}

// CREATE INGREDIENT ------------------------------------------------------------------------------
const createIngredient = async (req, res) => {
    const {name, description} = req.body
    
    // NOTE: ATTEMPTS TO CREATE INGREDIENT IN DB
    try {
        const ingredient = await ingredientModel.create({name, description})
        res.status(200).json(ingredient)
    } catch (error) {
        // NOTE: CATCHES ERRORS AND RETURNS ERROR MESSAGE
        res.status(400).json({error: error.message})
    }
}

// DELETE INGREDIENT ------------------------------------------------------------------------------
const deleteIngredient = async (req, res) => {
    const {id} = req.params

    // NOTE: VALIDATES ID FORMAT TO CHECK IF INGREDIENT EXISTS
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such ingredient exists'})
    }

    const ingredient = await ingredientModel.findOneAndDelete({_id: id})
    
    // NOTE: CHECKS IF INGREDIENT EXISTS IN DB
    if (!ingredient) {
        return res.status(400).json({error: 'No ingredient found'})
    }
    
    // NOTE: DELETES INGREDIENT IF STATUS IS OK
    res.status(200).json(ingredient)
}

// UPDATE INGREDIENT ------------------------------------------------------------------------------
const updateIngredient = async (req, res) => {
    const {id} = req.params

    // NOTE: VALIDATES ID FORMAT TO CHECK IF INGREDIENT EXISTS
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such ingredient exists'})
    }

    const ingredient = await ingredientModel.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    // NOTE: CHECKS IF INGREDIENT EXISTS IN DB
    if (!ingredient) {
        return res.status(400).json({error: 'No ingredient found'})
    }

    // NOTE: UPDATES INGREDIENT IF STATUS IS OK
    res.status(200).json(ingredient)
}

module.exports = {
    getAllIngredients,
    getSingleIngredient,
    createIngredient,
    deleteIngredient,
    updateIngredient
}