import React, { useState } from 'react';

function GoalsDisplay() 
{
    // Initialize fields required for object, get user data, and create message variable
    var _ud = localStorage.getItem('user_data');
	var ud = JSON.parse(_ud);
    var userId = ud.id;
    var firstName = ud.firstName;
	var lastName = ud.lastName;

    var weight;
    var calories;
    var protein;
    var carbs;
    var fat;
    var fiber;
    var sugar; 
    var sodium;
    var cholesterol;
    const [message,setMessage] = useState('');

    // This function just resets the displayed message whenever the user starts typing again in any of the input text boxes.
    function clearMessage()
    {
        setMessage("");
    }

    const doEditGoals = async event => 
    {
        // create object from text boxes and make JSON 
        event.preventDefault();
        var obj = { 
            UserId:userId, 
            Calories:calories.value, 
            Protein:protein.value, 
            Carbs:carbs.value, 
            Fat:fat.value, 
            Fiber:fiber.value, 
            Sugar:sugar.value, 
            Sodium:sodium.value, 
            Cholesterol:cholesterol.value 
        }
        var js = JSON.stringify(obj);
        try
        {    
            // Send off package to api and await response 
            var bp = require('./Path.js');
            const response = await fetch(bp.buildPath('api/addgoal'),{method:'POST', body:js, headers:{'Content-Type': 'application/json'}});
            var res = JSON.parse(await response.text());
            
            // I'll make the error messages nicer later - Declan
            if( res.error )
            {
                setMessage(res.error);
            }
            else
            {
                setMessage('Successfully edited goals');
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
        <span> Edit Goals</span><br />
        <input type="number" id="weight" placeholder="Weight" onInput={clearMessage} ref={(c) => weight = c} /> <br />
        <input type="number" id="calories" placeholder="Calories" onInput={clearMessage} ref={(c) => calories = c} /> <br />
        <input type="number" id="protein" placeholder="Protein" onInput={clearMessage} ref={(c) => protein = c} /> <br />
        <input type="number" id="carbs" placeholder="Carbs" onInput={clearMessage} ref={(c) => carbs = c} /> <br />
        <input type="number" id="fat" placeholder="Fat" onInput={clearMessage} ref={(c) => fat = c} /> <br />
        <input type="number" id="fiber" placeholder="Fiber" onInput={clearMessage} ref={(c) => fiber = c} /> <br />
        <input type="number" id="sugar" placeholder="Sugar" onInput={clearMessage} ref={(c) => sugar = c} /> <br />
        <input type="number" id="sodium" placeholder="Sodium" onInput={clearMessage} ref={(c) => sodium = c} /> <br />
        <input type="number" id="cholesterol" placeholder="Cholesterol" onInput={clearMessage} ref={(c) => cholesterol = c} /> <br />
        <input type="submit" id="addMealButton" class="buttons" value = "Edit Goals" onClick={doEditGoals} /><br />
        <span id="addMealResult">{message}</span>
     </div>
  );
};

export default GoalsDisplay;
