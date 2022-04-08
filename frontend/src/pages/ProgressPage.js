import React from 'react';
import ProgressPageTitle from '../components/ProgressPageTitle';
import NavigationBar from '../components/NavigationBar';

function ProgressPage()
{
    function goToGoals()
	{
		window.location.href = '/Goals';
	}

    return(
        <div>
            <ProgressPageTitle />
            <NavigationBar />
			<button type="button" id="goalsButton" class="buttons" onClick={goToGoals}> Goals </button>
        </div>
    );
};

export default ProgressPage;