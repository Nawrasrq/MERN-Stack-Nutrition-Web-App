import React, { useState } from 'react';

function AddMeal() 
{
    // Initialize fields required for object, get user data, and create message variable
    var _ud = localStorage.getItem('user_data');
	var ud = JSON.parse(_ud);
    var userId = ud.id;
    var foodName;
    var calories;
    var protein;
    var carbs;
    var fat;
    var fiber;
    var sugar; 
    var sodium;
    var cholesterol;
    const [message,setMessage] = useState('');

    var storage = require('../tokenStorage.js');

    // This function just resets the displayed message whenever the user starts typing again in any of the input text boxes.
    function clearMessage()
    {
        setMessage("");
    }

    const doAddMeal = async event => 
    {
        // create object from text boxes and make JSON 
        event.preventDefault();

        var tok = storage.retrieveToken();

        var obj = { UserId:userId, 
                    Name:foodName.value, 
                    Calories:calories.value, 
                    Protein:(protein.value || 0), 
                    Carbs:(carbs.value || 0), 
                    Fat:(fat.value || 0), 
                    Fiber:(fiber.value || 0), 
                    Sugar:(sugar.value || 0), 
                    Sodium:(sodium.value || 0), 
                    Cholesterol:(cholesterol.value || 0),
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

            // I'll make the error messages nicer later - Declan
            if( res.error )
            {
                setMessage(res.error);
            }
            else
            {
                setMessage("\"" + foodName.value + "\"" + " successfully added to your list of foods.");
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }
    };

  return (
    <div id="addMealDiv">
        <form onSubmit={doAddMeal}>
            <span id="inner-title">Add Meal (required fields indicated by *)</span><br />
            <input type="text" id="foodName" placeholder="Food Name" onKeyUp={clearMessage} ref={(c) => foodName = c} /> *<br />
            <input type="number" id="calories" placeholder="Calories" onKeyUp={clearMessage} ref={(c) => calories = c} /> *<br />
            <input type="number" id="protein" placeholder="Protein" onKeyUp={clearMessage} ref={(c) => protein = c} /><br />
            <input type="number" id="carbs" placeholder="Carbohydrates" onKeyUp={clearMessage} ref={(c) => carbs = c} /><br />
            <input type="number" id="fat" placeholder="Fat" onKeyUp={clearMessage} ref={(c) => fat = c} /><br />
            <input type="number" id="fiber" placeholder="Fiber" onKeyUp={clearMessage} ref={(c) => fiber = c} /><br />
            <input type="number" id="sugar" placeholder="Sugar" onKeyUp={clearMessage} ref={(c) => sugar = c} /><br />
            <input type="number" id="sodium" placeholder="Sodium" onKeyUp={clearMessage} ref={(c) => sodium = c} /><br />
            <input type="number" id="cholesterol" placeholder="Cholesterol" onKeyUp={clearMessage} ref={(c) => cholesterol = c} /><br />
            <input type="submit" id="addMealButton" class="buttons" value = "Add Meal" onClick={doAddMeal} /><br />
            <span id="addMealResult">{message}</span>
        </form>
     </div>
  );
};

export default AddMeal;
