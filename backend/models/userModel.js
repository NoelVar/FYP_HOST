// NOTE: REQUIRES MONGOOSE TO CREATE SCHEMA
const mongoose = require('mongoose')

const Schema = mongoose.Schema

// NOTE: DEFINES THE SCHEMA FOR THE USER MODEL
const userSchema = new Schema({
    username: {
        type: String,
        required: true  // NOTE: 'username' HAS TO BE ENTERED
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        // TODO: HASH PASSWORDS 
        type: String,
        require: true
    },
    // NOTE: USING "RBAC" (Role-Based Access Control)
    role: {
        type: String,
        enum: ['admin', 'moderator', 'user'],
        require: true
    }
    // FIXME: ADD LAST_LOGGED_IN FOR SECURITY

},
    {timestamps: true} // NOTE: AUTOMATICALLY ADDS CREATED DATE AND UPDATE DATE FIELDS
)

// NOTE: EXPORTS THE USER MODEL BASED ON THE DEFINED SCHEMA
module.exports = mongoose.model('User', userSchema)