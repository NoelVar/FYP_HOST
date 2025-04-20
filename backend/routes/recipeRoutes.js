// NOTE: IMPORTS ----------------------------------------------------------------------------------
const express = require('express')
const {
    getAllRecipes,
    getSingleRecipe,
    createRecipe,
    deleteRecipe,
    updateOwnedRecipe,
    updateRecipeStatus,
    addComment,
    addRating,
    deleteComment,
    removeUserComment,
    popularRecipe
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

// NOTE: RETRIEVING MOST POPULAR RECIPE
router.get('/recipe/popular', popularRecipe)

// REQUIRE AUTHENTICATION FOR SPECIFIC RECIPE ROUTES
router.use(requireAuth)

// NOTE: POST NEW RECIPE
router.post('/', upload.single('file'), createRecipe)

// NOTE: DELETE RECIPE
router.delete('/:id', deleteRecipe)

// NOTE: UPDATE RECIPE STATUS
router.patch('/:id', updateRecipeStatus)

// NOTE: UPDATE OWNED RECIPE
router.patch('/:id/update', upload.single('file'), updateOwnedRecipe)

// NOTE: ADDING COMMENT
router.post('/:id/comments', addComment)

// NOTE: DELETING COMMENT
router.delete('/:id/comments', deleteComment)

// NOTE: DELETING COMMENT
router.delete('/:id/comments/moderate', removeUserComment)

// NOTE: ADDING RATING
router.post('/:id/rating', addRating)

// NOTE: EXPORTING ROUTER
module.exports = router

// END OF DOCUMENT --------------------------------------------------------------------------------