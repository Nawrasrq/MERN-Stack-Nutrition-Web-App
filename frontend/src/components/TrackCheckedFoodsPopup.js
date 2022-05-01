import React, { useState } from 'react';
import '../css/TrackCheckedFoodsPopup.css';

function TrackCheckedFoodsPopup(props)
{   
      const [message,setMessage] = useState('');
      const [quantity,setQuantity] = useState(1);
      const [category,setCategory] = useState("0");

      if (!props.show) {
        return null;
      }

      // No foods were selected to track
      if (props.foodIds.size <= 0)
      {
        return(
            <div id="trackCheckedFoodsPopup">
                <div id="innerTrackCheckedFoodsPopup">
                    <span >No foods selected to track.</span><br/>
                    <button type="button" id="closeTrackCheckedFoodsPopupButton" class="buttons" onClick={() => props.closePopup(setMessage, setQuantity, setCategory)}> Close </button> <br />
                </div>
            </div>
        );
      }
    
      var _ud, ud, userId;
      var inputQty;

      var storage = require('../tokenStorage.js');
      
      _ud = localStorage.getItem('user_data');
	    ud = JSON.parse(_ud);
      userId = ud.id;

      // This function just resets the displayed message whenever the user starts typing again in any of the input text boxes.
      function clearMessage()
      {
        setMessage("");
      }

      async function trackFoods(categoryInt, date, tok)
      {
        let selectedFoods = [];
        let count = 0;

        let foodIds = props.foodIds;
        let foods;
        if (props.foods)
        {
            foods = props.foods;
        }
        else
        {
            let unconvertedFoods = props.unconvertedFoods;
            foods = [];

            // Loop through all the unconverted foods that were selected and convert them into our database's format.
            for (let i = 0; i < unconvertedFoods.length; i++)
            {
                if (foodIds.has("USDA" + unconvertedFoods[i].fdcId))
                {
                  foods.push(props.convertFood(unconvertedFoods[i]));
                }
            }
        }

        for (let i = 0; i < foods.length; i++)
        {
              // Check to see if food was selected
              if (foodIds.has(foods[i]._id))
              {
                  selectedFoods.push(foods[i]);
              }
        }
        

        for (let i = 0; i < selectedFoods.length; i++)
        {
            let food = selectedFoods[i];

            if (food)
            {
                // create object from text boxes and make JSON 
                var obj = {
                    UserId:userId,
                    MealId:food._id,
                    Name:food.Name, 
                    Calories:food.Calories, 
                    Protein:food.Protein, 
                    Carbs:food.Carbs, 
                    Fat:food.Fat, 
                    Fiber:food.Fiber, 
                    Sugar:food.Sugar, 
                    Sodium:food.Sodium, 
                    Cholesterol:food.Cholesterol,
                    Category:categoryInt,
                    Quantity:quantity,
                    Date:date, 
                    jwtToken:tok
                }
                var js = JSON.stringify(obj);

                try
                {   
                    // Send off package to api and await response 
                    var bp = require('./Path.js');
                    const response = await fetch(bp.buildPath('api/trackmeal/'),{method:'POST', body:js, headers:{'Content-Type': 'application/json'}});
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
                        console.log(res.error);
                    }
                    else
                    {
                        count += 1;
                    }
                }
                catch(e)
                {
                    console.log(e.toString());
                    return;
                }
            }
        }

        return count;
      }
      
      async function doTrackCheckedFoods()
      {
        // Can't add empty foods to tracked foods
        if (parseFloat(quantity) <= 0)
        {
            setMessage("Invalid quantity selected, please try again.")
            return;
        }

        // Get jwt token from local storage
        var tok = storage.retrieveToken();

        let date = new Date().toLocaleDateString()
        let categoryInt = parseInt(category);

        let successCount = await trackFoods(categoryInt, date, tok);

        // See how many of the selected foods were successfully added
        if (successCount === 1)
        {
            setMessage('Successfully added your selected food to your daily list of tracked foods with a serving size of ' 
                        + quantity + '.');
        }
        else
        {
            setMessage('Successfully added ' + successCount + ' of your selected foods to your daily list of tracked foods with a serving size of ' 
                        + quantity + ' for each added food.');
        }
      }

      // Changes nutrtiional values for food corresponding to the quantities being selected by the user
      function adjustNutritionalValues()
      {
          // If nothing is entered, default to 1
          if (inputQty.value.length === 0)
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
        <div id="trackCheckedFoodsPopup">
            <div id="innerTrackCheckedFoodsPopup">
                <span>Quantity for all foods selected: </span><input type="number" step="1" min="1" defaultValue="1" onInput={clearMessage} onKeyPress={preventInvalid} onChange={adjustNutritionalValues} ref={(c) => inputQty = c} /><br />
                <span>Choose meal (Optional):</span>
                <select id="categoryDropdown" onInput={clearMessage} onChange={(e) => setCategory(e.target.value)}>
                  <option value="0"></option>
                  <option value="1">Breakfast</option>
                  <option value="2">Lunch</option>
                  <option value="3">Dinner</option>
                  <option value="4">Snack</option>
                </select><br/>
                <button type="button" id="trackCheckedFoodsButton" class="buttons" onClick={doTrackCheckedFoods}> Track </button>
                <button type="button" id="closeTrackCheckedFoodsPopupButton" class="buttons" onClick={()=>props.closePopup(setMessage, setQuantity, setCategory)}> Close </button> <br />
                <span id="trackCheckedFoodsResult">{message}</span>
            </div>
        </div>
      );
  }
  export default TrackCheckedFoodsPopup;