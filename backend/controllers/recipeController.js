// BACKEND LOGIC FOR ROUTES
const recipeModel = require('../models/recipeModel.js')
const mongoose = require('mongoose')

// GET ALL RECIPES --------------------------------------------------------------------------------
const getAllRecipes = async (req, res) => {
    // NOTE: FETCHES ALL RECIPES FROM DB
    // SORTS RECIPES BY CREATION DATE WITH THE MOST RECENT FIRST
    try {
        const recipes = await recipeModel.find({}).sort({ createdAt: -1 })
        
        // NOTE: VALIDATES IF THE RECIPES EXIST IN DB
        if (!recipes) {
            return res.status(404).json({ error: 'No recipes found.' })
        }

        // NOTE: RETURNS RECIPES IF STATUS IS OK
        return res.status(200).json(recipes)
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

// GET SINGLE RECIPE ------------------------------------------------------------------------------
const getSingleRecipe = async (req, res) => {
    const { id } = req.params
    try {
        // NOTE: VALIDATES ID FORMAT TO CHECK IF RECIPE EXISTS
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid recipe ID.' })
        }

        const recipe = await recipeModel.findById(id)
        
        // NOTE: CHECKS IF RECIPE EXISTS IN DB
        if (!recipe) {
            return res.status(404).json({ error: 'Couldn\'t find recipe.' })
        }

        // NOTE: RETURNS RECIPE IF STATUS IS OK
        return res.status(200).json(recipe)
    } catch (err) {
        // NOTE: RETURNS ERROR IF SOMETHING WENT WRONG
        return res.status(500).json({ error: err.message })
    }
}

// CREATE RECIPE ----------------------------------------------------------------------------------
const createRecipe = async (req, res) => {
    const { title, prepTime, cookTime, servingSize, difficulty, origin, mealType, approvalStatus } = req.body;
    
    // NOTE: HANDLING UPLOADED IMAGE
    const image = req.file ? req.file.filename : null;

    // NOTE: PARSE INGREDIENT AND NUTRITIONAL INFO IF THEY ARE SENT AS A JSON STRING
    const prepInstructions = req.body.cookInstructions ? JSON.parse(req.body.prepInstructions) : [];
    const cookInstructions = req.body.cookInstructions ? JSON.parse(req.body.cookInstructions) : [];
    const ingredients = req.body.ingredients ? JSON.parse(req.body.ingredients) : [];
    const nutritionalInfo = req.body.nutrInfo ? JSON.parse(req.body.nutrInfo) : {};
    
    // NOTE: ATTEMPTS TO CREATE RECIPE IN DB
    try {
        const recipe = await recipeModel.create({
            title,
            image,
            prepTime,
            cookTime,
            servingSize,
            difficulty,
            origin,
            mealType,
            prepInstructions,
            cookInstructions,
            ingredients,
            nutritionalInfo,
            approvalStatus
        });

        if(!recipe) {
            // NOTE: RETURNS ERROR IF COULDN'T CREATE RECIPE
            return res.status(409).json({ error: 'The request could not be completed due to a conflict with the current state of the resource.' })
        }

        // NOTE: CREATES RECIPE IF EVERYTHING IS OK
        return res.status(201).json(recipe);
    } catch (error) {
        // NOTE: RETURNS ERROR IF SOMETHING WENT WRONG
        console.log('Error occourd')
        return res.status(500).json({ error: error.message })
    }
}

// DELETE RECIPE ----------------------------------------------------------------------------------
const deleteRecipe = async (req, res) => {
    const {id} = req.params

    try {
        // NOTE: VALIDATES ID FORMAT TO CHECK IF RECIPE EXISTS
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({error: 'Invalid recipe ID.'})
        }

        const recipe = await recipeModel.findOneAndDelete({_id: id})
        
        // NOTE: CHECKS IF RECIPE EXISTS IN DB
        if (!recipe) {
            return res.status(404).json({error: 'Couldn\'t find recipe.'})
        }
        
        // NOTE: DELETES RECIPE IF STATUS IS OK
        return res.status(200).json(recipe)
    } catch(err) {
        // NOTE: CATCHES ERRORS AND RETURNS ERROR MESSAGE
        return res.status(500).json({ error: err.message })
    }
}

