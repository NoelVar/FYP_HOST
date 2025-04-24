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
    origin: ["http://localhost:3000", "https://classy-madeleine-bde46c.netlify.app"], 
    credentials: true
}))

// NOTE: MIDDLEWARE
app.use(express.json());
app.use(express.static('public'));

// DEBUG THIS IS USED FOR DEVELOPING PURPOSES!
// app.use((req, res, next) => {
//     // DEBUG: REMOVE BEFORE DEPLOYMENT
//     console.log("Request path: " + req.path, " Request method: " + req.method)
//     next()
// })

// NOTE: ROUTES
app.use('/recipes', recipesRoutes);
app.use('/user', userRoutes);

// CONNECT TO DB
mongoose.connect(process.env.DB_CONNECTION)
    .then(() => {
        // NOTE: LISTEN FOR REQUESTS
        app.listen(process.env.PORT, () => {
            console.log("Connected to DB")
        })
    })
    .catch((error) => {
        console.log(error)
    })

// END OF DOCUMENT --------------------------------------------------------------------------------