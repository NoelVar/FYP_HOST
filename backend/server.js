// NOTE: REQUIRE EXPRESS PACKAGE
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()

const recipesRoutes = require('./routes/recipeRoutes');
const userRoutes = require('./routes/userRoutes');
const ingredientRoutes = require('./routes/ingredientRoutes');

// NOTE: EXPRESS APPLICATION
const app = express();

// NOTE: MIDDLE WARE
app.use(express.json());

app.use((req, res, next) => {
    // DEBUG: REMOVE BEFORE DEPLOYMENT
    console.log("Request path: " + req.path, " Request method: " + req.method)
    next()
})

// NOTE: ROUTES
app.use('/recipes', recipesRoutes);
app.use('/users', userRoutes);
app.use('/ingredients', ingredientRoutes);

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