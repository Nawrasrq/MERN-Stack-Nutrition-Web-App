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

	const goToGoals = event =>
	{
		event.preventDefault();
		window.location.href = '/Goals';
	}

	return(
		<div id="loggedInDiv">
			<span id="userName">Hello {firstName} {lastName}, I'm watching you</span><br /><br />
			<button type="button" id="logoutButton" class="buttons" onClick={doLogout}> Log Out </button><br /><br />
			
			<span>|--</span>
			<button type="button" id="addMealButton" class="buttons" onClick={goToAddMeal}> Add Meal </button>
			<span>--|--</span>
			<button type="button" id="goalsButton" class="buttons" onClick={goToGoals}> Goals </button>
			<span>--|</span>
		</div>
	);
};

export default LoggedInName;