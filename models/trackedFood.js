const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const TrackedFood = new Schema({
  UserId: {
    type: Number
  },
  MealId: {
    type: String
  },
  Catagory: {
    type: Number
  },
  Quantity: {
    type: Number
  },
  Date: {
    type: String
  }
  

});

module.exports = trackedFood = mongoose.model('trackedFood', TrackedFood);