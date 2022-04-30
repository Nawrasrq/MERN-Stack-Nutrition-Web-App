import React from 'react';
import { Button } from 'react-bootstrap';
import NavigationBar from '../components/NavigationBar';
import Logout from '../components/Logout';
import ProgressDisplay from '../components/ProgressDisplay';

function ProgressPage()
{   
    return(
        <div>
            <NavigationBar />
            <Logout />
            <ProgressDisplay />
			<Button variant="primary" href="/Progress/Goals"> Goals </Button>
        </div>
    );
};

export default ProgressPage;