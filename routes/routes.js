const express = require('express');
const router = express.Router();
const userCtrl = require('../controller/userController');
const chatCtrl = require('../controller/chatController')
const auth = require('../auth/auth')

// Accessing methods from ../controller/user
router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.post('/forgot', userCtrl.forgot);
router.post('/reset/:token', auth.resetToken, userCtrl.reset);
router.post('/verify/:shortedUrl', auth.verificationToken, userCtrl.verifyMail);

router.get('/dashboard', auth.checkToken, userCtrl.getAllUsers);

// Accessing methods from ../controller/chat
router.post('/sendMessage', auth.checkToken, chatCtrl.sendMessage);
router.get('/getMessage', auth.checkToken, chatCtrl.getMessage);

// Configure routing Middleware
module.exports = router;

