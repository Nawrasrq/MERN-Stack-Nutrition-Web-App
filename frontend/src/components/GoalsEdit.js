import React, { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import '../css/LoginPage.css';

function GoalsDisplay() 
{
    // Initialize fields required for object, get user data, and create message variable
    var _ud = localStorage.getItem('user_data');
	var ud = JSON.parse(_ud);
    var userId = ud.id;
    var firstName = ud.firstName;
	var lastName = ud.lastName;

    var storage = require('../tokenStorage.js');
    var tok = storage.retrieveToken();

    var weight;
    var calories;
    var protein;
    var carbs;
    var fat;
    var fiber;
    var sugar; 
    var sodium;
    var cholesterol;
    const [message,setMessage] = useState('');

    // This function just resets the displayed message whenever the user starts typing again in any of the input text boxes.
    function clearMessage()
    {
        setMessage("");
    }

    const doEditGoals = async event => 
    {
        
        // create object from text boxes and make JSON 
        event.preventDefault();
        var obj = { 
            UserId:userId, 
            Weight: parseInt(weight.value),
            Calories: parseInt(calories.value), 
            Protein: parseInt(protein.value), 
            Carbs: parseInt(carbs.value), 
            Fat: parseInt(fat.value), 
            Fiber: parseInt(fiber.value), 
            Sugar: parseInt(sugar.value), 
            Sodium: parseInt(sodium.value), 
            Cholesterol: parseInt(cholesterol.value),
            jwtToken:tok
        }
        var js = JSON.stringify(obj);
        try
        {    
            // Send off package to api and await response 
            var bp = require('./Path.js');
            const response = await fetch(bp.buildPath('api/editGoal/'), {method:'PUT', body:js, headers:{'Content-Type': 'application/json'}});
            var res = JSON.parse(await response.text());
            
            // I'll make the error messages nicer later - Declan
            if( res.error )
            {
                setMessage(res.error);
            }
            else
            {
                setMessage('Goals set!');
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }
    };

  return (
    <div id="addMealDiv">
        <Container id="loginPage">
            <Form className='mt-3'>
                <Form.Group id="leftJustified" className="mb-3" controlId="formWeight">
                    <Form.Label>Set New Goals!</Form.Label>
                    <Form.Control type="number" placeholder="Weight Goal (lbs)" onInput={clearMessage} ref={(c) => weight = c} />
                </Form.Group>
                <Form.Group id="leftJustified" className="mb-3" controlId="formCalories">
                    <Form.Label>Daily</Form.Label>
                    <Form.Control type="number" placeholder="Daily Calorie Goal" onInput={clearMessage} ref={(c) => calories = c} />
                </Form.Group>
                <Form.Group id="leftJustified" className="mb-3" controlId="formProtein">
                    <Form.Control type="number" placeholder="Daily Protein Goal (g)" onInput={clearMessage} ref={(c) => protein = c} />
                </Form.Group>
                <Form.Group id="leftJustified" className="mb-3" controlId="formCarbs">
                    <Form.Control type="number" placeholder="Daily Carbs Goal (g)" onInput={clearMessage} ref={(c) => carbs = c} />
                </Form.Group>
                <Form.Group id="leftJustified" className="mb-3" controlId="formFat">
                    <Form.Control type="number" placeholder="Daily Fat Goal (g)" onInput={clearMessage} ref={(c) => fat = (c)} />
                </Form.Group>
                <Form.Group id="leftJustified" className="mb-3" controlId="formFiber">
                    <Form.Control type="number" placeholder="Daily Fiber Goal (g)" onInput={clearMessage} ref={(c) => fiber = c} />
                </Form.Group>
                <Form.Group id="leftJustified" className="mb-3" controlId="formSugar">
                    <Form.Control type="number" placeholder="Daily Sugar Goal (g)" onInput={clearMessage} ref={(c) => sugar = c} />
                </Form.Group>
                <Form.Group id="leftJustified" className="mb-3" controlId="formSodium">
                    <Form.Control type="number" placeholder="Daily Sodium Goal (mg)" onInput={clearMessage} ref={(c) => sodium = c} />
                </Form.Group>
                <Form.Group id="leftJustified" className="mb-3" controlId="formCholesterol">
                    <Form.Control type="number" placeholder="Daily Cholesterol Goal" onInput={clearMessage} ref={(c) => cholesterol = c} />
                </Form.Group>

                <Button 
                    id="addMealButton"
                    className="mb-3" 
                    variant="success" 
                    onClick={doEditGoals}
                > 
                    Set Goals 
                </Button><br/>
                <span id="addMealResult">{message}</span>
            </Form>
        </Container>
     </div>
  );
};

export default GoalsDisplay;
