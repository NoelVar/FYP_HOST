// ADAPTED FROM: https://www.youtube.com/watch?v=jfZyqZycjmA
// NOTE: IMPORTING 'multer, path'
const multer = require('multer');
const path = require('path');

// CREATING 'multer' STORAGE AND SAVING IMAGES IN THE PUBLIC FOLDER
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    }, 
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})

// NOTE: UPLOAD FUNCTION THAT TAKES THE STORAGE CONSTAN
const upload = multer({
    storage: storage
})

// EXPORT UPLOAD FUNCTION
module.exports = { upload }

// END OF DOCUMENT --------------------------------------------------------------------------------