const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection(process.env.MONGODB_URI);

autoIncrement.initialize(connection);

// Create Schema
const GoalSchema = new Schema({
  UserId: {
    type: Number
  },
  Name: {
    type: String,
    required: true
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

GoalSchema.plugin(autoIncrement.plugin, {model: 'Goal', field: 'UserId'});
module.exports = Goal = mongoose.model('Meal', GoalSchema);