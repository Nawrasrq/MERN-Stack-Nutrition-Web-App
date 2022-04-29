import React, { useState, useEffect } from 'react';
import TrackFoodPopup from './TrackFoodPopup.js';
import NutritionInfoPopup from './NutritionInfoPopup.js';
import EditNutritionInfoPopup from './EditNutritionInfoPopup.js';
import DeleteFoodPopup from './DeleteFoodPopup.js';

function YourFood()
{
    var searchText;

    const [foods, setFoods] = useState([]);
    const [trackFoodPopupState, setTrackFoodPopupState] = useState(false);
    const [nutritionInfoPopupState, setNutritionInfoPopupState] = useState(false);
    const [editNutritionInfoPopupState, setEditNutritionInfoPopupState] = useState(false);
    const [deleteFoodPopupState, setDeleteFoodPopupState] = useState(false);
    const [selectedFoodInfo, setSelectedFoodInfo] = useState({});

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
    function hideTrackFoodPopup(setMessage, setTrackQuantity, setCategory)
    {
        setMessage("");
        setTrackQuantity(1);
        setCategory("0");
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
            <input type="text" id="searchText" placeholder="Search Here" onKeyUp={doSearchFoods} ref={(c) => searchText = c} /><br />

            <ul>
                {foods.map(food => (
                    <li key={food._id}>
                        <span>{food.Name}</span>
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
        </div>
    );
};
export default YourFood;