import React from 'react';

function AddToDailyConsumption()
{
    function goToCreateMealPage()
	{
		window.location.href = '/CreateMeal';
	};

    return(
        <div>
            <button type="button" id="addMealButton" class="buttons" onClick={goToCreateMealPage}> Create Meal </button>
        </div>
    );
};
export default AddToDailyConsumption;