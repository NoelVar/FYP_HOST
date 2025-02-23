// NOTE: REQUIRES MONGOOSE TO CREATE SCHEMA
const mongoose = require('mongoose')

const Schema = mongoose.Schema

// NOTE: DEFINES THE SCHEMA FOR THE RECIPE MODEL
const recipeSchema = new Schema({
    title: {
        type: String,
        require: true   // NOTE: 'title' MUST BE ENTERED
    },
    image: {
        type: String,
        required: false
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
        enum: ['easy', 'moderate', 'hard'],
        require: true   // NOTE: 'difficulty' MUST BE ENTERED
    },
    origin: {
        type: String,
        require: true   // NOTE: 'origin' MUST BE ENETERED
    },
    mealType: {
        type: String,
        enum: ['breakfast', 'brunch', 'lunch', 'dinner', 'dish', 'snack', 'drink', 'dessert', 'other'],
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
            type: String,
            required: true
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
    }],
    nutritionalInfo: {
        totalKcal: {
            type: Number
        },
        totalCarbs: {
            type: Number
        },
        totalFat: {
            type: Number
        },
        totalProtein: {
            type: Number
        }
    },
    comments: [{
        name: {
            type: String
        },
        content: {
            type: String
        }
    }],
    approvalStatus: {
        type: String,
        enum: ['approved', 'denied', 'pending'],
        required: true
    }
},
    {timestamps: true} // NOTE: AUTOMATICALLY ADDS CREATED DATE AND UPDATE DATE FIELDS
)

// NOTE: EXPORTS THE RECIPE MODEL BASED ON THE DEFINED SCHEMA
module.exports = mongoose.model('Recipe', recipeSchema)