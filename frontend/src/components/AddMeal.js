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
            
            // I'll make the error messages nicer later - Declan
            if( res.error )
            {
                setMessage(res.error);
            }
            else
            {
                setMessage('');
                storage.storeToken(res.jwtToken)
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
            <input type="text" id="foodName" placeholder="Food Name" ref={(c) => foodName = c} /> *<br />
            <input type="number" id="calories" placeholder="Calories" ref={(c) => calories = c} /> *<br />
            <input type="number" id="protein" placeholder="Protein" ref={(c) => protein = c} /><br />
            <input type="number" id="carbs" placeholder="Carbohydrates" ref={(c) => carbs = c} /><br />
            <input type="number" id="fat" placeholder="Fat" ref={(c) => fat = c} /><br />
            <input type="number" id="fiber" placeholder="Fiber" ref={(c) => fiber = c} /><br />
            <input type="number" id="sugar" placeholder="Sugar" ref={(c) => sugar = c} /><br />
            <input type="number" id="sodium" placeholder="Sodium" ref={(c) => sodium = c} /><br />
            <input type="number" id="cholesterol" placeholder="Cholesterol" ref={(c) => cholesterol = c} /><br />
            <input type="submit" id="addMealButton" class="buttons" value = "Add Meal" onClick={doAddMeal} /><br />
            <span id="addMealResult">{message}</span>
        </form>
     </div>
  );
};

export default AddMeal;
