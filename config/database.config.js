var mongoose = require('mongoose');

class Database {
  constructor() {
    this.mongoose = mongoose;
    this.host = process.env.HOST;
    this.port = process.env.PORT;
    this.uri = process.env.MONGODB_URI || "mongodb://localhost:27017/caDB";
  }

  connect() {
    // Create the database connection 
    this.mongoose.connect(this.uri, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    this.monitor()
  }

  monitor() {
    // ALL CONNECTION EVENTS
    // When successfully connected to URL
    mongoose.connection.on('connected', function () {
      console.log('Connection open to: \n' + process.env.MONGODB_URI);
    });

    // If the connection throws an error
    mongoose.connection.on('error', function (err) {
      console.log('Mongoose default connection error: ' + err);
    });

    // When the connection is disconnected
    mongoose.connection.on('disconnected', function () {
      console.log('Connection has been disconnected');
    });
  }
}

module.exports = new Database();