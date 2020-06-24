const chatModel = require('../app/model/chatModel');
var userModel = require('../app/model/userModel');

class ChatService {
    sendMessage(req, callback) {
        try {
            chatModel.sendMessage(req, (err, data) => {
                if (err)
                    callback(err);
                else
                    callback(null, data);
            });
        }
        catch (err) {
            console.log("Error: ", err);
        }
    }


    getMessage(req, callback) {

        try {
            chatModel.getMessage(req, (err, data) => {
                if (err)
                    callback(err);
                else
                    callback(null, data);
            });
        }
        catch (err) {
            console.log("Error: ", err);
        }

    }
}
module.exports = new ChatService();