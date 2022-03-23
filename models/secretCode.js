const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var connection = mongoose.createConnection(process.env.MONGODB_URI);

const secretCode = new Schema ({
    Email: {
      type: String,
      required: true,
    },
    Code: {
      type: String,
      required: true,
    },
    DateCreated: {
      type: Date,
      default: Date.now(),
      expires: 7200,
    }
  });

  module.exports = secretcode = mongoose.model('secretCode', secretCode);