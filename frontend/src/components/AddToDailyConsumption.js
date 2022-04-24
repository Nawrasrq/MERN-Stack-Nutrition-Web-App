import React, { useState, useEffect } from 'react';
import TrackFoodPopup from './TrackFoodPopup.js';
import NutritionInfoPopup from './NutritionInfoPopup.js';
import EditNutritionInfoPopup from './EditNutritionInfoPopup.js';
import DeleteFoodPopup from './DeleteFoodPopup.js';

// TODO:
// Extract all the nutrition info from the USDA database searches, right now we just do names
// Maybe capitalize the names of the foods so they look nicer in search

function AddToDailyConsumption()
{
    var searchText;

    const [foods, setFoods] = useState([]);
    const [trackFoodPopupState, setTrackFoodPopupState] = useState(false);
    const [nutritionInfoPopupState, setNutritionInfoPopupState] = useState(false);
    const [editNutritionInfoPopupState, setEditNutritionInfoPopupState] = useState(false);
    const [deleteFoodPopupState, setDeleteFoodPopupState] = useState(false);
    const [selectedFoodInfo, setSelectedFoodInfo] = useState({});

    const api_key = 'Qu6XqYJAL6VNG2ABuikfQizM7hXNKQjm5TfEOFGi';
    const [searchState, setSearchState] = useState('my Meals'); // Flips between user and USDA database

    // Flips the text on the button, it ain't pretty but it works
    function switchDatabase()
    {
        if(searchState == 'USDA') {setSearchState('my Meals');}
        else {setSearchState('USDA');}
    }

    function goToCreateMealPage()
	{
		window.location.href = '/CreateMeal';
	}

    // Sets value to true to open popup where that food's quantity can be set and then decided to be tracked
    function showTrackFoodPopup(selectedFood)
    {
        setTrackFoodPopupState(true);
        setSelectedFoodInfo(selectedFood);
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

    // Sets value to true to confirm if user really wants to delete this food from their list
    function showDeleteFoodPopup(selectedFood)
    {
        setDeleteFoodPopupState(true);
        setSelectedFoodInfo(selectedFood);
    }

    // Sets value to false to close track food popup
    function hideTrackFoodPopup(setMessage, setTrackQuantity)
    {
        setMessage("");
        setTrackQuantity(1);
        setTrackFoodPopupState(false);
        setSelectedFoodInfo({});
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

    function hideDeleteFoodPopup()
    {
        doSearchFoods();

        setDeleteFoodPopupState(false);
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
            // Basically just switches the database it's using depending on searchState
            if (searchState == 'my Meals')
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
            }
            else 
            {
                var html = 'https://api.nal.usda.gov/fdc/v1/foods/search?api_key=' + api_key + '&query=' + searchString + '&pageSize=20';
                const response = await fetch(html, {method:'GET', headers:{'Content-Type': 'application/json'}});
                var resText = await response.text();
                var res = JSON.parse(resText);
                res = res.foods
            }

            // Update array with the new foods found from the search
            setFoods(res);
            console.log(res);
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
            <button type="button" id="switchSearchState" class="buttons" onClick={() => switchDatabase()}>Search {searchState}:</button> <br />
            <input type="text" id="searchText" placeholder="Search Here" onKeyUp={doSearchFoods} ref={(c) => searchText = c} /><br />
            <ul>
                {foods.map(food => (
                    <li key={food._id || food.fdcId}>
                        <span>{food.Name || food.lowercaseDescription}</span>
                        <button type="button" id="addFoodToDailyConsumptionButton" class="buttons" onClick={() => showTrackFoodPopup(food)}> Add </button>
                        <button type="button" id="viewNutritionInfoButton" class="buttons" onClick={() => showInfoPopup(food)}> View </button>
                        <button type="button" id="editNutritionInfoButton" class="buttons" onClick={() => showEditInfoPopup(food)}>Edit </button>
                        <button type="button" id="deleteFoodButton" class="buttons" onClick={() => showDeleteFoodPopup(food)} >Delete </button>
                    </li>
                ))}
            </ul>
            <TrackFoodPopup show={trackFoodPopupState} food={selectedFoodInfo} closePopup={hideTrackFoodPopup} />
            <NutritionInfoPopup show={nutritionInfoPopupState} food={selectedFoodInfo} closePopup={hideInfoPopup} />
            <EditNutritionInfoPopup show={editNutritionInfoPopupState} food={selectedFoodInfo} closePopup={hideEditInfoPopup} />
            <DeleteFoodPopup show={deleteFoodPopupState} food={selectedFoodInfo} closePopup={hideDeleteFoodPopup} />
            <button type="button" id="addMealButton" class="buttons" onClick={goToCreateMealPage}> Create Meal </button>
        </div>
    );
};
export default AddToDailyConsumption;