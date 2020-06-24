var mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    senderId: {
        type: String,
        required: true
    },
    senderName: {
        type: String,
        required: true
    },
    receiverId: {
        type: String,
        required: true
    },
    receiverName: {
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
                senderName: req.senderName,
                receiverId: req.receiverId,
                receiverName: req.receiverName,
                message: req.message
            })

            message.save((err, data) => {
                if (err) {
                    callback(err);
                } else {
                    console.log("Message Sent \nTo:   " + data.receiverName + "\nFrom: " + data.senderName);

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