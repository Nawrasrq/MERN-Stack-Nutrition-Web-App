import React, { useState } from 'react';
import { Button, Card, Container, Form } from 'react-bootstrap';
import YourFood from './YourFood.js';
import UsdaFood from './UsdaFood.js';

function AddToDailyConsumption()
{
    const [displayYourFood, setDisplayYourFood] = useState(true);
    const [toggleString, setToggleString] = useState("Switch to Recommended Foods");

    // Flips the text on the button and the state of which database to search
    function switchSearchState()
    {
        // Changes text of toggle button on top
        if (!displayYourFood)
            setToggleString("Switch to Recommended Foods");
        else
            setToggleString("Switch to your Created Foods");
        
        setDisplayYourFood(!displayYourFood);
    }

    function goToCreateMealPage()
	{
		window.location.href = '/Main/AddToDailyConsumption/CreateMeal';
	}

    var style =
    {
        padding: '20px', 
        display: 'flex', 
        'textAlign':'center', 
        'justifyContent':'center', 
        'alignItems':'center',
        width: '100%'
    }
    
    return(
        <div>
            <Container className='' style={{padding: '20px', height: '100vh'}}>
                <Card  bg='dark' style={{padding: '15px', display: 'flex'}}>
                <Card.Header>Search for meals to add to your list of foods consumed today</Card.Header>
                <Button className='mx-auto mt-3' variant='success' id="switchSearchState"  onClick={switchSearchState}>{toggleString}</Button>
                
                <Card.Body style={style}>
                    {displayYourFood && <YourFood />}
                    {!displayYourFood && <UsdaFood />}
                </Card.Body>

                <Button className='mx-auto' variant='success' id="addMealButton" onClick={goToCreateMealPage}> Create Food </Button>
                </Card>
            </Container>
        </div>
    );
};
export default AddToDailyConsumption;