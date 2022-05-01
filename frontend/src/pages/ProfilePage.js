import React from 'react';
import { Button, Container } from 'react-bootstrap';
import NavigationBar from '../components/NavigationBar';

function ReportsPage()
{
	return(
		<div>
			<NavigationBar />
			<Button className='m-3' variant="success" href="/Progress/EditGoals"> Set New Goals </Button>
		</div>
	);
};

export default ReportsPage;