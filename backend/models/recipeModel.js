// NOTE: REQUIRES MONGOOSE TO CREATE SCHEMA
const mongoose = require('mongoose')

const Schema = mongoose.Schema

// NOTE: DEFINES THE SCHEMA FOR THE RECIPE MODEL
const recipeSchema = new Schema({
    title: {
        type: String,
        require: true   // NOTE: 'title' MUST BE ENTERED
    },
    prepTime: {
        type: Number,
        min: 0,
        require: true   // NOTE: 'prepTime' MUST BE ENTERED
    },
    cookTime: {
        type: Number,
        min: 0,
        require: true   // NOTE: 'cookTime' MUST BE ENTERED
    },
    servingSize: {
        type: Number,
        require: true   // NOTE: 'servingSize' MUST BE ENTERED
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Moderate', 'Hard'],
        require: true   // NOTE: 'difficulty' MUST BE ENTERED
    },
    origin: {
        type: String,
        require: true   // NOTE: 'origin' MUST BE ENETERED
    },
    mealType: {
        type: String,
        enum: ['Breakfast', 'Brunch', 'Lunch', 'Dinner', 'Dish', 'Snack', 'Drink', 'Dessert', 'Other'],
        require: true   // NOTE: 'mealType' MUST BE ENETERED
    },
    prepInstructions: {
        type: String,
        require: true   // NOTE: 'prepIntructions' MUST BE ENTERED
    },
    cookIntructions: {
        type: String,
        require: true   // NOTE: 'cookInstructions' MUST BE ENTERED
    },
    ingredients: [{
        // NOTE: SINGLE INGREDIENT
        ingredient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ingredient'
        },
        // NOTE: QUANTITY OF INGREDIENT
        quantity: {
            type: Number,
            required: false
        },
        // NOTE: TYPE OF MEASUREMENT
        measurement: {
            type: String,
            required: false
        }
    }]
},
    {timestamps: true} // NOTE: AUTOMATICALLY ADDS CREATED DATE AND UPDATE DATE FIELDS
)

// NOTE: EXPORTS THE RECIPE MODEL BASED ON THE DEFINED SCHEMA
module.exports = mongoose.model('Recipe', recipeSchema)