// const {check, validationResult} = require('express-validator');
const userService = require('../services/userService');
const userModel = require('../app/model/userModel');
const urlService = require('../services/url');
const authentication = require('../auth/auth');
const mail = require('../services/mail');

class UserController {

    async register(req, res) {
        try {
            //Postman Body - validation
            req.check('firstName', 'Length of name should be min 3 characters').isLength({ min: 3 });
            req.check('lastName', 'Last Name cannot be empty').notEmpty();
            req.check('email', 'Invalid email').isEmail();
            req.check('password', 'Invalid password').notEmpty().isLength({ min: 6 });

            const errors = await req.validationErrors();
            if (errors) {
                return res.status(422).json({ errors: errors });
            }

            userService.register(req.body)
                .then(data => {

                    let request = {
                        email: data.email,
                        url: 'http://localhost:3000/verify/'
                    }
                    urlService.shortenUrl(request, (err, result) => {
                        if (err) {
                            res.status(422).send(err)
                        } else {
                            mail.sendVerifyLink(result.shortUrl, result.email);
                            res.status(200).send(result);
                        }
                    })
                })
                .catch(err => {
                    console.log(err);
                    res.status(422).send(err);
                })
        }
        catch (error) {
            let response = {};
            response.success = false;
            response.data = error;
            res.status(404).send(response);
        }
    }


    async login(req, res) {
        try {
            req.checkBody('email', 'invalid email').isEmail();
            req.check('password', 'Invalid password').notEmpty().isLength({ min: 6 });

            const errors = await req.validationErrors();
            if (errors) {
                return res.status(422).json({ errors: errors });
            }

            userService.login(req.body, (err, data) => {
                if (err) {
                    res.status(422).send(err);
                } else {
                    let payload = {
                        id: data._id,
                        email: data.email
                    }
                    let token = authentication.generateToken(payload);

                    let result = {
                        response: data,
                        token: token
                    }
                    res.status(200).send(result);
                }
            });
        }
        catch (error) {
            let response = {};
            response.success = false;
            response.data = error;
            res.status(404).send(response);
        }
    }


    async forgot(req, res) {
        try {
            req.checkBody('email', 'Invalid email').isEmail();

            const errors = await req.validationErrors();
            if (errors) {
                return res.status(422).json({ errors: errors });
            }

            userService.forgot(req.body)
                .then(data => {
                    let payload = {
                        email: data.email,
                        id: data._id
                    }
                    let token = authentication.generateToken(payload);

                    userModel.update(
                        { email: data.email },
                        { forgot_token: token },
                        (err, result) => {
                            if (err) {
                                res.status(422).send(err);
                            } else {
                                let url = 'http://localhost:3000/reset/' + token;
                                mail.sendForgotLink(url, data.email);
                                res.status(200).send(data);
                            }
                        });
                })
                .catch(err => {
                    res.status(422).send(err);
                })
        }
        catch (error) {
            let response = {};
            response.success = false;
            response.data = error;
            res.status(404).send(response);
        }
    }


    async reset(req, res) {
        try {
            req.check('new_password', 'Invalid password').notEmpty().isLength({ min: 6 });

            const errors = await req.validationErrors();
            if (errors) {
                return res.status(422).json({ errors: errors });
            }

            let request = {
                email: req.decoded.email,
                new_password: req.body.new_password
            }

            userService.reset(request)
                .then(data => {
                    res.status(200).send(data);
                })
                .catch(err => {
                    res.status(422).send(err);
                })
        }
        catch (error) {
            let response = {};
            response.success = false;
            response.data = error;
            res.status(404).send(response);
        }
    }


    async verifyMail(req, res) {
        try {
            urlService.verifyUrl(req.decoded, (err, data) => {
                if (err)
                    res.status(422).send(err);
                else
                    res.status(200).send(data);
            })
        }
        catch (error) {
            let response = {};
            response.success = false;
            response.data = error;
            res.status(404).send(response);
        }
    }

    getAllUsers(req, res) {
        try {
            userService.getAllUsers(req, (err, data) => {
                if (err) {
                    res.status(422).send(err);
                } else {
                    res.status(200).send(data);
                }
            })
        }
        catch (err) {
            console.log("Error: ", err);

        }
    }
}

module.exports = new UserController();