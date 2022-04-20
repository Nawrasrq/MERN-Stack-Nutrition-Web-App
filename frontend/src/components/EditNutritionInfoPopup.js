import React from 'react';
import '../css/EditNutritionInfoPopup.css';

export default class EditNutritionInfoPopup extends React.Component {
    render() {
      if (!this.props.show) {
        return null;
      }

      var message = "";

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

      function setMessage(msg)
      {
          message = msg;
      }

      async function doEditNutritionInfo()
      {
        // Get jwt token from local storage
        var storage = require('../tokenStorage.js');
        var tok = storage.retrieveToken();

        // create object from text boxes and make JSON 
        var obj = {
            Name:name.value, 
            Calories:calories.value, 
            Protein:protein.value, 
            Carbs:carbs.value, 
            Fat:fat.value, 
            Fiber:fiber.value, 
            Sugar:sugar.value, 
            Sodium:sodium.value, 
            Cholesterol:cholesterol.value, 
            jwtToken:tok
        }
        var js = JSON.stringify(obj);

        // Gets the food's unique id
        let pathRoute = food._id;

        try
        {   
            
            // Send off package to api and await response 
            var bp = require('./Path.js');
            const response = await fetch(bp.buildPath('api/editmeal/' + pathRoute),{method:'PUT', body:js, headers:{'Content-Type': 'application/json'}});
            var res = JSON.parse(await response.text());

            console.log(res);

            if (!res.jwtToken)
            {
                setMessage(res.error);
                return;
            }
            // Token was expired
            else if (res.jwtToken.length === 0)
            {
                alert("Your session has expired, please log in again.");
                localStorage.removeItem("user_data")
		        window.location.href = '/';
                return;
            }

            storage.storeToken(res.jwtToken);
            
            if(res.error.length > 0)
            {
                setMessage(res.error);
            }
            else
            {
                setMessage('Successfully edited '+ '\"' + res.meal.Name + '\"');
            }
        }
        catch(e)
        {
            console.log(e.toString());
            return;
        }
      }

      return (
        <div id="editNutritionInfoPopup">
            <div id="innerEditNutritionInfoPopup">
                <span>Name: </span><input type="text" defaultValue={name} ref={(c) => name = c} /> <br />
                <span>Calories: </span><input type="number" defaultValue={calories} ref={(c) => calories = c} /> <br />
                <span>Protein: </span><input type="number" defaultValue={protein} ref={(c) => protein = c} /> <br />
                <span>Carbohydrates: </span><input type="number" defaultValue={carbs} ref={(c) => carbs = c} /> <br />
                <span>Fat: </span><input type="number" defaultValue={fat} ref={(c) => fat = c} /> <br />
                <span>Fiber: </span><input type="number" defaultValue={fiber} ref={(c) => fiber = c} /> <br />
                <span>Sugar: </span><input type="number" defaultValue={sugar} ref={(c) => sugar = c} /> <br />
                <span>Sodium: </span><input type="number" defaultValue={sodium} ref={(c) => sodium = c} /> <br />
                <span>Cholesterol: </span><input type="number" defaultValue={cholesterol} ref={(c) => cholesterol = c} /> <br />
                <button type="button" id="editNutritionInfoButton" class="buttons" onClick={doEditNutritionInfo}> Edit Nutrition Info </button>
                <button type="button" id="closeEditNutritionInfoPopupButton" class="buttons" onClick={this.props.closePopup}> Close Edit Nutrition Info </button>
                <span id="editNutritionInfoResult">{message}</span>
            </div>
        </div>
      );
    }
  }