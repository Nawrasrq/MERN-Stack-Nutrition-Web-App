const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const WeightSchema = new Schema({
  UserId: {
    type: Number
  },
  Weight:{
      type: Number
  },
  Date: {
    type: String
  }

});

module.exports = user = mongoose.model('Weight', WeightSchema);
