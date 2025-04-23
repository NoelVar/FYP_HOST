// NOTE: INSPIRED FROM: https://www.w3schools.com/nodejs/nodejs_email.asp
var nodemailer = require('nodemailer');
const dotenv = require("dotenv")
dotenv.config()

const sendEmail = (email, subject, content) => {
    // NOTE: EMAIL TRANSPORTER
    var transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.SOURCE_EMAIL_ADD,
            pass: process.env.SOURCE_EMAIL_PASS 
        }
    });

    // ADDING THE MAILING INFORMATION
    var mailOptions = {
        from: process.env.SOURCE_EMAIL_ADD,
        to: email,
        subject: subject,
        html: content
    };

    // SENDING THE EMAIL USING THE MAIN+L INFORMATION AND THE TRANSPORTER
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = { sendEmail }

// END OF DOCUMENT --------------------------------------------------------------------------------