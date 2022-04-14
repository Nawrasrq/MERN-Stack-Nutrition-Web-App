import React from 'react';
import Logout from '../components/Logout.js';
import AddToDailyConsumption from '../components/AddToDailyConsumption.js';

function AddToDailyConsumptionPage()
{

    function goBack()
	{
		window.location.href = "/Main"
	}

    return(
        <div>
            <Logout />
			<button type="button" id="backButton" class="buttons" onClick={goBack}> Back </button>
            <AddToDailyConsumption />
        </div>
    );
};

export default AddToDailyConsumptionPage;