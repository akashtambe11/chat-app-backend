require('dotenv').config();
var jwt = require('jsonwebtoken');
const userModel = require('../app/model/userModel');

let generateToken = (payload) => {
    // console.log(payload);

    let token = jwt.sign(
        payload,
        process.env.JWT_KEY,
        {
            expiresIn: "24hr"
        }
    );
    return token;
}

let checkToken = (req, res, next) => {

    if (req.headers.token) {
        let bearerHeader = req.headers.token

        jwt.verify(bearerHeader, process.env.JWT_KEY, (err, decoded) => {

            if (err) {
                req.decoded = null;
                res.status(422).send(err + '\ntoken expired');
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(422).send({
            message: 'token not found'
        });
    }
}

let resetToken = (req, res, next) => {

    if (req.params.token) {
        let emailToken = req.params.token


        jwt.verify(emailToken, process.env.JWT_KEY, (err, decoded) => {

            if (err) {
                req.decoded = null;
                res.status(422).send(err + '\ntoken expired');
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(422).send({
            message: 'token not found'
        });
    }
}

let verificationToken = (req, res, next) => {
    let bearerHeader = req.params.shortedUrl;

    userModel.findOne({ urlCode: bearerHeader })
        .then(data => {

            if (data == null) {
                let response = { message: "no data found" };
                res.status(422).send(response);

            } else {
                let url = data.longUrl.slice(29);

                jwt.verify(url, process.env.JWT_KEY, (err, decoded) => {
                    if (err) {
                        req.authenticated = false;
                        req.decoded = null;
                        res.status(422).send(err);
                    } else {
                        console.log('verification token matched');
                        req.decoded = decoded;
                        req.authenticated = true;
                        next();
                    }
                })
            }
        })
        .catch(err => {
            res.status(422).send(err);
        })
}

module.exports = { generateToken, checkToken, resetToken, verificationToken }