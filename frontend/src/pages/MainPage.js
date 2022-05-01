import React from 'react';
import { Button } from 'react-bootstrap';
import NavigationBar from '../components/NavigationBar';

function MainPage()
{
    return(
        <div >
            <NavigationBar />
            <Button variant='primary' className='m-3' href="/Main/AddToDailyConsumption" > Add To Your Daily Consumption </Button>
        </div>
    );
};

export default MainPage;