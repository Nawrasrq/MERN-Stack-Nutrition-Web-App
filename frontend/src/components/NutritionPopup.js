import React from 'react';
import '../css/NutritionPopup.css';

export default class NutritionPopup extends React.Component {
    render() {
      if (!this.props.show) {
        return null;
      }

      var food = this.props.food;
      var calories, protein, carbs, fat, fiber, sugar, sodium, cholesterol;

      // Get all the nutritional values from the selected food
      calories = food.Calories;
      protein = food.Protein;
      carbs = food.Carbs;
      fat = food.Fat;
      fiber = food.Fiber;
      sugar = food.Sugar;
      sodium = food.Sodium;
      cholesterol = food.Cholesterol;

      return (
        <div id="nutritionPopup">
            <div id="innerNutritionPopup">
                <span>Calories: {calories}</span><br/>
                <span>Protein: {protein}</span><br/>
                <span>Carbohydrates: {carbs}</span><br/>
                <span>Fat: {fat}</span><br/>
                <span>Fiber: {fiber}</span><br/>
                <span>Sugar: {sugar}</span><br/>
                <span>Sodium: {sodium}</span><br/>
                <span>Cholesterol: {cholesterol}</span><br/>
                <button type="button" id="closeNutritionPopupButton" class="buttons" onClick={this.props.closePopup}> Close Nutrition Info </button>
            </div>
        </div>
      );
    }
  }