// UPDATE RECIPE ----------------------------------------------------------------------------------
const updateRecipe = async (req, res) => {
    const { id } = req.params
    const { status } = req.body
    
    try {
        // NOTE: VALIDATES ID FORMAT TO CHECK IF RECIPE EXISTS
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({error: 'Invalid recipe ID.'})
        }
        
        // SETTING 'approvalStatus' TO NEW STATUS USING ID
        const recipe = await recipeModel.findOneAndUpdate(
            {_id: id},
            {approvalStatus: status}, 
            {new: true})

        // NOTE: CHECKS IF RECIPE EXISTS IN DB
        if (!recipe) {
            return res.status(404).json({error: 'Couldn\'t find recipe.'})
        }

        // NOTE: UPDATES RECIPE IF STATUS IS OK
        return res.status(200).json(recipe)
    } catch(err) {
        // NOTE: RETURNS ERROR IF SOMETHING WENT WRONG
        return res.status(500).json({ error: err.message })
    }
}

// ADD COMMENTS -----------------------------------------------------------------------------------
// ADAPTED FROM: https://www.geeksforgeeks.org/implement-comments-section-in-mern-blogs-and-news-website/
const addComment = async (req, res) => {
    const { name, content, timestamp } = req.body;
    const { id } = req.params;

    // NOTE: VALIDATES ID FORMAT TO CHECK IF RECIPE EXISTS
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'Invalid recipe ID.'})
    }

    if (content === '') {
        return res.status(400).json({ error: 'Field cannot be empty.' })
    }

    try {
        const recipe = await recipeModel.findById(id);
        // NOTE: CHECKS IF RECIPE EXISTS IN DB
        if (!recipe) {
            return res.status(404).json({error: 'Couldn\'t find recipe.'})
        }

        // NOTE: ADDS A NEW COMMENT TO THE ALREADY ESTABLISHED ARRAY OF COMMENTS
        recipe.comments.push({
            name,
            content,
            timestamp
        });
        await recipe.save();

        // NOTE: CREATES COMMENT IF EVERYTHING IS OK
        return res.status(201).json({ message: "Comment has been added!" })
    } catch(err) {
        // NOTE: RETURNS ERROR IF SOMETHING WENT WRONG
        return res.status(500).json({ message: err.message })
    }
}

// NOTE: ADD RATING -------------------------------------------------------------------------------
const addRating = async (req, res) => {
    const { rating } = req.body;
    const { id } = req.params;

    // NOTE: VALIDATES ID FORMAT TO CHECK IF RECIPE EXISTS
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'Invalid recipe ID.'})
    }

    if (!rating) {
        return res.status(400).json({ error: 'Field cannot be empty.' })
    }

    try {
        const recipe = await recipeModel.findById(id);
        // NOTE: CHECKS IF RECIPE EXISTS IN DB
        if (!recipe) {
            return res.status(404).json({error: 'Couldn\'t find recipe.'})
        }

        // NOTE: ADDS A NEW RATING TO THE ALREADY ESTABLISHED ARRAY OF RATING
        recipe.rating.push(rating)
        await recipe.save();

        // NOTE: ADDS RATING IF EVERYTHING IS OK
        return res.status(201).json({ message: "Rating has been added!" })
    } catch(err) {
        // NOTE: RETURNS ERROR IF SOMETHING WENT WRONG
        return res.status(500).json({ message: err.message })
    }
}

// NOTE: EXPORTS FUNCTIONS ------------------------------------------------------------------------
module.exports = {
    getAllRecipes,
    getSingleRecipe,
    createRecipe,
    deleteRecipe,
    updateRecipe,
    addComment,
    addRating
}

// END OF DOCUMENT --------------------------------------------------------------------------------