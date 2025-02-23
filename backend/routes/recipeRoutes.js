const express = require('express')
const {
    getAllRecipes,
    getSingleRecipe,
    createRecipe,
    deleteRecipe,
    updateRecipe
} = require('../controllers/recipeController')
const { upload } = require('../controllers/imageUpload')

const router = express.Router()

// NOTE: GET ALL RECIPES
router.get('/', getAllRecipes)

// NOTE: GET SINGLE RECIPE
router.get('/:id', getSingleRecipe)

// NOTE: POST NEW RECIPE
router.post('/', upload.single('file'), createRecipe)

// NOTE: DELETE RECIPE
router.delete('/:id', deleteRecipe)

// NOTE: UPDATE RECIPE
router.patch('/:id', updateRecipe)

module.exports = router