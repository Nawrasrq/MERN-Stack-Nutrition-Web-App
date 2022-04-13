import React, { useState, useEffect } from 'react';

function AddToDailyConsumption()
{
    var searchText;

    const [foods, setFoods] = useState([]);

    function goToCreateMealPage()
	{
		window.location.href = '/CreateMeal';
	};

    async function doSearchFoods() 
    {
        let searchString;

        if (searchText == undefined || searchText == null)
        {
            searchString = "";
        }
        else
        {
            searchString = searchText.value;
        }

        var userData = JSON.parse(localStorage.getItem('user_data'));
        var userId = userData.id;

        // If search text is empty don't even pass it to the api
        let routeEnd;
        if (searchString.length == 0)
        {
            routeEnd = userId;
        }
        else 
        {
            routeEnd = userId + "/" + searchString;
        }

        try 
        {
            var bp = require('./Path.js');
            const response = await fetch(bp.buildPath("api/filtersearch/" + routeEnd),{method:'GET', headers:{'Content-Type': 'application/json'}});
            var resText = await response.text();

            // No foods found so empty array to display
            if (resText == "No meal matching that name was found.")
            {
                setFoods([]);
                return;
            }

            var res = JSON.parse(resText);

            // Update array with the new foods found from the search
            setFoods(res);
            return;
        }
        catch(e)
        {
            console.log(e.toString());
            return;
        } 
    }

    // Initialize list of foods on page
    useEffect(() => {
        doSearchFoods();
    }, []);
      

    return(
        <div>
            <span id="inner-title">Search for meals to add to you list of foods consumed today.</span><br />
            <input type="text" id="searchText" placeholder="Search Here" onKeyUp={doSearchFoods} ref={(c) => searchText = c} />
            <br />
            <ul>
                {foods.map(food => (
                    <li key={food._id}>
                        <span>{food.Name}</span>
                    </li>
                ))}
            </ul>
            <button type="button" id="addMealButton" class="buttons" onClick={goToCreateMealPage}> Create Meal </button>
        </div>
    );
};
export default AddToDailyConsumption;