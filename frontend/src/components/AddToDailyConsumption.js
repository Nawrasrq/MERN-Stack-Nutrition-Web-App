import React, { useState, useEffect } from 'react';
import NutritionInfoPopup from './NutritionInfoPopup.js';
import EditNutritionInfoPopup from './EditNutritionInfoPopup.js';

function AddToDailyConsumption()
{
    var searchText;

    const [foods, setFoods] = useState([]);
    const [nutritionInfoPopupState, setNutritionInfoPopupState] = useState(false);
    const [editNutritionInfoPopupState, setEditNutritionInfoPopupState] = useState(false);
    const [selectedFoodInfo, setSelectedFoodInfo] = useState({});

    function goToCreateMealPage()
	{
		window.location.href = '/CreateMeal';
	}

    // Sets value to true to display nutrition info of whatever food was selected
    function showInfoPopup(selectedFood)
    {
        setNutritionInfoPopupState(true);
        setSelectedFoodInfo(selectedFood);
    }

    // Sets value to true to display nutrition info of whatever food was selected for user to edit
    function showEditInfoPopup(selectedFood)
    {
        setEditNutritionInfoPopupState(true);
        setSelectedFoodInfo(selectedFood);
    }

    // Sets value to false to close nutrtion info popup
    function hideInfoPopup()
    {
        setNutritionInfoPopupState(false);
        setSelectedFoodInfo({});
    }

    // Sets value to false to close edit info popup
    function hideEditInfoPopup(didEditFood, setDidEditFood, setMessage)
    {
        // If any food's info was edited, need to refresh the list
        if (didEditFood)
        {
            doSearchFoods();
            setDidEditFood(false);
        }

        setMessage("");
        setEditNutritionInfoPopupState(false);
        setSelectedFoodInfo({});
    }

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
            var bp = require('./Path.js');
            const response = await fetch(bp.buildPath("api/filtersearch/" + routeEnd),{method:'GET', headers:{'Content-Type': 'application/json'}});
            var resText = await response.text();

            // No foods found so empty array to display
            if (resText === "No meal matching that name was found.")
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
            <input type="text" id="searchText" placeholder="Search Here" onKeyUp={doSearchFoods} ref={(c) => searchText = c} /><br />
            <ul>
                {foods.map(food => (
                    <li key={food._id}>
                        <span>{food.Name}</span>
                        <button type="button" id="viewNutritionInfoButton" class="buttons" onClick={() => showInfoPopup(food)}>View Nutrtion Info</button>
                        <button type="button" id="editNutritionInfoButton" class="buttons" onClick={() => showEditInfoPopup(food)}>Edit Nutrtion Info</button>
                    </li>
                ))}
            </ul>
            <NutritionInfoPopup show={nutritionInfoPopupState} food={selectedFoodInfo} closePopup={hideInfoPopup} />
            <EditNutritionInfoPopup show={editNutritionInfoPopupState} food={selectedFoodInfo} closePopup={hideEditInfoPopup} />
            <button type="button" id="addMealButton" class="buttons" onClick={goToCreateMealPage}> Create Meal </button>
        </div>
    );
};
export default AddToDailyConsumption;