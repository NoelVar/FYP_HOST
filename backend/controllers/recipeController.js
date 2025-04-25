// BACKEND LOGIC FOR ROUTES
const recipeModel = require('../models/recipeModel.js')
const mongoose = require('mongoose')
const userModel = require('../models/userModel.js')
const { sendEmail } = require('../Utilities/SendingEmail.js')

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

    if (title === '' || prepTime === 0 || cookTime === 0 || servingSize === 0 || difficulty === '' || origin === '' || mealType === '') {
        return res.status(400).json({ error: "One or more required field was left empty." })
    }
    
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

        // SETTING THE EMAIL SUBJECT AND CONTENT
        const subject = 'You Have Successfully Created a Recipe !✅'
        const content = `
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5E9DF; color: #071320;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <img src="http://localhost:3000/ED2_LOGOV6.png" alt="EdibleEducation Logo" style="width: 150px; height: auto;"/>
                </div>
                
                <h1 style="color: #ff7800; text-align: center; margin-bottom: 20px;">Hello ${user.username}!</h1>
                
                <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: black;">
                        You have successfully created a new recipe! ⭐
                    </p>
                    
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: black;">
                        The created recipe needs to go through a validation process, which once is done it will be available on our platform!
                    </p>
                    
                    <p style="font-size: 14px; color: #666; text-align: center; margin-top: 20px;">
                        If you have any questions, feel free to reach out to our support team.
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #666;">
                    <p>© 2025 EdibleEducation. All rights reserved.</p>
                </div>
            </div>
        `

        // SENDING EMAIL SUBJECT AND CONTENT TO SEND EMAIL UTILITY FUNCTION
        sendEmail(user.email, subject, content)

        // NOTE: CREATES RECIPE IF EVERYTHING IS OK
        return res.status(201).json({recipe, message: "Recipe has been created successfully!"});
    } catch (error) {
        // NOTE: RETURNS ERROR IF SOMETHING WENT WRONG
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

        const user = await userModel.findById(recipe.postedBy)

        // ONLY SENDING EMAIL IF THE USER OWNS THE POST
        if (user) {
            // SETTING THE EMAIL SUBJECT AND CONTENT
            const subject = 'Your Recipe has been Deleted!❌'
            const content = `
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5E9DF; color: #071320;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <img src="http://localhost:3000/ED2_LOGOV6.png" alt="EdibleEducation Logo" style="width: 150px; height: auto;"/>
                    </div>
                    
                    <h1 style="color: #ff7800; text-align: center; margin-bottom: 20px;">Dear ${user.username}!</h1>
                    
                    <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: black;">
                            Your recipe has been deleted!
                        </p>
                        
                        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: black;">
                            The deletion of the recipe could be due to violating our Terms & Conditions, or you choose to delete it yourself.
                        </p>
                        
                        <p style="font-size: 14px; color: #666; text-align: center; margin-top: 20px;">
                            If this change has not been done by you or you feel like you have not violated our T&Cs please contact our support team.
                        </p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #666;">
                        <p>© 2025 EdibleEducation. All rights reserved.</p>
                    </div>
                </div>
            `

            // SENDING EMAIL SUBJECT AND CONTENT TO SEND EMAIL UTILITY FUNCTION
            sendEmail(user.email, subject, content)
        }
        
        // NOTE: DELETES RECIPE IF STATUS IS OK
        return res.status(200).json(recipe)
    } catch(err) {
        // NOTE: CATCHES ERRORS AND RETURNS ERROR MESSAGE
        return res.status(500).json({ error: err.message })
    }
}

