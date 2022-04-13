import React from 'react';

function Logout()
{
	function doLogout() 
	{
		localStorage.removeItem("user_data");
		window.location.href = '/';
	};    

	return(
		<div id="logoutDiv">
			<button type="button" id="logoutButton" class="buttons" onClick={doLogout}> Log Out </button>
		</div>
	);
};

export default Logout;