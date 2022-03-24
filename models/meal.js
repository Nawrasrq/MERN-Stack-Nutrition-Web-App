const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection(process.env.MONGODB_URI);

autoIncrement.initialize(connection);

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

MealSchema.plugin(autoIncrement.plugin, {model: 'Meal', field: 'UserId'});
MealSchema.plugin(autoIncrement.plugin, {model: 'Meal', field: 'Id'});
module.exports = Meal = mongoose.model('Meal', MealSchema);