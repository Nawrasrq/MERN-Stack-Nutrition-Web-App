import React, { useState } from 'react';
import { Button, Card, Container, Form } from 'react-bootstrap';

function ResetPasswordRequest()
{
    var username; // Declaring username variable which will take input inside form.
    const [message,setMessage] = useState('');
    
    // Resets password for requested user.
    const doResetPasswordRequest = async event => 
    {
        event.preventDefault();
        var obj = { Login:username.value };
        var js = JSON.stringify(obj);

        try
        {
            var bp = require('./Path.js');
            const response = await fetch(bp.buildPath('api/passwordresetrequest'),{method:'POST', body:js, headers:{'Content-Type': 'application/json'}});
            var res = JSON.parse(await response.text());

            var error = res.error;
            
            if (error.length > 0) // If no user was found to reset password.
            {
                setMessage(error);
                return;
            }
            else
            {
                // (LATER) Try adding popup window that tells user that they 
                // need to check email to reset your password.

                alert("Check Email to Reset your Password");
                window.location.href = "/";
                return;
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }
    }
    
    return(
      <div >
        <Container id='loginPage'>
            <Card style={{padding: '20px'}} bg='dark'>
                <Card.Title>Forgot Password?</Card.Title>
                <Form>
                    <Form.Group id="leftJustified" className="mb-3" controlId="formUsername">
                        <Form.Label>Enter your username and we'll send you a link to reset your password</Form.Label>
                        <Form.Control type="text" placeholder="Username" ref={(c) => username = c} />
                    </Form.Group>

                    <Button 
                        id="resetPasswordRequestButton"
                        className="mb-3" 
                        variant="success" 
                        onClick={doResetPasswordRequest}
                    > 
                        Reset Password
                    </Button>
                </Form>
            </Card>
        </Container>
        <span id="resetPasswordRequestResult">{message}</span>
     </div>
    );
};
export default ResetPasswordRequest;