import React from 'react';
import '../css/NutritionInfoPopup.css';

export default class NutritionInfoPopup extends React.Component {
    render() {
      if (!this.props.show) {
        return null;
      }

      var food = this.props.food;
      var name, calories, protein, carbs, fat, fiber, sugar, sodium, cholesterol;

      // Get all the nutritional values from the selected food
      name = food.Name;
      calories = food.Calories;
      protein = food.Protein;
      carbs = food.Carbs;
      fat = food.Fat;
      fiber = food.Fiber;
      sugar = food.Sugar;
      sodium = food.Sodium;
      cholesterol = food.Cholesterol;

      return (
        <div id="nutritionInfoPopup">
            <div id="innerNutritionInfoPopup">
                <span>Name: {name}</span><br/>
                <span>Calories: {calories}</span><br/>
                <span>Protein: {protein}</span><br/>
                <span>Carbohydrates: {carbs}</span><br/>
                <span>Fat: {fat}</span><br/>
                <span>Fiber: {fiber}</span><br/>
                <span>Sugar: {sugar}</span><br/>
                <span>Sodium: {sodium}</span><br/>
                <span>Cholesterol: {cholesterol}</span><br/>
                <button type="button" id="closeNutritionInfoPopupButton" class="buttons" onClick={this.props.closePopup}> Close Nutrition Info </button>
            </div>
        </div>
      );
    }
  }