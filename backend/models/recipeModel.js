// NOTE: REQUIRES MONGOOSE TO CREATE SCHEMA
const mongoose = require('mongoose')

const Schema = mongoose.Schema

// NOTE: DEFINES THE SCHEMA FOR THE RECIPE MODEL
const recipeSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    image: {
        type: String,
        required: false
    },
    prepTime: {
        type: Number,
        min: 0,
        require: true
    },
    cookTime: {
        type: Number,
        min: 0,
        require: true
    },
    servingSize: {
        type: Number,
        require: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'moderate', 'hard'],
        require: true
    },
    origin: {
        type: String,
        require: true
    },
    mealType: {
        type: String,
        enum: ['breakfast', 'brunch', 'lunch', 'dinner', 'dish', 'snack', 'drink', 'dessert', 'other'],
        require: true
    },
    prepInstructions: [String],
    cookInstructions: [String],
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
        user: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
        },
        content: {
            type: String
        },
        timestamp: {
            type: Date
        }
    }],
    rating: [{
        value: {
            type: Number
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
        }

    }],
    approvalStatus: {
        type: String,
        enum: ['approved', 'denied', 'pending'],
        required: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    variationOfRecipe: {
        status: {
            type: Boolean
        },
        recipe: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipe'
        }
    }
},
    {timestamps: true} // NOTE: AUTOMATICALLY ADDS CREATED DATE AND UPDATE DATE FIELDS
)

// NOTE: EXPORTS THE RECIPE MODEL BASED ON THE DEFINED SCHEMA
module.exports = mongoose.model('Recipe', recipeSchema)

// END OF DOCUMENT --------------------------------------------------------------------------------