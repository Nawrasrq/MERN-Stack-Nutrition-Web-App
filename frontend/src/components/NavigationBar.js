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
            <span> --- </span>
            <button type="button" id="todayPageButton" class="buttons" onClick={goToMainPage}> Today </button>
            <span> --- </span>
            <button type="button" id="progressPageButton" class="buttons" onClick={goToProgressPage}> Progress </button>
            <span> --- </span>
            <button type="button" id="reportsPageButton" class="buttons" onClick={goToReportsPage}> Reports </button>
            <span> --- </span>
        </div>
    );
};

export default NavigationBar;