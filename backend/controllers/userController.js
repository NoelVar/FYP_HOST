// NOTE: IMPORTS ----------------------------------------------------------------------------------
const userModel = require('../models/userModel')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const dotenv = require("dotenv")
dotenv.config()
// NOTE: INSPIRED FROM: https://www.w3schools.com/nodejs/nodejs_email.asp
var nodemailer = require('nodemailer');
const { sendEmail } = require('../Utilities/SendingEmail');

// ADAPTED FROM: https://youtu.be/MsudBMepwO8
const createToken = (_id) => {
    return jwt.sign({ _id: _id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}

// CREATE VERIFICATION CODE
const verificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// ADAPTED FROM: https://mailtrap.io/blog/nodejs-email-validation/
// NOTE: FOR EMAIL VALIDATION USING REGULAR EXPRESSION (RegEx)
/*
    ^ "=>" BEGINING OF THE STRING 
    [^\s@]+ "=>" CHECKS FIRST PART FOR WHITE SPACES OR '@' SYMBOLS WHICH ARENT ALLOWED
    @ "=>" CHECKS FOR '@' SYMBOL
    [^\s@]+ "=>" CHECKS SECOND PART FOR WHITE SPACES OR '@' SYMBOLS WHICH ARENT ALLOWED
    \. "=>" CHECKS FOR PERIOD
    [^\s@]+ "=>" CHECKS THIRD PART FOR WHITE SPACES OR '@' SYMBOLS WHICH ARENT ALLOWED
    $ "=>" END OF STRING
*/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// NOTE: FOR STRONG PASSWORD VALIDATION USING REGULAR EXPRESSION (RegEx)
/*
    CHECKS PASSWORD FOR:
        - MINIMUM 1 LOWERCASE CHARACTER
        - MINIMUM 1 UPPERCASE CHARACTER
        - MINIMUM 1 NUMBER
        - MINIMUM 1 SPECIAL CHARACTER
        - MINIMUM LENGHT OF 8 CHARACTERS
*/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*])[A-Za-z\d!@#$%&*]{8,}$/;

// REGISTER USER ----------------------------------------------------------------------------------
const registerUser = async (req, res) => {

    const { username, email, password, confirmPassword } = req.body;
    const role = 'user';
    const status = 'unconfirmed';
    const veriCode = verificationCode()

    const verification = {
        status: status,
        code: veriCode
    }

    // ------------------------- NOTE: VALIDATION -------------------------
    // NOTE: CHECKS IF USERNAME IS EMPTY
    if (username === '' || password === '' || confirmPassword === '') {
        return res.status(400).json({ error: 'Field cannot be empty.' })
    }

    const usernameExists = await userModel.findOne({ username })

    if (usernameExists) {
        return res.status(400).json({ error: 'Username is already registered.' })
    }

    // NOTE: CHECKS IF EMAIL IS EMPTY
    if (email === '') {
        return res.status(400).json({ error: 'Email is required.' })
    }

    // NOTE: TEST EMAIL FORMAT USING 'emailRegex'
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format.' })
    }

    // NOTE: CHECKS IF USER EXISTS IN DB
    const alreadyRegisteredEmail = await userModel.findOne({ email })

    if (alreadyRegisteredEmail) {
        return res.status(400).json({ error: 'Email is already registered.' })
    }

    if (password !== confirmPassword) {
        return res.status(401).json({ error: 'Password and confirm password does not match.' })
    }

    if (!passwordRegex.test(password)) {
        return res.status(400).json({ error: 'Weak password! Password should be minimum 8 characters long and contain atleast one number, one uppercase, one lowercase, and one special character (!@#$%&*).' })
    }

    // NOTE: ATTEMPTS TO CREATE USER IN DB  
    try {
        // NOTE: HASHING PASSWORD
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const user = await userModel.create({username, email, password: hash, role, verification})

        if(!user) {
            // NOTE: RETURNS ERROR IF COULDN'T CREATE USER
            return res.status(409).json({ error: 'The request could not be completed due to a conflict with the current state of the resource.' })
        }

        // CREATING TOKEN
        const token = createToken(user._id)

        const subject = 'Welcome to EdibleEducation!🍓'
        const content = `
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5E9DF; color: #071320;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <img src="http://localhost:3000/ED2_LOGOV6.png" alt="EdibleEducation Logo" style="width: 150px; height: auto;"/>
                </div>
                
                <h1 style="color: #ff7800; text-align: center; margin-bottom: 20px;">Hello ${username}!</h1>
                
                <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: black;">
                        Thank you for joining <b>EdibleEducation</b>! <br> We are EGGcited to have you here! 🥚
                    </p>

                    <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); border: 1px solid black; text-align: center;">
                        <h2>Your code to verify your email address:</h2>
                        <p>${veriCode}</p>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="http://localhost:3000/login" 
                           style="display: inline-block; padding: 12px 30px; background-color: #ff7800; color: white; 
                                  text-decoration: none; border-radius: 5px; font-weight: bold; 
                                  box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                            Verify Account
                        </a>
                    </div>
                    
                    <p style="font-size: 14px; color: #666; text-align: center; margin-top: 20px;">
                        If you have any questions, feel free to reach out to our support team.
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #666;">
                    <p>© 2025 EdibleEducation. All rights reserved.</p>
                </div>
            </div>
        `

        sendEmail(email, subject, content)

        // NOTE: CREATES USER IF EVERYTHING IS OK
        res.status(201).json({ email, username, token })
    
    } catch (err) {
         // NOTE: RETURNS ERROR IF SOMETHING WENT WRONG
         return res.status(500).json({ error: err.message })
    }
}

