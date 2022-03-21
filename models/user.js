const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection(process.env.MONGODB_URI);

autoIncrement.initialize(connection);

//Create Schema
const UserSchema = new Schema({
  UserId: {
    type: Number
  },
  FirstName: {
    type: String,
    required: true
  },
  LastName: {
    type: String,
    required: true
  },
  Login: {
    type: String,
    required: true
  },
  Password: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true
  },
  Birthday: {
    type: String,
    required: true
  },
  Verified: {
    type: Boolean,
    default: false
  }
});

const secretCode = new Schema ({
  email: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
    expires: 600,
  },
})

UserSchema.plugin(autoIncrement.plugin, {model: 'User', field: 'UserId'});
module.exports = user = mongoose.model('User', UserSchema);
