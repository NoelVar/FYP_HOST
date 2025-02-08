// NOTE: REQUIRE EXPRESS PACKAGE
const express = require('express');
require('dotenv').config()

const recipesRoutes = require('./routes/recipeRoutes');
const userRoutes = require('./routes/userRoutes');
const ingredientRoutes = require('./routes/ingredientRoutes');

// NOTE: EXPRESS APPLICATION
const app = express();

// NOTE: MIDDLE WARE
app.use((req, res, next) => {
    // DEBUG: REMOVE BEFORE DEPLOYMENT
    console.log("Request path: " + req.path, " Request method: " + req.method)
    next()
})

// NOTE: ROUTES
app.use('/recipes', recipesRoutes);
app.use('/users', userRoutes);
app.use('/ingredients', ingredientRoutes);

// NOTE: LISTEN FOR REQUESTS
app.listen(process.env.PORT, () => {
    // DEBUG: REMOVE BEFORE DEPLOYMENT 
    console.log("Listening to the PORT", process.env.PORT)
})