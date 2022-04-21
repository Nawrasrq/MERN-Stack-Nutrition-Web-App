import React, { useState } from 'react';
import '../css/EditNutritionInfoPopup.css';

function EditNutritionInfoPopup(props)
{   
    const [message,setMessage] = useState('');
    const [didEditFood, setDidEditFood] = useState(false);

      if (!props.show) {
        return null;
      }
    
      var food = props.food;
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

      // This function just resets the displayed message whenever the user starts typing again in any of the input text boxes.
      function clearMessage()
      {
        setMessage("");
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
                setDidEditFood(true);
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
                <span>Name: </span><input type="text" defaultValue={name} onInput={clearMessage} ref={(c) => name = c} /> <br />
                <span>Calories: </span><input type="number" defaultValue={calories} onInput={clearMessage} ref={(c) => calories = c} /> <br />
                <span>Protein: </span><input type="number" defaultValue={protein} onInput={clearMessage} ref={(c) => protein = c} /> <br />
                <span>Carbohydrates: </span><input type="number" defaultValue={carbs} onInput={clearMessage} ref={(c) => carbs = c} /> <br />
                <span>Fat: </span><input type="number" defaultValue={fat} onInput={clearMessage} ref={(c) => fat = c} /> <br />
                <span>Fiber: </span><input type="number" defaultValue={fiber} onInput={clearMessage} ref={(c) => fiber = c} /> <br />
                <span>Sugar: </span><input type="number" defaultValue={sugar} onInput={clearMessage} ref={(c) => sugar = c} /> <br />
                <span>Sodium: </span><input type="number" defaultValue={sodium} onInput={clearMessage} ref={(c) => sodium = c} /> <br />
                <span>Cholesterol: </span><input type="number" defaultValue={cholesterol} onInput={clearMessage} ref={(c) => cholesterol = c} /> <br />
                <button type="button" id="editNutritionInfoButton" class="buttons" onClick={doEditNutritionInfo}> Edit Nutrition Info </button>
                <button type="button" id="closeEditNutritionInfoPopupButton" class="buttons" onClick={()=>props.closePopup(didEditFood, setDidEditFood, setMessage)}> Close Edit Nutrition Info </button> <br />
                <span id="editNutritionInfoResult">{message}</span>
            </div>
        </div>
      );
  }
  export default EditNutritionInfoPopup;