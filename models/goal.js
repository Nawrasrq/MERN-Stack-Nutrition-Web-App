const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const GoalSchema = new Schema({
  UserId: {
    type: Number
  },
  Weight: {
    type: Number
  },
  Calories: {
    type: Number
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
});

module.exports = Goal = mongoose.model('Goal', GoalSchema);