// UPDATE OWNED RECIPE ----------------------------------------------------------------------------
const updateOwnedRecipe = async (req, res) => {
    const { id } = req.params
    
    try {
        // RETRIEVING DATA FIELDS FROM REQ BY ONE BY ONE
        const title = req.body.title;
        const prepTime = req.body.prepTime;
        const cookTime = req.body.cookTime;
        const servingSize = req.body.servingSize;
        const difficulty = req.body.difficulty;
        const origin = req.body.origin;
        const mealType = req.body.mealType;
        const email = req.body.email;

        // HANDLING IMAGE
        const image = req.file ? req.file.filename : null;

        // NOTE: PARSE INGREDIENT AND NUTRITIONAL INFO IF THEY ARE SENT AS A JSON STRING
        const prepInstructions = req.body.cookInstructions ? JSON.parse(req.body.prepInstructions) : [];
        const cookInstructions = req.body.cookInstructions ? JSON.parse(req.body.cookInstructions) : [];
        const ingredients = req.body.ingredients ? JSON.parse(req.body.ingredients) : [];
        const nutritionalInfo = req.body.nutrInfo ? JSON.parse(req.body.nutrInfo) : {};

        // NOTE: VALIDATES ID FORMAT TO CHECK IF RECIPE EXISTS
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({error: 'Invalid recipe ID.'})
        }

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

        // ATTEMPTING TO FIND USER'S RECIPE
        const recipe = await recipeModel.findById(id)

        // SENDING ERROR IF COULDN'T FIND THE RECIPE
        if (!recipe) {
            return res.status(404).json({error: 'Couldn\'t find recipe.'})
        }

        // CHECKING IF LOGGED IN USER OWNS RECIPE
        if (recipe.postedBy.toString() !== user._id.toString()) {
            return res.status(401).json({ error: 'Updating recipe is not authorized.' })
        }

        // CREATING UPDATE OBJECT
        const updateData = {
            title: title || recipe.title,
            prepTime: prepTime || recipe.prepTime,
            cookTime: cookTime || recipe.cookTime,
            servingSize: servingSize || recipe.servingSize,
            difficulty: difficulty || recipe.difficulty,
            origin: origin || recipe.origin,
            mealType: mealType || recipe.mealType,
            prepInstructions: prepInstructions.length > 0 ? prepInstructions : recipe.prepInstructions,
            cookInstructions: cookInstructions.length > 0 ? cookInstructions : recipe.cookInstructions,
            ingredients: ingredients.length > 0 ? ingredients : recipe.ingredients,
            nutritionalInfo: Object.keys(nutritionalInfo).length > 0 ? nutritionalInfo : recipe.nutritionalInfo,
            approvalStatus: 'pending'
        };

        // CHECKING IF THE USER UPLOADED A NEW IMAGE
        if (image) {
            updateData.image = image;
        }

        // UPDATING RECIPE
        const updatedRecipe = await recipeModel.findOneAndUpdate(
            {_id: id},
            updateData,
            { new: true }
        )

        // NOTE: CHECKS IF RECIPE EXISTS IN DB
        if (!updatedRecipe) {
            return res.status(404).json({error: 'Couldn\'t update recipe.'})
        }

        // SENDING EMAIL TO THE OWNER OF THE RECIPE
        if (user) {
            // ESTABLISHING SUBJECT AND CONTENT
            const subject = 'Your Recipe has been Updated!'
            const content = `
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5E9DF; color: #071320;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <img src="http://localhost:3000/ED2_LOGOV6.png" alt="EdibleEducation Logo" style="width: 150px; height: auto;"/>
                    </div>
                    
                    <h1 style="color: #ff7800; text-align: center; margin-bottom: 20px;">Dear ${user.username},</h1>
                    
                    <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: black;">
                            We would like to notify you that your recipe has been updated!
                        </p>
                        
                        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: black;">
                            Since you have made changes to your recipe, it needs to be re-evaluated by our moderators. Once this has been completed we will notify you with further details.
                        </p>

                        <div style="text-align: center; margin: 30px 0;">
                            <a href="http://localhost:3000/login" 
                            style="display: inline-block; padding: 12px 30px; background-color: #ff7800; color: white; 
                                    text-decoration: none; border-radius: 5px; font-weight: bold; 
                                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                                Check out my recipe here
                            </a>
                        </div>
                        
                        <p style="font-size: 14px; color: #666; text-align: center; margin-top: 20px;">
                            If you have any questions please contact our support team.
                        </p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #666;">
                        <p>© 2025 EdibleEducation. All rights reserved.</p>
                    </div>
                </div>
            `

            // USING 'sendEmail' UTILITY FUNCTION TO SEND EMAIL
            sendEmail(user.email, subject, content)
        }   

        // RETURNING RESPONSE WITH STATUS 200
        return res.status(200).json({message: "Recipe updated successfully!", recipe: updatedRecipe})
    } catch(err) {
        // NOTE: CATCHES ERRORS AND RETURNS ERROR MESSAGE
        return res.status(500).json({ error: err.message })
    }
}

