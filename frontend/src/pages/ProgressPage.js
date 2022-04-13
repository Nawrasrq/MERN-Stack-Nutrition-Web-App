import React from 'react';
import NavigationBar from '../components/NavigationBar';
import Logout from '../components/Logout';

function ProgressPage()
{
    function goToGoals()
	{
		window.location.href = '/Goals';
	}

    return(
        <div>
            <NavigationBar />
            <Logout />
			<button type="button" id="goalsButton" class="buttons" onClick={goToGoals}> Goals </button>
        </div>
    );
};

export default ProgressPage;