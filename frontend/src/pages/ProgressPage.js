import React from 'react';
import NavigationBar from '../components/NavigationBar';
import Logout from '../components/Logout';
import ProgressDisplay from '../components/ProgressDisplay';

function ProgressPage()
{
    function goToGoals()
	{
		window.location.href = '/Progress/Goals';
	}
    
    return(
        <div>
            <NavigationBar />
            <Logout />
            <ProgressDisplay />
			<button type="button" id="goalsButton" class="buttons" onClick={goToGoals}> Goals </button>
        </div>
    );
};

export default ProgressPage;