// UPDATE RECIPE STATUS ---------------------------------------------------------------------------
const updateRecipeStatus = async (req, res) => {
    const { id } = req.params
    const { status } = req.body

    // CHECKING IF A STATUS HAS BEEN SELECTED
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

        // ATTEMPTING TO FIND USER BASED ON THE POSTER
        const user = await userModel.findById(recipe.postedBy)

        // IF USER IS FOUND AN EMAIL IS SENT TO THEM ABOUT THE UPDATION
        if (user) {
            // SUBJECT AND CONTENT IS ESTABLISHED FOR THE EMAIL
            const subject = 'Your Recipe Status has been Updated!'
            const content = `
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5E9DF; color: #071320;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <img src="http://localhost:3000/ED2_LOGOV6.png" alt="EdibleEducation Logo" style="width: 150px; height: auto;"/>
                    </div>
                    
                    <h1 style="color: #ff7800; text-align: center; margin-bottom: 20px;">Dear ${user.username}!</h1>
                    
                    <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: black;">
                            Your recipe status has been updated to <b>${status}<b>!
                        </p>
                        
                        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: black;">
                            This change affects the visibility of your posted recipe, for other users on the platform.
                        </p>

                        <div style="text-align: center; margin: 30px 0;">
                            <a href="http://localhost:3000/login" 
                            style="display: inline-block; padding: 12px 30px; background-color: #ff7800; color: white; 
                                    text-decoration: none; border-radius: 5px; font-weight: bold; 
                                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                                Check out my recipe here
                            </a>
                        </div>
                        
                        <p style="font-size: 14px; color: #666; text-align: center; margin-top: 20px;">
                            If you have any questions please contact our support team.
                        </p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #666;">
                        <p>© 2025 EdibleEducation. All rights reserved.</p>
                    </div>
                </div>
            `

            // USING THE UTILITY FUNCTION 'sendEmail' TO SEND THE EMAIL
            sendEmail(user.email, subject, content)
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

        // SETTING SUBJECT AND CONTENT OF EMAIL
        const subject = 'Your Comment has been added!💬'
        const emailContent = `
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5E9DF; color: #071320;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <img src="http://localhost:3000/ED2_LOGOV6.png" alt="EdibleEducation Logo" style="width: 150px; height: auto;"/>
                </div>
                
                <h1 style="color: #ff7800; text-align: center; margin-bottom: 20px;">Dear ${user.username}!</h1>
                
                <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: black;">
                        You have successfully posted a comment on the platform!
                    </p>
                    
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: black;">
                        The comment you posted: <br>
                        <i>${content}</i>
                    </p>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="http://localhost:3000/login" 
                        style="display: inline-block; padding: 12px 30px; background-color: #ff7800; color: white; 
                                text-decoration: none; border-radius: 5px; font-weight: bold; 
                                box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                            Go to discussions
                        </a>
                    </div>
                    
                    <p style="font-size: 14px; color: #666; text-align: center; margin-top: 20px;">
                        If you have any questions please contact our support team.
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #666;">
                    <p>© 2025 EdibleEducation. All rights reserved.</p>
                </div>
            </div>
        `

        // SENDING EMAIL TO USER USING THE 'sendEmail' UTILITY FUNCTION
        sendEmail(email, subject, emailContent)

        // NOTE: CREATES COMMENT IF EVERYTHING IS OK
        return res.status(201).json({ message: "Comment has been added!", comment: recipe.comments[addedComment-1]})
    } catch(err) {
        // NOTE: RETURNS ERROR IF SOMETHING WENT WRONG
        return res.status(500).json({ error: "Something went wrong" })
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

        // MAKING SURE USER IS VERIFIED TO CONDUCT RATING
        if (user.verification.status !== 'verified') {
            return res.status(404).json({ error: 'You cannot rate recipes until you verify your account.' })
        }

        // ATTEMPTING TO FIND RECIPE USER WANTS TO RATE
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
            return res.status(400).json({ error: "You have already rated the recipe!" })
        }

        // CHECKING IF USER OWNS THE RECIPE
        var ownedRecipe = false
        if (recipe.postedBy.toString() === user._id.toString()) {
            ownedRecipe = true
        }

        // IF THE USER OWNS THE RECIPE THE RATING WILL NOT BE ADDED
        if (ownedRecipe) {
            return res.status(400).json({ error: "You cannot rate your own recipe!" })
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

        // IF NO COMMENT HAS BEEN FOUND
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

        // IF SOMETHING WENT WRONG DURING THE DELETION
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

        // CHECKING IF THE USER IS AUTHORIZED
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

        // CHECKING IF THE COMMENT EXISTS
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

        // CHECKING IF SOMETHING WENT WRONG
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
            if (recipe.approvalStatus === 'approved' && popularAvarage < avarageRating) {
                bestRated = recipe
            // MAKING SURE BEST RATED RECIPE WILL NOT STAY NAN(Not RATED) FOR THE NEXT RECIPE
            } else if (recipe.approvalStatus === 'approved' && isNaN(popularAvarage)) {
                bestRated = recipe
            }

            // IDENTIFYING THE MOST RATED RECIPE 
            if (recipe.approvalStatus === 'approved'&& mostRated.rating.length < recipe.rating.length) {
                mostRated = recipe
            } 

            // IDENTIFYING THE MOST COMMENTS ON RECIPE 
            if (recipe.approvalStatus === 'approved' && mostComments.comments.length < recipe.comments.length) {
                mostComments = recipe
            } 

            // IDENTIFYING THE LATEST RECIPE
            if (recipe.approvalStatus === 'approved' && recipe.variationOfRecipe.status !== true) {
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
    updateOwnedRecipe,
    updateRecipeStatus,
    addComment,
    addRating,
    deleteComment,
    removeUserComment,
    popularRecipe
}

// END OF DOCUMENT --------------------------------------------------------------------------------