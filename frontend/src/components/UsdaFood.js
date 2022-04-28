import React, { useState, useEffect } from 'react';


// TODO:
// Extract all the nutrition info from the USDA database searches, right now we just do names
// Maybe capitalize the names of the foods so they look nicer in search

// TODO:
// Add button operations for all the usda foods

function UsdaFood()
{
    var searchText;

    const [foods, setFoods] = useState([]);   
    const api_key = 'Qu6XqYJAL6VNG2ABuikfQizM7hXNKQjm5TfEOFGi';

    async function doSearchFoods() 
    {
        let searchString;

        // Default to empty search
        if (searchText === undefined || searchText === null)
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
        if (searchString.length === 0)
        {
            routeEnd = userId;
        }
        else 
        {
            routeEnd = userId + "/" + searchString;
        }

        try 
        {
            var html = 'https://api.nal.usda.gov/fdc/v1/foods/search?api_key=' + api_key + '&query=' + searchString + '&pageSize=20';
            const response = await fetch(html, {method:'GET', headers:{'Content-Type': 'application/json'}});
            var resText = await response.text();
            var res = JSON.parse(resText);
            res = res.foods

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
            <input type="text" id="searchText" placeholder="Search Here" onKeyUp={doSearchFoods} ref={(c) => searchText = c} /><br />

            <ul>
                {foods.map(food => (
                    <li key={food.fdcId}>
                        <span>{food.lowercaseDescription}</span>
                        <button type="button" id="addFoodToDailyConsumptionButton" class="buttons" > Add </button>
                        <button type="button" id="viewNutritionInfoButton" class="buttons" > View </button>
                    </li>
                ))}
            </ul>    
        </div>
    );
};
export default UsdaFood;