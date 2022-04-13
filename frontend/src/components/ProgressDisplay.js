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

    const [message,setMessage] = useState('');

    const getData = async event => 
    {

        // create object from text boxes and make JSON 
        event.preventDefault();
        var obj = {
            UserId:userId
        }
        var js = JSON.stringify(obj);
        try
        { 
            // Send off package to api and await response 
            var bp = require('./Path.js');
            // THIS WILL CHANGE BECAUSE API ENDPOINT HAS NOT YET BEEN CREATED
            const response = await fetch(bp.buildPath('api/getgoal'),{method:'POST', body:js, headers:{'Content-Type': 'application/json'}});
            var res = JSON.parse(await response.text());
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
        <div id="displayProgressDiv">
            <span id="name">{firstName}'s Current Goals</span><br />
            <p> 
                Current Weight: {weight || 0} <br/>
            </p>
        </div>
    );
};

export default GoalsDisplay;
