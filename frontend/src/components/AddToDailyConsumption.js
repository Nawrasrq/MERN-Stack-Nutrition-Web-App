import React, { useState } from 'react';
import YourFood from './YourFood.js';
import UsdaFood from './UsdaFood.js';

function AddToDailyConsumption()
{
    const [displayYourFood, setDisplayYourFood] = useState(true);
    const [toggleString, setToggleString] = useState("Switch to Recommended Foods");

    // Flips the text on the button and the state of which database to search
    function switchSearchState()
    {
        // Changes text of toggle button on top
        if (!displayYourFood)
            setToggleString("Switch to Recommended Foods");
        else
            setToggleString("Switch to your Created Foods");
        
        setDisplayYourFood(!displayYourFood);
    }

    function goToCreateMealPage()
	{
		window.location.href = '/Main/AddToDailyConsumption/CreateMeal';
	}
      
    return(
        <div>
            <span id="inner-title">Search for meals to add to you list of foods consumed today.</span><br />
            <button type="button" id="switchSearchState" class="buttons" onClick={switchSearchState}>{toggleString}</button> <br />

            {displayYourFood && <YourFood />}
            {!displayYourFood && <UsdaFood />}

            <button type="button" id="addMealButton" class="buttons" onClick={goToCreateMealPage}> Create Meal </button>
        </div>
    );
};
export default AddToDailyConsumption;