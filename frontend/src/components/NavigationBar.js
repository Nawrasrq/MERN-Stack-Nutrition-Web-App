import React from 'react';

function NavigationBar()
{
    function goToMainPage()
    {
        try
        {                
            window.location.href = "/Main";
        }
        catch(e)
        {
            console.log(e.toString());
            return;
        }
    }

    function goToProgressPage()
    {
        try
        {                
            window.location.href = "/Progress";
        }
        catch(e)
        {
            console.log(e.toString());
            return;
        }
    }

    function goToReportsPage()
    {
        try
        {                
            window.location.href = "/Reports";
        }
        catch(e)
        {
            console.log(e.toString());
            return;
        }
    }

    return(
        <div>
            <button type="button" id="todayPageButton" class="buttons" onClick={goToMainPage}> Today </button>
            <button type="button" id="progressPageButton" class="buttons" onClick={goToProgressPage}> Progress </button>
            <button type="button" id="reportsPageButton" class="buttons" onClick={goToReportsPage}> Reports </button>
        </div>
    );
};

export default NavigationBar;