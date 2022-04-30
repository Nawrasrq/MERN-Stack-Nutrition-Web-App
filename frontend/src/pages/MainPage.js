import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import NavigationBar from '../components/NavigationBar';
import Logout from '../components/Logout';
import ListTrackedFoods from '../components/ListTrackedFoods';

function MainPage()
{
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Number of milliseconds in a day
    const msInDay = 86400000;

    function decrementDay()
    {     
        let newDate = new Date(selectedDate.valueOf() - msInDay);
        setSelectedDate(newDate);

    }
    
    function incrementDay()
    {
        let newDate = new Date(selectedDate.valueOf() + msInDay);

        // Don't let user quick double click past disabled restriction
        if(newDate > (new Date()))
        {
            newDate = new Date(selectedDate);
            setSelectedDate(newDate);
            return;
        }

        setSelectedDate(newDate);
    }

    return(
        <div >
            <NavigationBar />
            <Logout />
            <Button variant='primary' className='m-3' onClick={decrementDay} > Previous </Button>
            <span>{selectedDate.toDateString()}</span>
            <Button variant='primary' className='m-3' disabled={selectedDate.toLocaleDateString() === (new Date()).toLocaleDateString()} onClick={incrementDay} > Next </Button><br/>

            <ListTrackedFoods date={selectedDate} />

            <Button variant='primary' className='m-3' href="/Main/AddToDailyConsumption" > Add To Your Daily Consumption </Button>
        </div>
    );
};
export default MainPage;