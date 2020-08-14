const bcrypt = require('bcryptjs');

let hashPassword = (req) => {

    return new Promise((resolve, reject) => {
        bcrypt.hash(req, 10) // 10:  Salt Round
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject(err);
            })
    })
}

let comparePassword = (req, data, callback) => {
    bcrypt.compare(req, data, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    })
}

module.exports = { hashPassword, comparePassword };