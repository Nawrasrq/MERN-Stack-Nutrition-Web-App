import React, { useState } from 'react';
import '../css/CombineFoodsPopup.css';

function CombineFoodsPopup(props)
{   
      const [message,setMessage] = useState('');
      const [newFoodName, setNewFoodName] = useState('');

      if (!props.show) {
        return null;
      }

      // No foods were selected to combine
      if (props.foodIds.size <= 0)
      {
        return(
            <div id="combineFoodsPopup">
                <div id="innerCombineFoodsPopup">
                    <span >No foods selected to combine.</span><br/>
                    <button type="button" id="closeCombineFoodsPopupButton" class="buttons" onClick={() => props.closePopup(setMessage, setNewFoodName)}> Close </button> <br />
                </div>
            </div>
        );
      }
    
      var foodName;

      // This function just resets the displayed message whenever the user starts typing again in any of the input text boxes.
      function clearMessage()
      {
        setMessage("");
      }

      async function doCombineFoods()
      {
          // Can't create food with empty name
          if (newFoodName.length <= 0)
          {
            setMessage("Please enter a name for your new food.")
            return;
          }

          let storage = require('../tokenStorage.js');

          // Get jwt token from local storage
          let tok = storage.retrieveToken();
          
          let _ud = localStorage.getItem('user_data');
          let ud = JSON.parse(_ud);
          let userId = ud.id;

          // Initialize all the nutrtition vars to 0
          let name = newFoodName;
          let calories = 0;
          let protein = 0;
          let carbs = 0;
          let fat = 0;
          let fiber = 0;
          let sugar = 0; 
          let sodium = 0;
          let cholesterol = 0;

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

          // Loop through all the foods currently displayed on the page
          // and add each food's nutrtional info to the running sums
          // if that food's checkbox was selected.
          for (let i = 0; i < foods.length; i++)
          {
              // Check to see if food was selected
              if (foodIds.has(foods[i]._id))
              {
                  calories += foods[i].Calories;
                  protein += foods[i].Protein;
                  carbs += foods[i].Carbs;
                  fat += foods[i].Fat;
                  fiber += foods[i].Fiber;
                  sugar += foods[i].Sugar;
                  sodium += foods[i].Sodium;
                  cholesterol += foods[i].Cholesterol;
              }
          }

          // Round nutrition values since addding some nutritional vlaues were giving really long
          // decimals for no reason (Rounding done to standards for nutritional info)
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

          var obj = { 
              UserId:userId, 
              Name:name, 
              Calories:calories, 
              Protein:protein, 
              Carbs:carbs, 
              Fat:fat, 
              Fiber:fiber, 
              Sugar:sugar, 
              Sodium:sodium, 
              Cholesterol:cholesterol,
              jwtToken:tok
            }; 

            var js = JSON.stringify(obj);
            try
            {    
                // Send off package to api and await response 
                var bp = require('./Path.js');
                const response = await fetch(bp.buildPath('api/addmeal'),{method:'POST', body:js, headers:{'Content-Type': 'application/json'}});
                var res = JSON.parse(await response.text());

                if (res.jwtToken === null)
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

                if( res.error )
                {
                    setMessage(res.error);
                }
                else
                {
                    props.closePopup(setMessage, setNewFoodName);
                }
            }
            catch(e)
            {
                alert(e.toString());
                return;
            }
      }

      function handleNameChange()
      {
          clearMessage();
          setNewFoodName(foodName.value);
      }

      return (
        <div id="combineFoodsPopup">
            <div id="innerCombineFoodsPopup">
                <input type="text" id="combinedFoodName" placeholder="New Food's Name" onInput={handleNameChange} ref={(c) => foodName = c} /><br />
                <span>Would you like to create the food "{newFoodName}"?</span><br/>
                <button type="button" id="combineFoodsButton" class="buttons" onClick={doCombineFoods}> Yes </button>
                <button type="button" id="closeCombineFoodsPopupButton" class="buttons" onClick={()=>props.closePopup(setMessage, setNewFoodName)}> No </button> <br />
                <span id="combineFoodsResult">{message}</span>
            </div>
        </div>
      );
  }
  export default CombineFoodsPopup;