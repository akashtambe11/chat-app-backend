var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false,
        required: false
    },
    longUrl: {
        type: String,
        required: false
    },
    shortUrl: {
        type: String,
        required: false
    },
    urlCode: {
        type: String,
        required: false
    },
    forgot_token: {
        type: String,
        required: false
    }
})

var User = mongoose.model('users', userSchema); // users : Collection Name

class Model {

    findOne(req) {
        return new Promise((resolve, reject) => {
            User.findOne(req)
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                })
        })
    }

    //Update 
    update(req, res, callback) {

        User.updateOne(req, res)
            .then(data => {
                callback(null, data);
            })
            .catch(err => {
                callback(err);
            })
    }

    //Registration
    register(req, callback) {

        let createObject = new User({
            firstName: req.firstName,
            lastName: req.lastName,
            email: req.email,
            password: req.password
        })

        createObject.save((error, result) => {
            if (error) {
                callback(error)
            } else {
                let response = {
                    email: result.email
                }
                callback(null, response)
            }
        });
    }

    //Login
    login(req, callback) {
        let response = {
            id: req._id,
            firstName: req.firstName,
            email: req.email,
        }
        callback(null, response)
    }
 
    //Reset
    reset(req) {

        return new Promise((resolve, reject) => {
            User.updateOne(
                { _id: req._id },
                { password: req.password },
                { new: true }
            )
                .then(res => {
                    resolve({
                        //reset_response_output
                        status: true,
                        message: 'password updated'
                    })
                })
                .catch(err => {
                    reject(err)
                })
        });
    }

    getAllUsers(req, callback) {

        User.find({}, { "firstName": 1, "lastName": 1 }, (err, result) => {
            if (err) {
                callback(err);
            } else {
                callback(null, result);
            }
        })
    }

}

module.exports = new Model();