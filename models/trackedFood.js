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
  Name: {
    type: String,
    required: true
  },
  Calories: {
    type: Number,
    required: true
  },
  Protein: {
    type: Number
  },
  Carbs: {
    type: Number
  },
  Fat: {
    type: Number
  },
  Fiber: {
    type: Number
  },
  Sugar: {
    type: Number
  },
  Sodium: {
    type: Number
  },
  Cholesterol: {
    type: Number
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