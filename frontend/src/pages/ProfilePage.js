import React from 'react';
import { Button, Container } from 'react-bootstrap';
import NavigationBar from '../components/NavigationBar';
import GoalsDisplay from '../components/GoalsDisplay';

function ProfilePage()
{
	return(
		<div>
			<NavigationBar />
			<GoalsDisplay />
			<Button className='m-3' variant="success" href="/Profile/EditGoals"> Set New Goals </Button>
		</div>
	);
};

export default ProfilePage;