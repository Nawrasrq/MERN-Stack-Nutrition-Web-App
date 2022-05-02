import React, { useState, useEffect } from 'react';
import { Button, Card, Container, Form, Col, Row, ListGroup } from 'react-bootstrap';


function GoalsDisplay() 
{
    // Initialize fields required for object, get user data, and create message variable
    var _ud = localStorage.getItem('user_data');
	var ud = JSON.parse(_ud);
    var userId = ud.id;
    var firstName = ud.firstName;
	var lastName = ud.lastName;

    var goals;
    var calories;
    var protein;
    var carbs;
    var fat;
    var fiber;
    var sugar; 
    var sodium;
    var cholesterol;
    const [message,setMessage] = useState('');

    async function getData()
    {
        try
        { 
            // Send off package to api and await response 
            var bp = require('./Path.js');
            // THIS WILL CHANGE BECAUSE API ENDPOINT HAS NOT YET BEEN CREATED
            const response = await fetch(bp.buildPath('api/retrievegoal/' + userId),{method:'GET', headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());

            if( res.error )
            {
                setMessage(res.error);
            }
            else
            {
                setMessage('');
            }

            goals = res.goal;
            console.log(goals);
            document.getElementById('Weight').innerHTML = goals.Weight;

            document.getElementById('Calories').innerHTML = goals.Calories;
            document.getElementById('Protein').innerHTML = goals.Protein;
            document.getElementById('Carbohydrates').innerHTML = goals.Carbs;
            document.getElementById('Fat').innerHTML = goals.Fat;
            document.getElementById('Fiber').innerHTML = goals.Fiber;
            document.getElementById('Sugar').innerHTML = goals.Sugar;
            document.getElementById('Sodium').innerHTML = goals.Sodium;
            document.getElementById('Cholesterol').innerHTML = goals.Cholesterol;
            
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }
    };

    useEffect(() => {
        getData();
    }, []);


    var style =
    {
        padding: '20px', 
        display: 'flex', 
        'textAlign':'center', 
        'justifyContent':'center', 
        'alignItems':'center'
    }

  return (
    <div id="addMealDiv">
        <Container style={{padding: '20px'}}>
            <Card  bg='dark' style={{padding: '20px', display: 'flex'}}>
                <Card.Title >
                    {firstName} {lastName}'s Current Goals
                </Card.Title>
                <Card.Body style={style}>
                    <Row>
                        <Col style={{width: '100vh'}}>
                            <Card.Header>
                                Long-Term
                            </Card.Header>
                            <ListGroup>
                                <ListGroup.Item variant='dark'>Weight: <span id='Weight'/></ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col style={{width: '100vh'}}>
                            <Card.Header>
                                Daily
                            </Card.Header>
                            <ListGroup>
                                <ListGroup.Item variant='dark'>Calories: <span id='Calories'/></ListGroup.Item>
                                <ListGroup.Item variant='dark'>Protein: <span id='Protein'/></ListGroup.Item>
                                <ListGroup.Item variant='dark'>Carbohydrates: <span id='Carbohydrates'/></ListGroup.Item>
                                <ListGroup.Item variant='dark'>Fat: <span id='Fat'/></ListGroup.Item>
                                <ListGroup.Item variant='dark'>Fiber: <span id='Fiber'/></ListGroup.Item>
                                <ListGroup.Item variant='dark'>Sugar: <span id='Sugar'/></ListGroup.Item>
                                <ListGroup.Item variant='dark'>Sodium: <span id='Sodium'/></ListGroup.Item>
                                <ListGroup.Item variant='dark'>Cholesterol: <span id='Cholesterol'/></ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                </Card.Body>
                <span>{message}</span>
            </Card>
        </Container>
    </div>
  );
};

export default GoalsDisplay;
