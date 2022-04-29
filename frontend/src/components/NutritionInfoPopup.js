import React from 'react';
import '../css/NutritionInfoPopup.css';

export default class NutritionInfoPopup extends React.Component {
    render() {
      if (!this.props.show) {
        return null;
      }

      var food = this.props.food;
      var name, calories, protein, carbs, fat, fiber, sugar, sodium, cholesterol;
      var servingLabel, showServing;

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

      // Only given specified serving label from foods in external database
      if (food.ServingLabel)
      {
        servingLabel = "Serving Size: " + food.ServingLabel + "\ ";
        showServing = true;
      }
      else
      {
        servingLabel = "";
        showServing = false;
      }

      return (
        <div id="nutritionInfoPopup">
            <div id="innerNutritionInfoPopup">
                <span>Name: {name}</span><br/>
                <span>{servingLabel}</span>{showServing && <br/>}
                <span>Calories: {calories}</span><br/>
                <span>Protein: {protein}g</span><br/>
                <span>Carbohydrates: {carbs}g</span><br/>
                <span>Fat: {fat}g</span><br/>
                <span>Fiber: {fiber}g</span><br/>
                <span>Sugar: {sugar}g</span><br/>
                <span>Sodium: {sodium}mg</span><br/>
                <span>Cholesterol: {cholesterol}mg</span><br/>
                <button type="button" id="closeNutritionInfoPopupButton" class="buttons" onClick={this.props.closePopup}> Close </button>
            </div>
        </div>
      );
    }
  }