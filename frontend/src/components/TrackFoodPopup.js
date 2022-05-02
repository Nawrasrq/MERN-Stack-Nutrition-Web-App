import React, { useState } from 'react';
import { Button, Col, Card, Container, Form, ListGroup, Row } from 'react-bootstrap';
import '../css/TrackFoodPopup.css';

function TrackFoodPopup(props)
{   
      const [message,setMessage] = useState('');
      const [quantity,setQuantity] = useState(1);
      const [category,setCategory] = useState("0");

      if (!props.show) {
        return null;
      }
    
      var food = props.food;
      var inputQty;
      var _ud, ud, userId;
      var name, calories, protein, carbs, fat, fiber, sugar, sodium, cholesterol;
      var servingLabel, showServing;
      
      // Get all the nutritional values from the selected food
      _ud = localStorage.getItem('user_data');
	    ud = JSON.parse(_ud);
      userId = ud.id;
      name = food.Name;
      calories = food.Calories;
      protein = food.Protein;
      carbs = food.Carbs;
      fat = food.Fat;
      fiber = food.Fiber;
      sugar = food.Sugar;
      sodium = food.Sodium;
      cholesterol = food.Cholesterol;

      // Only given specified serving label from foods in external database
      if (food.ServingLabel)
      {
        servingLabel = "Serving Size: " + food.ServingLabel;
        showServing = true;
      }
      else
      {
        servingLabel = "";
        showServing = false;
      }

      // This function just resets the displayed message whenever the user starts typing again in any of the input text boxes.
      function clearMessage()
      {
        setMessage("");
      }
      
      async function doTrackFood()
      {
        // Can't add empty food to tracked foods
        if (parseFloat(quantity) <= 0)
        {
            setMessage("Invalid quantity selected, please try again.")
            return;
        }

        // Get jwt token from local storage
        var storage = require('../tokenStorage.js');
        var tok = storage.retrieveToken();

        let date = new Date().toLocaleDateString()
        let categoryInt = parseInt(category);

        // create object from text boxes and make JSON 
        var obj = {
            UserId:userId,
            MealId:food._id,
            Name:name, 
            Calories:calories, 
            Protein:protein, 
            Carbs:carbs, 
            Fat:fat, 
            Fiber:fiber, 
            Sugar:sugar, 
            Sodium:sodium, 
            Cholesterol:cholesterol,
            Category:categoryInt,
            Quantity:quantity,
            Date:date, 
            jwtToken:tok
        }
        var js = JSON.stringify(obj);

        try
        {   
            
            // Send off package to api and await response 
            var bp = require('./Path.js');
            const response = await fetch(bp.buildPath('api/trackmeal/'),{method:'POST', body:js, headers:{'Content-Type': 'application/json'}});
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
                if (quantity === 1)
                  setMessage('Successfully Added ' + quantity + ' \"' + name + '\" to your daily list of tracked foods.');
                else
                  setMessage('Successfully Added ' + quantity + ' \"' + name + '\"s to your daily list of tracked foods.');
            }
        }
        catch(e)
        {
            console.log(e.toString());
            return;
        }
      }

      // Changes nutrtiional values for food corresponding to the quantities being selected by the user
      function adjustNutritionalValues()
      {
          // If nothing is entered, default to 1
          if (inputQty.value.length === 0)
          {
            setQuantity(1);
          }
          else 
          {
            setQuantity(parseFloat(inputQty.value));
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
        height: '70%',
        top: '50%',
        left: '20%',
        padding: '20px',
        transform: 'translate(-50%, -50%)',
      }

      return (
        <div>
          <Container id="trackFoodPopup">
            <Card id='innerTrackFoodPopup' className='m-auto' bg='dark' style={center}>
            <Card.Text>Quantity: </Card.Text>
            <Form.Control size='sm' className='mb-3 mx-auto' style={{width: '20%'}} type="number" step="1" min="1" defaultValue="1" onInput={clearMessage} onKeyPress={preventInvalid} onChange={adjustNutritionalValues} ref={(c) => inputQty = c} />
              <ListGroup className='mx-5' style={{height: '70%', textAlign: 'center'}}>
                <ListGroup.Item active variant='dark' style={{width: '100%'}}>{name}</ListGroup.Item>
                <ListGroup.Item variant='dark' style={{width: '100%'}}>Calories: {calories * quantity}</ListGroup.Item>
                <ListGroup.Item variant='dark' style={{width: '100%'}}>Protein: {protein * quantity}</ListGroup.Item>
                <ListGroup.Item variant='dark' style={{width: '100%'}}>Carbohydrates: {carbs * quantity}</ListGroup.Item>
                <ListGroup.Item variant='dark' style={{width: '100%'}}>Fat: {fat * quantity}</ListGroup.Item>
                <ListGroup.Item variant='dark' style={{width: '100%'}}>Fiber: {fiber * quantity}</ListGroup.Item>
                <ListGroup.Item variant='dark' style={{width: '100%'}}>Sugar: {sugar * quantity}</ListGroup.Item>
                <ListGroup.Item variant='dark' style={{width: '100%'}}>Sodium: {sodium * quantity}</ListGroup.Item>
                <ListGroup.Item variant='dark' style={{width: '100%'}}>Cholesterol: {cholesterol * quantity}</ListGroup.Item>
              </ListGroup>
              <Card.Text className='m-0'>{servingLabel}</Card.Text>{showServing && <br/>}
              <Card.Text className='m-1'>Choose meal (Optional):</Card.Text>
              <select id="categoryDropdown" onInput={clearMessage} onChange={(e) => setCategory(e.target.value)}>
                <option value="0"></option>
                <option value="1">Breakfast</option>
                <option value="2">Lunch</option>
                <option value="3">Dinner</option>
                <option value="4">Snack</option>
              </select><br/>
              <Col className = 'mt-2'>
                <Button className='mx-2' variant='success' id="trackFoodButton" onClick={doTrackFood}> Track </Button>
                <Button variant='success' id="closeTrackFoodPopupButton" onClick={()=>props.closePopup(setMessage, setQuantity, setCategory)}> Close </Button> <br />
              </Col>
              <span id="trackFoodResult">{message}</span>
            </Card>
          </Container>
        </div>
      );
  }
  export default TrackFoodPopup;