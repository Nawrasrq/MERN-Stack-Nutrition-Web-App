import React from 'react';

function LoggedInName()
{
	var _ud = localStorage.getItem('user_data');
	var ud = JSON.parse(_ud);
	var userId = ud.id;
	var firstName = ud.firstName;
	var lastName = ud.lastName;

	const doLogout = event => 
	{
		event.preventDefault();
		localStorage.removeItem("user_data")
		window.location.href = '/';
	};    

	const goToAddMeal = event =>
	{
		event.preventDefault();
		window.location.href = '/AddMeal';
	};

	return(
		<div id="loggedInDiv">
			<span id="userName">Logged In As {firstName} {lastName}</span><br />
			<button type="button" id="logoutButton" class="buttons" onClick={doLogout}> Log Out </button><br />
			<button type="button" id="addMealButton" class="buttons" onClick={goToAddMeal}> Add Meal </button>
		</div>
	);
};

export default LoggedInName;