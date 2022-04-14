import React, { useState } from 'react';

function GoalsDisplay() 
{
    // Initialize fields required for object, get user data, and create message variable
    var _ud = localStorage.getItem('user_data');
	var ud = JSON.parse(_ud);
    var userId = ud.id;
    var firstName = ud.firstName;
	var lastName = ud.lastName;

    var calories;
    var protein;
    var carbs;
    var fat;
    var fiber;
    var sugar; 
    var sodium;
    var cholesterol;
    const [message,setMessage] = useState('');

    const doDisplayGoals = async event => 
    {
        // create object from text boxes and make JSON 
        event.preventDefault();
        var obj = {

        }
        var js = JSON.stringify(obj);
        try
        {    
            // Send off package to api and await response 
            var bp = require('./Path.js');
            // THIS WILL CHANGE BECAUSE API ENDPOINT HAS NOT YET BEEN CREATED
            const response = await fetch(bp.buildPath('api/goals'),{method:'POST', body:js, headers:{'Content-Type': 'application/json'}});
            var res = JSON.parse(await response.text());
            
            // I'll make the error messages nicer later - Declan
            if( res.error )
            {
                setMessage(res.error);
            }
            else
            {
                setMessage('');
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
        <span id="name">{firstName}'s Current Goals</span><br />
        <p> 
            Long-term: <br/>
            Weight: {0} <br/>
            <br/>
            Daily: <br/>
            Calories: {0} <br/>
            Protein: {0}g <br/>
            Carbohydrates: {0}g <br/>
            Fat: {0}g <br/>
            Fiber: {0} <br/>
            Sugar: {0}g <br/>
            Sodium: {0} <br/>
            Cholesterol: {0}
        </p>
     </div>
  );
};

export default GoalsDisplay;
