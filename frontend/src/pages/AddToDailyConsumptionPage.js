import React from 'react';
import NavigationBar from '../components/NavigationBar.js';
import AddToDailyConsumption from '../components/AddToDailyConsumption.js';

function AddToDailyConsumptionPage()
{

    function goBack()
	{
		window.location.href = "/Main"
	}

    return(
        <div>
            <NavigationBar />
			<button type="button" id="backButton" class="buttons" onClick={goBack}> Back </button>
            <AddToDailyConsumption />
        </div>
    );
};

export default AddToDailyConsumptionPage;