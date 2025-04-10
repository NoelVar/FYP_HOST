// BACKEND LOGIC FOR ROUTES
const recipeModel = require('../models/recipeModel.js')
const mongoose = require('mongoose')
const userModel = require('../models/userModel.js')

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

        // GETS RECIPE FROM DB
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
    const { title, prepTime, cookTime, servingSize, difficulty, origin, mealType, approvalStatus, email } = req.body;

    // NOTE: HANDLING UPLOADED IMAGE
    const image = req.file ? req.file.filename : null;

    // NOTE: PARSE INGREDIENT AND NUTRITIONAL INFO IF THEY ARE SENT AS A JSON STRING
    const prepInstructions = req.body.cookInstructions ? JSON.parse(req.body.prepInstructions) : [];
    const cookInstructions = req.body.cookInstructions ? JSON.parse(req.body.cookInstructions) : [];
    const ingredients = req.body.ingredients ? JSON.parse(req.body.ingredients) : [];
    const nutritionalInfo = req.body.nutrInfo ? JSON.parse(req.body.nutrInfo) : {};
    const variationOfRecipe = req.body.variation ? JSON.parse(req.body.variation) : {};
    
    // NOTE: ATTEMPTS TO CREATE RECIPE IN DB
    try {

        // NOTE: VALIDATES ID FORMAT TO CHECK IF USER EXISTS
        if (email === '') {
            return res.status(400).json({ error: 'Email cannot be empty' })
        }
    
        // GETS USER FROM DB
        const user = await userModel.findOne({ email })

        // NOTE: CHECKS IF USER EXISTS IN DB
        if (!user) {
            return res.status(404).json({ error: 'Couldn\'t find user.' })
        }

        // ADDS USER REFERENCE TO RECIPE
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
            approvalStatus,
            postedBy: user,
            variationOfRecipe
        });

        if(!recipe) {
            // NOTE: RETURNS ERROR IF COULDN'T CREATE RECIPE
            return res.status(409).json({ error: 'The request could not be completed due to a conflict with the current state of the resource.' })
        }

        // NOTE: CREATES RECIPE IF EVERYTHING IS OK
        return res.status(201).json(recipe);
    } catch (error) {
        // NOTE: RETURNS ERROR IF SOMETHING WENT WRONG
        console.log('Error occourd' + error)
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

        // GETS RECIPE FROM DB
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

    if (!status) {
        return res.status(400).json({error: 'Status cannot be empty. Please seclect a status.'})
    }

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
    const { email, content, timestamp } = req.body;
    const { id } = req.params;

    // NOTE: VALIDATES ID FORMAT TO CHECK IF RECIPE EXISTS
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'Invalid recipe ID.'})
    }

    // CHECKS IF CONTENT IS EMPTY
    if (content === '') {
        return res.status(400).json({ error: 'Field cannot be empty.' })
    }

    // CHECKS IF CONTENT IS BETWEEN CHARACTER REQUIREMENT
    if (content.length < 3 || content.length > 250) {
        return res.status(400).json({ error: 'Please make sure your comment is between 3 and 250 characters!' })
    }

    try {
        // NOTE: VALIDATES ID FORMAT TO CHECK IF USER EXISTS
        if (email === '') {
            return res.status(400).json({ error: 'Email cannot be empty' })
        }

        // GETS USER FROM DB
        const user = await userModel.findOne({ email })

        // NOTE: CHECKS IF USER EXISTS IN DB
        if (!user) {
            return res.status(404).json({ error: 'Couldn\'t find user.' })
        }

        // GETS RECIPE FROM DB
        const recipe = await recipeModel.findById(id);
        
        // NOTE: CHECKS IF RECIPE EXISTS IN DB
        if (!recipe) {
            return res.status(404).json({error: 'Couldn\'t find recipe.'})
        }

        // NOTE: ADDS A NEW COMMENT TO THE ALREADY ESTABLISHED ARRAY OF COMMENTS
        const addedComment = recipe.comments.push({
            user,
            content,
            timestamp
        });
        await recipe.save();

        // NOTE: CHECKS IF THE COMMENT HAS BEEN ADDED SUCCESSFULLY
        if (!addedComment) {
            return res.status(404).json({error: 'Couldn\'t add comment.'})
        }

        // NOTE: CREATES COMMENT IF EVERYTHING IS OK
        return res.status(201).json({ message: "Comment has been added!", comment: recipe.comments[addedComment-1]})
    } catch(err) {
        // NOTE: RETURNS ERROR IF SOMETHING WENT WRONG
        return res.status(500).json({ message: err.message })
    }
}