// LOGIN USER -------------------------------------------------------------------------------------
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (email === '' || password === '') {
        return res.status(400).json({ error: 'Field cannot be empty.' })
    }

    // NOTE: TEST EMAIL FORMAT USING 'emailRegex'
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format.' })
    }

    try {
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(404).json({ error: 'Couldn\'t find user with matching email address.' })
        }
        const username = user.username
        const match = await bcrypt.compare(password, user.password)

        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials.' })
        }

        // NOTE: RETURNS USER TOKEN
        const token = createToken(user._id)

        // NOTE: RETURNS USER IF STATUS IS OK
        return res.status(200).json({ email, username, token })
    } catch(err) {
        // NOTE: RETURNS ERROR IF SOMETHING WENT WRONG
        return res.status(500).json({ error: err.message })
    }
}

// VERIFY EMAIL ADDRESS ---------------------------------------------------------------------------
const verifyEmail = async (req, res) => {
    const { email, veriCode } = req.body;

    if (veriCode === '') {
        return res.status(400).json({ error: 'Please provide a verification code!' })
    }

    try {
        // NOTE: VALIDATES ID FORMAT TO CHECK IF USER EXISTS
        if (email === '') {
            return res.status(400).json({ error: 'Email cannot be empty' })
        }

        const user = await userModel.findOne({ email })
        
        // NOTE: CHECKS IF USER EXISTS IN DB
        if (!user) {
            return res.status(404).json({ error: 'Couldn\'t find user.' })
        }

        if (veriCode !== user.verification.code) {
            return res.status(400).json({ error: 'Invalid verification code.' })
        }

        const updatedUser = await userModel.findOneAndUpdate(
            {email: email},
            {verification: {
                status: 'verified',
                veriCode: ''
            }},
            {new: true}
        )

        if (!updatedUser) {
            return res.status(400).json({error: 'Couldn\'t verify user.'})
        }

        const subject = 'Your Account has been Verified!🍳'
        const content = `
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5E9DF; color: #071320;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <img src="http://localhost:3000/ED2_LOGOV6.png" alt="EdibleEducation Logo" style="width: 150px; height: auto;"/>
                </div>
                
                <h1 style="color: #ff7800; text-align: center; margin-bottom: 20px;">Hello ${user.username}!</h1>
                
                <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: black;">
                        Im happy to inform you that your account has been verified!
                    </p>
                    
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: black;">
                        Get ready to explore delicious recipes from around the world and connect with fellow food enthusiasts through our vibrant community discussions!
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="http://localhost:3000/login" 
                           style="display: inline-block; padding: 12px 30px; background-color: #ff7800; color: white; 
                                  text-decoration: none; border-radius: 5px; font-weight: bold; 
                                  box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                            Start Your Culinary Journey
                        </a>
                    </div>
                    
                    <p style="font-size: 14px; color: #666; text-align: center; margin-top: 20px;">
                        If you have any questions, feel free to reach out to our support team.
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #666;">
                    <p>© 2025 EdibleEducation. All rights reserved.</p>
                </div>
            </div>
        `

        sendEmail(user.email, subject, content)

        // NOTE: UPDATES USER IF STATUS IS OK
        return res.status(200).json({updatedUser, message: "Your account has been verified!"})

    } catch (err) {
        return res.status(500).json({ error: err.message })
    }

}

