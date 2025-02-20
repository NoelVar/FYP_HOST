// FIXME:
const express = require('express')
const {
    getAllIngredients,
    getSingleIngredient,
    createIngredient,
    deleteIngredient,
    updateIngredient
} = require('../controllers/ingredientController')

const router = express.Router()

// NOTE: GET ALL INGREDIENTS
router.get('/', getAllIngredients)

// NOTE: GET SINGLE INGREDIENT
router.get('/:id', getSingleIngredient)

// NOTE: POST NEW INGREDIENT
router.post('/', createIngredient)

// NOTE: DELETE INGREDIENT
router.delete('/:id', deleteIngredient)

// NOTE: UPDATE INGREDIENT
router.patch('/:id', updateIngredient)

module.exports = router