// NOTE: ADD RATING -------------------------------------------------------------------------------
const addRating = async (req, res) => {
    const { value, email } = req.body;
    const { id } = req.params;

    // NOTE: VALIDATES ID FORMAT TO CHECK IF RECIPE EXISTS
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'Invalid recipe ID.'})
    }

    // NOTE: CHECKS IF VALUE IS EMPTY
    if (!value) {
        return res.status(400).json({ error: 'Field cannot be empty.' })
    }

    try {
        // NOTE: VALIDATES ID FORMAT TO CHECK IF USER EXISTS
        if (email === '') {
            return res.status(400).json({ error: 'Email cannot be empty' })
        }

        // NOTE: ATTEMPTS TO FIND USER BY EMAIL ADDRESS
        const user = await userModel.findOne({ email })

        // NOTE: CHECKS IF USER EXISTS IN DB
        if (!user) {
            return res.status(404).json({ error: 'Couldn\'t find user.' })
        }

        const recipe = await recipeModel.findById(id);
        // NOTE: CHECKS IF RECIPE EXISTS IN DB
        if (!recipe) {
            return res.status(404).json({error: 'Couldn\'t find recipe.'})
        }

        var match = false
        // CHECKS IF USER HAS ALREADY RATED THE RECIPE
        recipe.rating.map((singleRating) => {
            if (singleRating.postedBy.toString() === user._id.toString()) {
                match = true
            }
        })

        // IF THE USER ALREADY HAS RATED THE RECIPE THE RATING WILL NOT BE ADDED
        if (match) {
            return res.json({ message: "You have already rated the recipe!" })
        }

        // CHECKING IF USER OWNS THE RECIPE
        var ownedRecipe = false
        if (recipe.postedBy.toString() === user._id.toString()) {
            ownedRecipe = true
        }

        // IF THE USER OWNS THE RECIPE THE RATING WILL NOT BE ADDED
        if (ownedRecipe) {
            return res.json({ message: "You cannot rate your own recipe!" })
        }

        // NOTE: ADDS A NEW RATING TO THE ALREADY ESTABLISHED ARRAY OF RATING
        recipe.rating.push({
            value,
            postedBy: user
        })
        await recipe.save();

        // NOTE: ADDS RATING IF EVERYTHING IS OK
        return res.status(201).json({ message: "Rating has been added!" })
    } catch(err) {
        // NOTE: RETURNS ERROR IF SOMETHING WENT WRONG
        return res.status(500).json({ message: err.message })
    }
}

// REMOVE RECIPE ----------------------------------------------------------------------------------
const deleteComment = async (req, res) => {
    const { commentID, email } = req.body;
    const { id } = req.params;

    // NOTE: VALIDATES ID FORMAT TO CHECK IF RECIPE EXISTS
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'Invalid recipe ID.'})
    }

    // NOTE: VALIDATES ID FORMAT TO CHECK IF RECIPE EXISTS
    if (!mongoose.Types.ObjectId.isValid(commentID)) {
        return res.status(400).json({error: 'Invalid comment ID.'})
    }

    try {
        // NOTE: VALIDATES ID FORMAT TO CHECK IF USER EXISTS
        if (email === '') {
            return res.status(400).json({ error: 'Email cannot be empty' })
        }

        // GETS USER FROM DB
        const user = await userModel.findOne({ email })

        // NOTE: CHECKS IF USER EXISTS IN DB
        if (!user) {
            return res.status(404).json({ error: 'Couldn\'t find user.' })
        }

        // GETS RECIPE FROM DB
        const recipe = await recipeModel.findById(id);
        
        // NOTE: CHECKS IF RECIPE EXISTS IN DB
        if (!recipe) {
            return res.status(404).json({error: 'Couldn\'t find recipe.'})
        }

        var commentToDelete = null

         // NOTE: FIND COMMENT AND REMOVES IT FROM COMMENTS OBJECT ARRAY
         recipe.comments.map((comment) => {
            if (comment._id.toString() === commentID.toString() && 
                comment.user.toString() === user._id.toString()) {
                    commentToDelete = comment
            }
        })

        if (!commentToDelete) {
            return res.status(404).json({error: "Selected comment cannot be found!"})
        }

        // REMOVING COMMENT
        const removeComment = await recipeModel.findByIdAndUpdate(
            id,
            {
                $pull: { "comments": {$in: [commentToDelete]} }
            }
        )

        if (!removeComment) {
            return res.status(404).json({error: "Comment cannot be deleted!"})
        }

        // NOTE: CREATES COMMENT IF EVERYTHING IS OK
        return res.status(201).json({ message: "Your comment has been deleted!", comment: commentToDelete })
    } catch(err) {
        // NOTE: RETURNS ERROR IF SOMETHING WENT WRONG
        return res.status(500).json({ message: err.message })
    }
}

