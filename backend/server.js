// NOTE: REQUIRE EXPRESS PACKAGE
const express = require('express');
const mongoose = require('mongoose');
const recipesRoutes = require('./routes/recipeRoutes');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors')
const dotenv = require("dotenv")
dotenv.config()

// NOTE: EXPRESS APPLICATION
const app = express();
app.use(cors({
    origin: "http://localhost:3000", 
    credentials: true
}))

// NOTE: MIDDLEWARE
app.use(express.json());
app.use(express.static('public'));

app.use((req, res, next) => {
    // DEBUG: REMOVE BEFORE DEPLOYMENT
    console.log("Request path: " + req.path, " Request method: " + req.method)
    next()
})

// NOTE: ROUTES
app.use('/recipes', recipesRoutes);
app.use('/user', userRoutes);

// CONNECT TO DB
mongoose.connect(process.env.DB_CONNECTION)
    .then(() => {
        // NOTE: LISTEN FOR REQUESTS
        app.listen(process.env.PORT, () => {
            // DEBUG: REMOVE BEFORE DEPLOYMENT 
            console.log("Connected to DB and listening to the PORT", process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })

// END OF DOCUMENT --------------------------------------------------------------------------------