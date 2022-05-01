import React, { useState, useEffect, useRef } from 'react';

function useOutsideAlerter(ref, updateQuantity) 
{
    useEffect(() => {
      //Alert if clicked on outside of edit quantity text box
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          updateQuantity(ref.current.value);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
}

function ListTrackedFoods(props)
{
    const [editFoodId, setEditFoodId] = useState(-1);    
    const wrapperRef = useRef(null);

    useOutsideAlerter(wrapperRef, doUpdateQuantity);

    async function doUpdateQuantity(inputQty)
    {
        console.log(editFoodId);
        // Invalid quanitity so don't do anything
        if (inputQty <= 0)
            return;

        let _ud = localStorage.getItem('user_data');
        let ud = JSON.parse(_ud);
        let userId = ud.id;

        // Get jwt token from local storage
        var storage = require('../tokenStorage.js');
        var tok = storage.retrieveToken();

        let food = null;
        for (let i = 0; i < props.foods.length; i++)
        {
            console.log(editFoodId);
            if (editFoodId === props.foods[i]._id)
            {
                food = props.foods[i];
            }
        }

        //setEditFoodId(-1);

        // Just in case
        if (food === null)
        {
            console.log("In here");
            return;
        }

        // create object from text boxes and make JSON 
        var obj = {
            UserId:userId,
            MealId:food.MealId,
            Name:food.Name, 
            Calories:food.Calories, 
            Protein:food.Protein, 
            Carbs:food.Carbs, 
            Fat:food.Fat, 
            Fiber:food.Fiber, 
            Sugar:food.Sugar, 
            Sodium:food.Sodium, 
            Cholesterol:food.Cholesterol,
            Category:food.Category,
            Quantity:inputQty,
            Date:food.Date, 
            jwtToken:tok
        }
        var js = JSON.stringify(obj);

        try
        {   
            console.log(obj);
            // Send off package to api and await response 
            var bp = require('./Path.js');
            const response = await fetch(bp.buildPath('api/trackmeal/'),{method:'POST', body:js, headers:{'Content-Type': 'application/json'}});
            var res = JSON.parse(await response.text());

            if (!res.jwtToken)
            {
                //setMessage(res.error);
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
                //setMessage(res.error);
                console.log("fail");
            }
            else
            {
                //setMessage('Successfully Added ' + quantity + ' \"' + name + '\"s to your daily list of tracked foods.');
                console.log("Sucesss");
            }
        }
        catch(e)
        {
            console.log(e.toString());
            return;
        }
    }

    function handleOpeningInput(id)
    {
        setEditFoodId(id);
        console.log(editFoodId);
    }

    // Prevents negative values from being typed in
    const preventInvalid = (e) => {
        if (e.code === 'Minus') {
            e.preventDefault();
        }
    };

    // Simply just displays all the foods retrieved in a nice list format
    return(
        <div>
            <ul>
                {props.foods.map(food => (
                    <li key={food._id}>
                        <span>{food.Name} | Qty: </span>
                        {(editFoodId !== food._id) ? <span onClick={() => handleOpeningInput(food._id)}> {food.Quantity} </span> 
                                            : <input type="number" placeholder={food.Quantity} defaultValue={food.Quantity} min="0" onKeyPress={preventInvalid} ref={wrapperRef}></input>}
                        <span> | Calories: {food.Quantity * food.Calories}</span><br/>
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default ListTrackedFoods;