import React from 'react';
import { Button } from 'react-bootstrap';
import NavigationBar from '../components/NavigationBar';
import Logout from '../components/Logout';

function MainPage()
{
    return(
        <div >
            <NavigationBar />
            <Logout />
            <Button variant='primary' className='m-3' href="/Main/AddToDailyConsumption" > Add To Your Daily Consumption </Button>
        </div>
    );
};

export default MainPage;