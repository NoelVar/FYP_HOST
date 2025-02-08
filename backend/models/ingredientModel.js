// NOTE: REQUIRES MONGOOSE TO CREATE SCHEMA
const mongoose = require('mongoose')

const Schema = mongoose.Schema

// NOTE: DEFINES THE SCHEMA FOR THE INGREDIENT MODEL
const ingredientSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: false
    }
},
    {timestamps: true} // NOTE: AUTOMATICALLY ADDS CREATED DATE AND UPDATE DATE FIELDS
)

// NOTE: EXPORTS THE INGREDIENT MODEL BASED ON THE DEFINED SCHEMA
module.exports = mongoose.model('Ingredient', ingredientSchema)