// REMOVE COMMENT BY MOD / ADMIN ------------------------------------------------------------------
const removeUserComment = async (req, res) => {
    const { commentID, email } = req.body;
    const { id } = req.params;

    // NOTE: VALIDATES ID FORMAT TO CHECK IF RECIPE EXISTS
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'Invalid recipe ID.'})
    }

    // NOTE: VALIDATES ID FORMAT TO CHECK IF RECIPE EXISTS
    if (!mongoose.Types.ObjectId.isValid(commentID)) {
        return res.status(400).json({error: 'Invalid comment ID.'})
    }

    try {
        // NOTE: VALIDATES ID FORMAT TO CHECK IF USER EXISTS
        if (email === '') {
            return res.status(400).json({ error: 'Email cannot be empty' })
        }

        // GETS USER FROM DB
        const user = await userModel.findOne({ email })

        // NOTE: CHECKS IF USER EXISTS IN DB
        if (!user) {
            return res.status(404).json({ error: 'Couldn\'t find user.' })
        }

        if (!user.role === 'admin' || !user.role === 'moderator') {
            return res.status(403).json({ error: 'No permission to access the requested resource ' })
        }

        // GETS RECIPE FROM DB
        const recipe = await recipeModel.findById(id);
        
        // NOTE: CHECKS IF RECIPE EXISTS IN DB
        if (!recipe) {
            return res.status(404).json({error: 'Couldn\'t find recipe.'})
        }

        var commentToDelete = null

         // NOTE: FIND COMMENT AND REMOVES IT FROM COMMENTS OBJECT ARRAY
         recipe.comments.map((comment) => {
            if (comment._id.toString() === commentID.toString()) {
                    commentToDelete = comment
            }
        })

        if (!commentToDelete) {
            return res.status(404).json({error: "Selected comment cannot be found!"})
        }

        // REMOVING COMMENT
        const removeComment = await recipeModel.findByIdAndUpdate(
            id,
            {
                $pull: { "comments": {$in: [commentToDelete]} }
            }
        )

        if (!removeComment) {
            return res.status(404).json({error: "Comment cannot be deleted!"})
        }

        // NOTE: CREATES COMMENT IF EVERYTHING IS OK
        return res.status(201).json({ message: "The selected comment has been removed successfully!", comment: commentToDelete })
    } catch(err) {
        // NOTE: RETURNS ERROR IF SOMETHING WENT WRONG
        return res.status(500).json({ message: err.message })
    }
}

// NOTE: ACCESSING HIGHLIGHTED RECIPES ------------------------------------------------------------
const popularRecipe = async (req, res) => {
    try {
        // FETCHING ALL RECIPES
        const recipes = await recipeModel.find({})
        
        // NOTE: VALIDATES IF THE RECIPES EXIST IN DB
        if (!recipes) {
            return res.status(404).json({ error: 'No recipes found.' })
        }

        // CREATING VARIABLES/ARRAY FOR CALCULATIONS
        const popularRecipes = []
        var mostRated = recipes[0]
        var bestRated = recipes[0]
        var mostComments = recipes[0]
        var latestRecipe = recipes[0]

        // MAPPING ALL RECIPES
        recipes.map((recipe) => {
            var avarageRating = 0 
            var popularAvarage = 0
            var totalRating = 0
            var popularTotal = 0

            // CALCULATING TOTAL RATING ON RECIPE
            for (var i = 0; i < recipe.rating.length; i++) {
                totalRating += recipe.rating[i].value
            }
            // CALCULATING AVARAGE RATING ON RECIPE
            avarageRating = totalRating / recipe.rating.length

            // CALCULATING TOTAL RATING ON BEST RATED RECIPE
            for (var i = 0; i < bestRated.rating.length; i++) {
                popularTotal += bestRated.rating[i].value
            }
            // CALCULATING AVARAGE RATING ON BEST RATED RECIPE
            popularAvarage = popularTotal / bestRated.rating.length

            // CHECKING IF AVARAGE RECIPE RATING IS GREATER THAN THE BEST RATED ONE
            if (popularAvarage < avarageRating) {
                bestRated = recipe
            // MAKING SURE BEST RATED RECIPE WILL NOT STAY NAN FOR THE NEXT RECIPE
            } else if (isNaN(popularAvarage)) {
                bestRated = recipe
            }

            // IDENTIFYING THE MOST RATED RECIPE 
            if (mostRated.rating.length < recipe.rating.length) {
                mostRated = recipe
            } 

            // IDENTIFYING THE MOST COMMENTS ON RECIPE 
            if (mostComments.comments.length < recipe.comments.length) {
                mostComments = recipe
            } 

            // IDENTIFYING THE LATEST RECIPE
            if (recipe.approvalStatus !== 'denied' && recipe.variationOfRecipe.status !== true) {
                latestRecipe = recipe
            }

        })

        // ADDING RECIPES TO ARRAY
        popularRecipes.push(mostRated)
        popularRecipes.push(bestRated)
        popularRecipes.push(mostComments)
        popularRecipes.push(latestRecipe)

        // // NOTE: RETURNS RECIPES IF STATUS IS OK
        return res.status(200).json(popularRecipes)
    } catch (err) {
        return res.status(500).json({ error: err.message })
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
    addRating,
    deleteComment,
    removeUserComment,
    popularRecipe
}

// END OF DOCUMENT --------------------------------------------------------------------------------