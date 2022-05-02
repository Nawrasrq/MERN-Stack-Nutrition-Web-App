import React, { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';

function AddMeal() 
{
    // Initialize fields required for object, get user data, and create message variable
    var _ud = localStorage.getItem('user_data');
	var ud = JSON.parse(_ud);
    var userId = ud.id;
    var foodName;
    var calories;
    var protein;
    var carbs;
    var fat;
    var fiber;
    var sugar; 
    var sodium;
    var cholesterol;
    const [message,setMessage] = useState('');

    var storage = require('../tokenStorage.js');

    // This function just resets the displayed message whenever the user starts typing again in any of the input text boxes.
    function clearMessage()
    {
        setMessage("");
    }

    const doAddMeal = async event => 
    {
        // create object from text boxes and make JSON 
        event.preventDefault();

        var tok = storage.retrieveToken();

        var obj = { UserId:userId, 
                    Name:foodName.value, 
                    Calories:calories.value, 
                    Protein:(protein.value || 0), 
                    Carbs:(carbs.value || 0), 
                    Fat:(fat.value || 0), 
                    Fiber:(fiber.value || 0), 
                    Sugar:(sugar.value || 0), 
                    Sodium:(sodium.value || 0), 
                    Cholesterol:(cholesterol.value || 0),
                    jwtToken:tok
                }; 
        var js = JSON.stringify(obj);
        try
        {    
            // Send off package to api and await response 
            var bp = require('./Path.js');
            const response = await fetch(bp.buildPath('api/addmeal'),{method:'POST', body:js, headers:{'Content-Type': 'application/json'}});
            var res = JSON.parse(await response.text());

            if (res.jwtToken === null)
            {
                setMessage(res.error);
                return;
            }
            // Token was expired
            else if (res.jwtToken.length === 0)
            {
                alert("Your session has expired, please log in again.");
                localStorage.removeItem("user_data")
		        window.location.href = '/';
                return;
            }
            
            storage.storeToken(res.jwtToken);

            // I'll make the error messages nicer later - Declan
            if( res.error )
            {
                setMessage(res.error);
            }
            else
            {
                setMessage("\"" + foodName.value + "\" successfully added to your list of foods.");
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }
  };

  // Prevents negative values from being typed in
  const preventInvalid = (e) => {
    if (e.code === 'Minus') {
        e.preventDefault();
    }
  };

  return (
    <div id="addMealDiv">
        <Container id="loginPage">
            <Form className='mt-3'>
                <Form.Group id="leftJustified" className="mb-3" controlId="formWeight">
                    <Form.Label>Add a New Food (Required fields indicated by *)</Form.Label>
                    <Form.Control type="text" id="foodName" placeholder="Food Name *" onInput={clearMessage} ref={(c) => foodName = c} />
                </Form.Group>
                <Form.Group id="leftJustified" className="mb-3" controlId="formCalories">
                    <Form.Control type="number" id="calories" placeholder="Calories *" min="0" onKeyPress={preventInvalid} onInput={clearMessage} ref={(c) => calories = c} />
                </Form.Group>
                <Form.Group id="leftJustified" className="mb-3" controlId="formProtein">
                    <Form.Control type="number" id="protein" placeholder="Protein (g)" min="0" onKeyPress={preventInvalid} onInput={clearMessage} ref={(c) => protein = c} />
                </Form.Group>
                <Form.Group id="leftJustified" className="mb-3" controlId="formCarbs">
                    <Form.Control type="number" id="carbs" placeholder="Carbohydrates (g)" min="0" onKeyPress={preventInvalid} onInput={clearMessage} ref={(c) => carbs = c} />
                </Form.Group>
                <Form.Group id="leftJustified" className="mb-3" controlId="formFat">
                    <Form.Control type="number" id="fat" placeholder="Fat (g)" min="0" onKeyPress={preventInvalid} onInput={clearMessage} ref={(c) => fat = c} />
                </Form.Group>
                <Form.Group id="leftJustified" className="mb-3" controlId="formFiber">
                    <Form.Control type="number" id="fiber" placeholder="Fiber (g)" min="0" onKeyPress={preventInvalid} onInput={clearMessage} ref={(c) => fiber = c} />
                </Form.Group>
                <Form.Group id="leftJustified" className="mb-3" controlId="formSugar">
                    <Form.Control type="number" id="sugar" placeholder="Sugar (g)" min="0" onKeyPress={preventInvalid} onInput={clearMessage} ref={(c) => sugar = c} />
                </Form.Group>
                <Form.Group id="leftJustified" className="mb-3" controlId="formSodium">
                    <Form.Control type="number" id="sodium" placeholder="Sodium (mg)" min="0" onKeyPress={preventInvalid} onInput={clearMessage} ref={(c) => sodium = c} />
                </Form.Group>
                <Form.Group id="leftJustified" className="mb-3" controlId="formCholesterol">
                    <Form.Control type="number" id="cholesterol" placeholder="Cholesterol (mg)" min="0" onKeyPress={preventInvalid} onInput={clearMessage} ref={(c) => cholesterol = c} />
                </Form.Group>

                <Button 
                    id="addMealButton"
                    className="mb-3" 
                    variant="success" 
                    onClick={doAddMeal}
                > 
                    Create Food 
                </Button><br/>
                <span id="addMealResult">{message}</span>
            </Form>
        </Container>
     </div>
     
  );
};

export default AddMeal;
