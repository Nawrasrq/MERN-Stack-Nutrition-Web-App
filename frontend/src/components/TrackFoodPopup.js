import React, { useState } from 'react';
import '../css/TrackFoodPopup.css';

function TrackFoodPopup(props)
{   
      const [message,setMessage] = useState('');
      const [quantity,setQuantity] = useState(1);

      if (!props.show) {
        return null;
      }
    
      var food = props.food;
      var inputQty;
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
        servingLabel = "Serving Size: " + food.ServingLabel;
        showServing = true;
      }
      else
      {
        servingLabel = "";
        showServing = false;
      }

      // This function just resets the displayed message whenever the user starts typing again in any of the input text boxes.
      function clearMessage()
      {
        setMessage("");
      }
      
      async function doTrackFood()
      {
        // Can't add empty food to tracked foods
        if (parseInt(quantity) <= 0)
        {
            setMessage("Invalid quantity selected, please try again.")
            return;
        }

        // Get jwt token from local storage
        var storage = require('../tokenStorage.js');
        var tok = storage.retrieveToken();

        return;

        // TODO: REST OF FUNCTION STILL NEEDS TO BE WRITTEN

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
            }
        }
        catch(e)
        {
            console.log(e.toString());
            return;
        }
      }

      // Changes nutrtiional values for food corresponding to the quantities being selected by the user
      function adjustNutritionalValues()
      {
          // If nothing is entered, default to 1
          if (inputQty.value.length == 0)
          {
            setQuantity(1);
          }
          else 
          {
            setQuantity(parseFloat(inputQty.value));
          }
      }

      // Prevents negative values from being typed in
      const preventInvalid = (e) => {
        if (e.code === 'Minus') {
            e.preventDefault();
        }
      };

      return (
        <div id="trackFoodPopup">
            <div id="innerTrackFoodPopup">
                <span>{name}</span><br/>
                <span>Calories: {calories * quantity}</span><br/>
                <span>Protein: {protein * quantity}</span><br/>
                <span>Carbohydrates: {carbs * quantity}</span><br/>
                <span>Fat: {fat * quantity}</span><br/>
                <span>Fiber: {fiber * quantity}</span><br/>
                <span>Sugar: {sugar * quantity}</span><br/>
                <span>Sodium: {sodium * quantity}</span><br/>
                <span>Cholesterol: {cholesterol * quantity}</span><br/>
                <span>Quantity: </span><input type="number" step="1" min="1" defaultValue="1" onInput={clearMessage} onKeyPress={preventInvalid} onChange={adjustNutritionalValues} ref={(c) => inputQty = c} /><br />
                <span>{servingLabel}</span>{showServing && <br/>}
                <button type="button" id="trackFoodButton" class="buttons" onClick={doTrackFood}> Track </button>
                <button type="button" id="closeTrackFoodPopupButton" class="buttons" onClick={()=>props.closePopup(setMessage, setQuantity)}> Close </button> <br />
                <span id="trackFoodResult">{message}</span>
            </div>
        </div>
      );
  }
  export default TrackFoodPopup;