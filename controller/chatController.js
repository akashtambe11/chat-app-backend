const chatService = require('../services/chatService');

class ChatController {

    sendMessage(req, res) {

        try {
            let messageData = {
                senderId: req.body.senderId,
                senderName: req.body.senderName,
                receiverId: req.body.receiverId,
                receiverName: req.body.receiverName,
                message: req.body.message
            },
                response = {};

            chatService.sendMessage(messageData, (err, data) => {
                if (err) {
                    response.success = false;
                    response.error = err;
                    res.status(422).send(response);
                }
                else {
                    response.success = true;
                    response.content = data;
                    res.status(200).send(response);
                }
            });
        }
        catch (err) {
            return err;
        }
    }


    getMessage(req, res) {

        try {
            let response = {};

            chatService.getMessage(req, (err, data) => {
                if (err) {
                    response.success = false;
                    response.error = err;
                    res.status(422).send(response);
                }
                else {
                    response.success = true;
                    response.result = data;
                    res.status(200).send(response);
                }
            });
        }
        catch (err) {
            return err;
        }
    }

}

module.exports = new ChatController();