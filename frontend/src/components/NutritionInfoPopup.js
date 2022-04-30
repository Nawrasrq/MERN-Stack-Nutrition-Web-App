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

      // Round nutrition values
      calories = Math.round(calories);
      sodium = Math.round(sodium);
      cholesterol = Math.round(cholesterol);
      if (carbs < 10)
          carbs = Math.round(carbs * 10) / 10;
      else
          carbs = Math.round(carbs);
      if (fat < 10)
          fat = Math.round(fat * 10) / 10;
      else
          fat = Math.round(fat);
      if (fiber < 10)
          fiber = Math.round(fiber * 10) / 10;
      else
          fiber = Math.round(fiber);
      if (protein < 10)
          protein = Math.round(protein * 10) / 10;
      else
          protein = Math.round(protein);
      if (sugar < 10)
          sugar = Math.round(sugar * 10) / 10;
      else
          sugar = Math.round(sugar);

      // Only given specified serving label from foods in external database
      if (food.ServingLabel)
      {
        servingLabel = "Serving Size: " + food.ServingLabel;
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