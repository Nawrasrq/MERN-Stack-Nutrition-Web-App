const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var connection = mongoose.createConnection(process.env.MONGODB_URI);

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
      expires: 7200,
    }
  });

  module.exports = secretcode = mongoose.model('secretCode', secretCode);