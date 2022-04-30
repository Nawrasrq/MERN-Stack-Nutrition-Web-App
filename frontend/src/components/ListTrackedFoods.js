import React, { useState, useEffect } from 'react';

function ListTrackedFoods(props)
{
    const [foods, setFoods] = new useState([]);
    const [message, setMessage] = new useState('');
    const [storedDate, setStoredDate] = new useState(null);

    async function doRetrieveTrackedFoods()
    {
        let _ud = localStorage.getItem('user_data');
        let ud = JSON.parse(_ud);
        let userId = ud.id;

        // Get jwt token from local storage
        let storage = require('../tokenStorage.js');
        let tok = storage.retrieveToken();

        let date = props.date.toLocaleDateString();

        var obj = {
            UserId:userId,
            jwtToken:tok,
            Date:date
        }

        var js = JSON.stringify(obj);
        try
        {     
            // Send off package to api and await response 
            var bp = require('./Path.js');
            const response = await fetch(bp.buildPath('api/retrievetracked/'),{method:'POST', body:js, headers:{'Content-Type': 'application/json'}});
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
            
            if (res.error.length > 0)
            {
                setMessage(res.error);
                setFoods([]);
            }
            else
            {
                setFoods(res.trackedFoods);
            }
        }
        catch(e)
        {
            console.log(e.toString());
            return;
        }
    }

    // Initialize list of tracked foods for this date and only
    // retrieve foods again if date has changed (prevents infinite re-render loop)
    if (props.date.toLocaleDateString() !== storedDate)
    {
        setMessage("");
        setStoredDate(props.date.toLocaleDateString());
        doRetrieveTrackedFoods();
    }

    return(
        <div>
            <span>{message}</span>
            <ul>
                {foods.map(food => (
                    <li key={food._id}>
                        <span>{food.MealId}</span>
                        <span> Quantity:{food.Quantity}</span><br/>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListTrackedFoods;