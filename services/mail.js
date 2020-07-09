require('dotenv').config();
const nodemailer = require('nodemailer');

let sendVerifyLink = (url, req) => {

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MY_G_MAIL,
            pass: process.env.MY_G_PWD
        }
    });

    var mailOptions = {
        from: 'akashtambe11@gmail.com',
        to: req,
        subject: 'Login Verification Link',
        text: 'Click on the following link to VERIFY your ChatApp account: \n' + url
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('email sent: ' + info.response);
        }
    });
}

let sendForgotLink = (url, req) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MY_G_MAIL,
            pass: process.env.MY_G_PWD
        }
    });

    var mailOptions = {
        from: 'akashtambe11@gmail.com',
        to: req,
        subject: 'Password Reset Link',
        text: 'Click on the following link to RESET your ChatApp password: \n' + url
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('email sent: ' + info.response);
        }
    });
}

module.exports = { sendVerifyLink, sendForgotLink }