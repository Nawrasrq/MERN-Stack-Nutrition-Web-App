import React from 'react';
import Logout from '../components/Logout.js';
import AddMeal from '../components/AddMeal.js';

function CreateMealPage()
{

	function goBack()
	{
		window.location.href = "/Main/AddToDailyConsumption"
	}

	return(
	  	<div>
			<Logout />
			<button type="button" id="backButton" class="buttons" onClick={goBack}> Back </button>
			<AddMeal />
	  	</div>
	);
};
	
export default CreateMealPage;