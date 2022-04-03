const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const MealSchema = new Schema({

  UserId: {
    type: Number
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
  }
});

module.exports = Meal = mongoose.model('Meal', MealSchema);