// GET ALL USERS ----------------------------------------------------------------------------------
const getAllUsers = async (req, res) => {
    // NOTE: FETCHES ALL USERS FROM DB
    try {
        const users = await userModel.find({})
        
        // NOTE: VALIDATES IF THE USERS EXIST IN DB
        if (!users) {
            return res.status(404).json({ error: 'No users found.' })
        }

        // NOTE: ONLY RETURNING INFORMATION ABOUT USER THAT IS NEEDED (NO PASSWORD)
        const allUsers= []
        users.map((user) => {
            const singleUser = {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                status: user.verification.status,
                createdAt: user.createdAt
            }

            allUsers.push(singleUser)
        })
            

        // NOTE: RETURNS USERS IF STATUS IS OK
        res.status(200).json(allUsers)
    } catch(err) {
        return res.status(500).json({ error: err.message })
    }
}

// GET SINGLE USER --------------------------------------------------------------------------------
const getSingleUser = async (req, res) => {
    const { email } = req.body

    try {
        // NOTE: VALIDATES ID FORMAT TO CHECK IF USER EXISTS
        if (email === '') {
            return res.status(400).json({ error: 'Email cannot be empty' })
        }

        const user = await userModel.findOne({ email })
        
        // NOTE: CHECKS IF USER EXISTS IN DB
        if (!user) {
            return res.status(404).json({ error: 'Couldn\'t find user.' })
        }
        const userInfo = {
            _id: user._id,
            username: user.username,
            userEmail: user.email,
            role: user.role,
            status: user.verification.status
        }

        // NOTE: RETURNS USER IF STATUS IS OK
        res.status(200).json(userInfo)
    } catch(err) {
        // NOTE: RETURNS ERROR IF SOMETHING WENT WRONG
        return res.status(500).json({ error: err.message })
    }
}

// GET SINGLE USER BY ID --------------------------------------------------------------------------
const getUserById = async (req, res) => {
    const { id } = req.body

    try {
        // NOTE: VALIDATES ID FORMAT TO CHECK IF USER EXISTS
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({error: 'Invalid user ID.'})
        }

        // GETS USER FROM DB
        const user = await userModel.findById(id)
        
        // NOTE: CHECKS IF USER EXISTS IN DB
        if (!user) {
            return res.status(404).json({ error: 'Couldn\'t find user.' })
        }

        // NOTE: RETURNS USER IF STATUS IS OK
        res.status(200).json(user.username)
    } catch(err) {
        // NOTE: RETURNS ERROR IF SOMETHING WENT WRONG
        return res.status(500).json({ error: err.message })
    }
}

