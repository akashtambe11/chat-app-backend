const validUrl = require('valid-url');
const shortid = require('shortid');
const auth = require('../auth/auth');
const userModel = require('../app/model/userModel');

class UrlService {

    shortenUrl(req, callback) {
        const baseUrl = req.url;
        const urlCode = shortid.generate();

        if (validUrl.isUri(baseUrl)) {
            try {
                userModel.findOne({ email: req.email })
                    .then(data => {

                        let payload = {
                            id: data._id,
                            email: req.email
                        }
                        let token = auth.generateToken(payload);

                        const longUrl = baseUrl + token;
                        const shortUrl = baseUrl + urlCode;

                        userModel.update({ _id: data._id },
                            {
                                longUrl: longUrl,
                                shortUrl: shortUrl,
                                urlCode: urlCode
                            },
                            (error, res) => {
                                if (error) {
                                    callback(error);
                                } else {

                                    //register_response_output
                                    let response = {
                                        status: true,
                                        shortUrl: shortUrl,
                                        email: data.email,
                                        message: 'user registered'
                                    };
                                    callback(null, response);
                                }
                            }
                        )
                    })
                    .catch(err => {
                        callback(err);
                    })
            }
            catch (error) {
                let response =
                {
                    success: false,
                    message: "server error",
                    error: error
                };
                callback(response);
            }
        } else {
            callback({ message: "invalid base url" })
        }
    }

    verifyUrl(req, callback) {
        
        userModel.update(
            { email: req.email },
            { isVerified: true },
            (err, result) => {
                if (err) {
                    callback(err);
                } else {

                    //verify_response_output
                    let response = {
                        status: true,
                        message: "user verified"
                    }
                    callback(null, response);
                }
            }
        )
    }
}

module.exports = new UrlService();