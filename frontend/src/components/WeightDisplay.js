import React, { useState } from 'react';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';

function GoalsDisplay() 
{
    // Initialize fields required for object, get user data, and create message variable
    var _ud = localStorage.getItem('user_data');
	var ud = JSON.parse(_ud);
    var userId = ud.id;
    var firstName = ud.firstName;
	var lastName = ud.lastName;

    var weight;

    const [message,setMessage] = useState('');

    const getData = async event => 
    {

        // create object from text boxes and make JSON 
        event.preventDefault();
        var obj = {
            UserId:userId
        }
        var js = JSON.stringify(obj);
        try
        { 
            // Send off package to api and await response 
            var bp = require('./Path.js');
            // THIS WILL CHANGE BECAUSE API ENDPOINT HAS NOT YET BEEN CREATED
            const response = await fetch(bp.buildPath('api/getgoal'),{method:'POST', body:js, headers:{'Content-Type': 'application/json'}});
            var res = JSON.parse(await response.text());
            if( res.error )
            {
                setMessage(res.error);
            }
            else
            {
                setMessage('');
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }
    };

    return (
        <div id="displayProgressDiv">
            <Container id='loginPage'>
                <Card  bg='dark' border='success' style={{padding: '20px'}}>
                    <Card.Body>
                        Insert Weight Graph Here
                        <Row className='m-3'>
                        <Col>
                            <Card.Text id='leftJustified'>
                                Current Weight <br/>
                                {0} lbs
                            </Card.Text>
                        </Col>
                        <Col>
                            <Button variant='success'>Record Weight</Button>
                        </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default GoalsDisplay;