// UPDATE USER ------------------------------------------------------------------------------------
const updateUser = async (req, res) => {
    const { id } = req.params
    const { role } = req.body
    
    if (!role) {
        return res.status(400).json({error: 'Role cannot be empty! Please select a role for the user!'})
    }

    try {
        // NOTE: VALIDATES ID FORMAT TO CHECK IF RECIPE EXISTS
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({error: 'Invalid user ID.'})
        }

        const user = userModel.findById(id)

        // NOTE: CHECKS IF USER EXISTS IN DB
        if (!user) {
            return res.status(404).json({ error: 'Couldn\'t find user.' })
        }
        
        // SETTING 'role' TO NEW STATUS USING ID
        user = await userModel.findOneAndUpdate(
            {_id: id},
            {role: role}, 
            {new: true})

        // NOTE: CHECKS IF USER EXISTS IN DB
        if (!user) {
            return res.status(404).json({error: 'Couldn\'t find user.'})
        }

        const subject = 'Your user status has been changed!🍳'
        const content = `
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5E9DF; color: #071320;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <img src="http://localhost:3000/ED2_LOGOV6.png" alt="EdibleEducation Logo" style="width: 150px; height: auto;"/>
                </div>
                
                <h1 style="color: #ff7800; text-align: center; margin-bottom: 20px;">Hello ${user.username}!</h1>
                
                <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: black;">
                        Your account role has been updated to ${role}!
                    </p>
                    
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: black;">
                        This change could impact what functionalities you have access to. To check out your new role please go to your account.
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="http://localhost:3000/login" 
                           style="display: inline-block; padding: 12px 30px; background-color: #ff7800; color: white; 
                                  text-decoration: none; border-radius: 5px; font-weight: bold; 
                                  box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                            See the changes here
                        </a>
                    </div>
                    
                    <p style="font-size: 14px; color: #666; text-align: center; margin-top: 20px;">
                        If you have any questions, feel free to reach out to our support team.
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #666;">
                    <p>© 2025 EdibleEducation. All rights reserved.</p>
                </div>
            </div>
        `

        sendEmail(user.email, subject, content)

        // NOTE: UPDATES USER IF STATUS IS OK
        return res.status(200).json(user)
    } catch(err) {
        // NOTE: CATCHES ERRORS AND RETURNS ERROR MESSAGE
        return res.status(500).json({ error: err.message })
    }
}

// DELETE USER ------------------------------------------------------------------------------------
const deleteUser = async (req, res) => {
    const { id } = req.params

    try {
        // NOTE: VALIDATES ID FORMAT TO CHECK IF USER EXISTS
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({error: 'Invalid user ID.'})
        }

        // GETS USER FROM DB
        const user = await userModel.findOneAndDelete({_id: id})
        
        // NOTE: CHECKS IF USER EXISTS IN DB
        if (!user) {
            return res.status(404).json({error: 'Couldn\'t find user.'})
        }

        const subject = 'Your Account has been Terminated!❌'
        const content = `
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5E9DF; color: #071320;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <img src="http://localhost:3000/ED2_LOGOV6.png" alt="EdibleEducation Logo" style="width: 150px; height: auto;"/>
                </div>
                
                <h1 style="color: #ff7800; text-align: center; margin-bottom: 20px;">Dear ${user.username}!</h1>
                
                <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: black;">
                        We regret to inform you that your account has been deleted!
                    </p>
                    
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: black;">
                        The termination could be due to violating our Terms & Conditions, or you choose to delete your account.
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

        sendEmail(user.email, subject, content)
        
        // NOTE: DELETES USER IF STATUS IS OK
        return res.status(200).json(user)
    } catch(err) {
        // NOTE: CATCHES ERRORS AND RETURNS ERROR MESSAGE
        return res.status(500).json({ error: err.message })
    }
}

module.exports = {
    loginUser,
    registerUser,
    verifyEmail,
    getAllUsers,
    getSingleUser,
    getUserById,
    updateUser,
    deleteUser
}

// END OF DOCUMENT --------------------------------------------------------------------------------