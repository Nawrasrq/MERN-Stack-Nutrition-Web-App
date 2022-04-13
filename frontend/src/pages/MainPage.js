import React from 'react';
import NavigationBar from '../components/NavigationBar';
import Logout from '../components/Logout';

function MainPage()
{
    function goToAddConsumedFoodPage()
    {
        window.location.href = "/AddToDailyConsumption";
    }

    return(
        <div>
            <NavigationBar />
            <Logout />
            <button type="button" id="addConsumedFoodButton" class="buttons" onClick={goToAddConsumedFoodPage}> Add To Your Daily Consumption </button>
        </div>
    );
};

export default MainPage;