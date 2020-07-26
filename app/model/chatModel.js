var mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    senderId: {
        type: String,
        required: true
    },

    receiverId: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    }
})

const Message = mongoose.model('message', messageSchema);

class ChatModel {

    sendMessage(req, callback) {

        try {
            const message = new Message({
                senderId: req.senderId,
                receiverId: req.receiverId,
                message: req.message
            })

            message.save((err, data) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null, data);
                }
            })
        }
        catch (err) {
            console.log('Error: ', err);
        }
    }

    getMessage(body, callback) {
        try {
            Message.find((err, data) => {
                if (err)
                    callback(err);
                else
                    callback(null, data);
            })
        }
        catch (err) {
            console.log("Error: ", err);
        }
    }
}

module.exports = new ChatModel();