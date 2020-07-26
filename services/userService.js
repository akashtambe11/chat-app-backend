var userModel = require('../app/model/userModel');
var util = require('./util');

class UserServices {

    register(req) {

        return new Promise((resolve, reject) => {
            userModel.findOne({ email: req.email })
                .then(data => {
                    if (data) {
                        reject({
                            message: 'Email - ID already Exist'
                        });
                    }
                    else {
                        let hash = util.hashPassword(req.password)
                        hash.then(data => {
                            let request = {
                                firstName: req.firstName,
                                lastName: req.lastName,
                                email: req.email,
                                password: data
                            }

                            userModel.register(request, (err, result) => {
                                if (err)
                                    reject(err);
                                else {
                                    resolve(result);
                                }
                            })
                        })
                            .catch(err => {
                                reject(err);
                            })
                    }
                })
                .catch(err => {
                    reject(err);
                });
        });
    }


    login(req, callback) {

        userModel.findOne({ email: req.email })
            .then(data => {
                if (data.isVerified) {
                    util.comparePassword(req.password, data.password, (err, result) => {

                        if (err) {
                            callback(err);
                        } else if (result) {

                            userModel.login(data, (err, res) => {
                                if (err)
                                    callback(err);
                                else {
                                    callback(null, res);
                                }
                            });
                        } else {
                            callback({
                                message: 'Invalid Password'
                            })
                        }
                    })
                } else {
                    callback({
                        message: "User not verified"
                    })
                }
            })
            .catch(err => {
                callback({
                    message: 'User not Registered'
                })
            })
    }

    forgot(req) {

        return new Promise((resolve, reject) => {
            userModel.findOne({ email: req.email })
                .then(data => {
                    if (data.isVerified) {

                        //forgot_response_output
                        let result = {
                            status: true,
                            id: data._id,
                            email: data.email,
                            message: "forgot email sent"
                        }
                        resolve(result);
                    } else {
                        reject({
                            message: 'User not Verified'
                        });
                    }
                })
                .catch(err => {
                    reject({
                        message: 'User not registered'
                    });
                });
        });
    }

    reset(req) {

        return new Promise((resolve, reject) => {
            userModel.findOne({ email: req.email })
                .then(data => {

                    let hash = util.hashPassword(req.new_password);
                    hash
                        .then(res => {
                            let request = {
                                _id: data._id,
                                password: res
                            }
                            userModel.reset(request)
                                .then(response => {
                                    resolve(response);
                                })
                                .catch(err => {
                                    reject(err);
                                })
                        })
                        .catch(err => {
                            reject(err);
                        })
                })
                .catch(err => {
                    reject(err);
                })
        })
    }

    getAllUsers(req, callback) {

        userModel.getAllUsers(req, (err, data) => {
            if (err) {
                callback(err);
            } else {
                callback(null, data);
            }
        })
    }
}

module.exports = new UserServices();