// NOTE: IMPORTS ----------------------------------------------------------------------------------
const express = require('express')
const {
    getAllRecipes,
    getSingleRecipe,
    createRecipe,
    deleteRecipe,
    updateRecipe,
    addComment,
    addRating
} = require('../controllers/recipeController')
const { upload } = require('../controllers/imageUpload')
// IMPORTING MIDDLEWARE
const requireAuth = require('../middleware/requireAuth')

// NOTE: CREATING ROUTER COMPONENT
const router = express.Router()

// NOTE: GET ALL RECIPES
router.get('/', getAllRecipes)

// NOTE: GET SINGLE RECIPE
router.get('/:id', getSingleRecipe)

// REQUIRE AUTHENTICATION FOR SPECIFIC RECIPE ROUTES
router.use(requireAuth)

// NOTE: POST NEW RECIPE
router.post('/', upload.single('file'), createRecipe)

// NOTE: DELETE RECIPE
router.delete('/:id', deleteRecipe)

// NOTE: UPDATE RECIPE
router.patch('/:id', updateRecipe)

// NOTE: ADDING COMMENT
router.post('/:id/comments', addComment)

// NOTE: ADDING RATING
router.post('/:id/rating', addRating)

// NOTE: EXPORTING ROUTER
module.exports = router

// END OF DOCUMENT --------------------------------------------------------------------------------