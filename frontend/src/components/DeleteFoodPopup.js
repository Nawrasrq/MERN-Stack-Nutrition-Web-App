import React from 'react';
import '../css/DeleteFoodPopup.css';

function DeleteFoodPopup(props)
{   
      if (!props.show) {
        return null;
      }
    
      // Get the food to be deleted and it's name
      var food = props.food;
      var name = food.Name;
      
      async function doDeleteFood()
      {
        // Get jwt token from local storage
        var storage = require('../tokenStorage.js');
        var tok = storage.retrieveToken();

        // create object from text boxes and make JSON 
        var obj = {
            jwtToken:tok
        }
        var js = JSON.stringify(obj);

        // Gets the food's unique id
        let pathRoute = food._id;

        try
        {   
            
            // Send off package to api and await response 
            var bp = require('./Path.js');
            const response = await fetch(bp.buildPath('api/deletemeal/' + pathRoute),{method:'DELETE', body:js, headers:{'Content-Type': 'application/json'}});
            var res = JSON.parse(await response.text());

            if (!res.jwtToken)
            {
                console.log(res.error);
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
                props.closePopup();
            }
        }
        catch(e)
        {
            console.log(e.toString());
            return;
        }
      }

      return (
        <div id="deleteFoodPopup">
            <div id="innerDeleteFoodPopup">
                <span>Are you sure you want to remove "</span><span>{name}</span><span>"?</span><br />
                <button type="button" id="yesDeleteButton" class="buttons" onClick={doDeleteFood}>Yes</button>
                <button type="button" id="noDeleteButton" class="buttons" onClick={props.closePopup}>No</button><br />
            </div>
        </div>
      );
  }
  export default DeleteFoodPopup;