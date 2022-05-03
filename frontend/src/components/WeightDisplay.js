import React, { useState, useEffect } from 'react';
import { Button, Card, Container, Form, Row, Col } from 'react-bootstrap';

function GoalsDisplay() 
{
    // Initialize fields required for object, get user data, and create message variable
    var _ud = localStorage.getItem('user_data');
	var ud = JSON.parse(_ud);
    var userId = ud.id;
    var firstName = ud.firstName;
	var lastName = ud.lastName;

    var inputWeight;
    var displayWeight;
    var weightDate;
    var weights;
    var storage = require('../tokenStorage.js');
    var tok = storage.retrieveToken();

    const [message,setMessage] = useState('');

    async function getData()
    {
        var obj = {
            UserId:userId,
            jwtToken: tok
        }
        var js = JSON.stringify(obj);
        try
        { 
            // Send off package to api and await response 
            var bp = require('./Path.js');
            // THIS WILL CHANGE BECAUSE API ENDPOINT HAS NOT YET BEEN CREATED
            const response = await fetch(bp.buildPath('api/retrieveWeights/'),{method:'POST', body:js, headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());
            if ( !res || res.weights.length == 0)
            {
                displayWeight = 'N/A';
                document.getElementById('displayWeight').innerHTML = displayWeight;
                return;
            }
            weights = res.weights;
            displayWeight = weights[weights.length - 1].Weight;
            weightDate = weights[weights.length - 1].Date;
            document.getElementById('displayWeight').innerHTML = displayWeight;
            document.getElementById('weightDate').innerHTML = weightDate;
            
            
        }
        catch(e)
        {
            //alert(e.toString());
            return;
        }
    };

    const doRecordWeight = async event => 
    {
        
        // create object from text boxes and make JSON 
        event.preventDefault();
        var obj = { 
            UserId:userId, 
            newWeight: parseInt(inputWeight.value),
            Date: new Date().toLocaleDateString(),
            jwtToken:tok
        }
        var js = JSON.stringify(obj);
        try
        {    
            // Send off package to api and await response 
            var bp = require('./Path.js');
            const response = await fetch(bp.buildPath('api/addweight/'), {method:'POST', body:js, headers:{'Content-Type': 'application/json'}});
            var res = JSON.parse(await response.text());
            console.log(res);
            
            // I'll make the error messages nicer later - Declan
            if( res.error )
            {
                setMessage(res.error);
            }
            else
            {
                setMessage('Weight set!');
            }
        }
        catch(e)
        {
            //alert(e.toString());
            return;
        }
    };

    // Initialize list of foods on page
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
        <div>
            <Container style={style}>
                <Card  bg='dark' style={{padding: '20px', display: 'flex'}}>
                    <Card.Body style={style}>
                        <Col className='m-3'>
                            <Row >
                                <Col>
                                <Card.Text style={{width: '180px', 'textAlign': 'center'}} id='leftJustified'>
                                    Last Recorded: <span id='weightDate'></span><br/>
                                    Weight: <span id='displayWeight'></span>lbs
                                </Card.Text>
                                </Col>
                                <Form style={{width: '150px'}}>
                                    <Form.Group id="leftJustified" className="mb-3" controlId="formEmail">
                                        <Form.Control type="text" placeholder="Weight" ref={(c) => inputWeight = c} />
                                    </Form.Group>
                                </Form>
                                <Button style={{width: '150px', height: '40px'}} variant='success' onClick={doRecordWeight}>Record Weight</Button>
                            </Row>
                        </Col>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default GoalsDisplay;
