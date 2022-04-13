import React from 'react'
import Logout from '../components/Logout.js';
import GoalsDisplay from '../components/GoalsDisplay.js';

function GoalsPage() 
{
  return (
    <div>
        <Logout />
        <GoalsDisplay />
    </div>
  )
}

export default GoalsPage;