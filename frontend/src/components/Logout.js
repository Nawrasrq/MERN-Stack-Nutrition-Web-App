import React from 'react';
import { Button } from 'react-bootstrap';
import '../css/Logout.css';

function Logout()
{
	function doLogout() 
	{
		localStorage.removeItem("user_data");
		window.location.href = '/';
	};    

	return(
		<div id="logout">
			<Button variant='outline-danger' className="m-0" onClick={doLogout}> Log Out </Button>
		</div>
	);
};

export default Logout;