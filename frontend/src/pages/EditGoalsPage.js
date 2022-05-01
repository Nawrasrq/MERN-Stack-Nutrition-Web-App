import React from 'react'
import NavigationBar from '../components/NavigationBar.js';
import PageTitle from '../components/PageTitle.js';
import GoalsEdit from '../components/GoalsEdit.js';

function GoalsPage()
{

	function goBack()
	{
		window.location.href = "/Progress/Goals"
	}

	return (
		<div>
			<NavigationBar />
			<button type="button" id="backButton" class="buttons" onClick={goBack}> Back </button>
			<GoalsEdit />
		</div>
  	)
}

export default GoalsPage;
// THIS PAGE IS TEMPORARY FOR TESTING EDIT GOALS