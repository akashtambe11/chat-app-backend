require('dotenv').config();
const express = require('express');
const app = express();

const server = require('http').createServer(app);
var io = require('socket.io').listen(server);

const expressValidator = require('express-validator')
const morgan = require('morgan');
const bodyParser = require('body-parser');
const database = require('./config/database.config')
const route = require('./routes/routes');
const cors = require('cors');
const port = process.env.PORT || 3000;

const chatController = require('./controller/chatController')

// To get Methods logs in console 
app.use(morgan('dev'));
// Parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// To connect Node js and Client site application (Diff Port) together for communication
// Cross-Origin Resource Sharing
app.use(cors(
  {
    'origin': '*'
  }
));

// Middleware
// Parse requests of content-type - application/json
app.use(bodyParser.json());
app.use(expressValidator());

app.use('/', route);

// Simple Route Demo
app.get('/', (req, res) => {
  res.send("Hello from CHAT APP");
});

// // Socket Connection
// var io = socket(server);
io.on('connection', (socket) => {
  console.log('User Connected');

  socket.on('disconnect', () => {
    console.log('User Disconnected');
  });

  socket.on('send', (message) => {
    io.emit('receive message', message);
  })

});

// Listen for server request
server.listen(port, () => {
  database.connect();
  console.log("Server is running on Port: " + port);
});




