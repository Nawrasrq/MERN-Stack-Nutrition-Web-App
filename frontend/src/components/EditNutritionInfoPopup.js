import React, { useState } from 'react';
import { Button, Card, Col, Container, Form, ListGroup, Row } from 'react-bootstrap';
import '../css/EditNutritionInfoPopup.css';

function EditNutritionInfoPopup(props)
{   
    const [message,setMessage] = useState('');
    const [didEditFood, setDidEditFood] = useState(false);

      if (!props.show) {
        return null;
      }
    
      var food = props.food;
      var name, calories, protein, carbs, fat, fiber, sugar, sodium, cholesterol;
      
      // Get all the nutritional values from the selected food
      name = food.Name;
      calories = food.Calories;
      protein = food.Protein;
      carbs = food.Carbs;
      fat = food.Fat;
      fiber = food.Fiber;
      sugar = food.Sugar;
      sodium = food.Sodium;
      cholesterol = food.Cholesterol;

      // This function just resets the displayed message whenever the user starts typing again in any of the input text boxes.
      function clearMessage()
      {
        setMessage("");
      }
      
      async function doEditNutritionInfo()
      {
        // Get jwt token from local storage
        var storage = require('../tokenStorage.js');
        var tok = storage.retrieveToken();

        // create object from text boxes and make JSON 
        var obj = {
            Name:name.value, 
            Calories:calories.value, 
            Protein:protein.value, 
            Carbs:carbs.value, 
            Fat:fat.value, 
            Fiber:fiber.value, 
            Sugar:sugar.value, 
            Sodium:sodium.value, 
            Cholesterol:cholesterol.value, 
            jwtToken:tok
        }
        var js = JSON.stringify(obj);

        // Gets the food's unique id
        let pathRoute = food._id;

        try
        {   
            
            // Send off package to api and await response 
            var bp = require('./Path.js');
            const response = await fetch(bp.buildPath('api/editmeal/' + pathRoute),{method:'PUT', body:js, headers:{'Content-Type': 'application/json'}});
            var res = JSON.parse(await response.text());

            if (!res.jwtToken)
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
            
            if(res.error.length > 0)
            {
                setMessage(res.error);
            }
            else
            {
                setMessage('Successfully edited '+ '\"' + res.meal.Name + '\"');
                setDidEditFood(true);
            }
        }
        catch(e)
        {
            console.log(e.toString());
            return;
        }
      }

      // Prevents negative values from being typed in
      const preventInvalid = (e) => {
        if (e.code === 'Minus') {
            e.preventDefault();
        }
      };

      var center = {
        width: '40%',
        height: '65%',
        top: '70%',
        left: '50%',
        padding: '20px',
        transform: 'translate(-50%, -50%)',
      }

      return (
        <Container id='editNutritionInfoPopup'>
            <Card id="innerEditNutritionInfoPopup" className='m-auto' bg='dark' style={center}>
              <Form>
                <Form.Group style={{width: '80%'}} className='m-auto mb-2' id="leftJustified"  controlId="formEmail">
                    <Form.Label className='m-auto'>Name: </Form.Label>
                    <Form.Control className='m-auto' type="text" defaultValue={name} onInput={clearMessage} ref={(c) => name = c} />
                </Form.Group>
              </Form>
              <Row>
              <Col>
                <Form>
                  <Form.Group style={{width: '60%'}} className='m-auto mb-2' id="leftJustified" controlId="formEmail">
                      <Form.Label className='m-auto'>Calories: </Form.Label>
                      <Form.Control className='m-auto' type="number" defaultValue={calories} min="0" onKeyPress={preventInvalid} onInput={clearMessage} ref={(c) => calories = c} />
                  </Form.Group>
                  <Form.Group style={{width: '60%'}} className='m-auto mb-2' id="leftJustified" controlId="formEmail">
                      <Form.Label className='m-auto'>Protein: </Form.Label>
                      <Form.Control className='m-auto' type="number" defaultValue={protein} min="0" onKeyPress={preventInvalid} onInput={clearMessage} ref={(c) => protein = c} />
                  </Form.Group>
                  <Form.Group style={{width: '60%'}} className='m-auto mb-2' id="leftJustified" controlId="formEmail">
                      <Form.Label className='m-auto'>Carbohydrates: </Form.Label>
                      <Form.Control className='m-auto' type="number" defaultValue={carbs} min="0" onKeyPress={preventInvalid} onInput={clearMessage} ref={(c) => carbs = c} />
                  </Form.Group>
                  <Form.Group style={{width: '60%'}} className='m-auto mb-2' id="leftJustified" controlId="formEmail">
                      <Form.Label className='m-auto'>Fat: </Form.Label>
                      <Form.Control className='m-auto' type="number" defaultValue={fat} min="0" onKeyPress={preventInvalid} onInput={clearMessage} ref={(c) => fat = c} />
                  </Form.Group>
                </Form>
              </Col>
              <Col>
                <Form>
                  <Form.Group style={{width: '60%'}} className='m-auto mb-2' id="leftJustified" controlId="formEmail">
                      <Form.Label className='m-auto'>Fiber: </Form.Label>
                      <Form.Control className='m-auto' type="number" defaultValue={fiber} min="0" onKeyPress={preventInvalid} onInput={clearMessage} ref={(c) => fiber = c} />
                  </Form.Group>
                  <Form.Group style={{width: '60%'}} className='m-auto mb-2' id="leftJustified" controlId="formEmail">
                      <Form.Label className='m-auto'>Sugar: </Form.Label>
                      <Form.Control className='m-auto' type="number" defaultValue={sugar} min="0" onKeyPress={preventInvalid} onInput={clearMessage} ref={(c) => sugar = c} />
                  </Form.Group>
                  <Form.Group style={{width: '60%'}} className='m-auto mb-2' id="leftJustified" controlId="formEmail">
                      <Form.Label className='m-auto'>Sodium: </Form.Label>
                      <Form.Control className='m-auto' type="number" defaultValue={sodium} min="0" onKeyPress={preventInvalid} onInput={clearMessage} ref={(c) => sodium = c} />
                  </Form.Group>
                  <Form.Group style={{width: '60%'}} className='m-auto mb-2' id="leftJustified" controlId="formEmail">
                      <Form.Label className='m-auto'>Cholesterol: </Form.Label>
                      <Form.Control className='m-auto' type="number" defaultValue={cholesterol} min="0" onKeyPress={preventInvalid} onInput={clearMessage} ref={(c) => cholesterol = c} />
                  </Form.Group>
                </Form>
              </Col>
              </Row>
                <Col>
                  <Button className='m-2' variant='success' type="button" id="editNutritionInfoButton" class="buttons" onClick={doEditNutritionInfo}> Edit Nutrition Info </Button>
                  <Button variant='success' type="button" id="closeEditNutritionInfoPopupButton" class="buttons" onClick={()=>props.closePopup(didEditFood, setDidEditFood, setMessage)}> Close Edit Nutrition Info </Button> <br />
                </Col>
                <span id="editNutritionInfoResult">{message}</span>
            </Card>
        </Container>
      );
  }
  export default EditNutritionInfoPopup;