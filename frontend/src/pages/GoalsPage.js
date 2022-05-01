import React from 'react'
import NavigationBar from '../components/NavigationBar.js';
import GoalsDisplay from '../components/GoalsDisplay.js';

function GoalsPage() 
{

  function goToEditGoals()
  {
    window.location.href = '/Progress/Goals/EditGoals';
  }

  return (
    <div>
        <NavigationBar />
        <GoalsDisplay />
        <button type="button" id="editGoalsButton" class="buttons" onClick={goToEditGoals}> Edit Goals </button>
    </div>
  )
}

export default GoalsPage;