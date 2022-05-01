import React, { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';

function Register()
{
    var firstName, lastName, username, password, email, birthday; // Declaring variables that will take input inside register form.
    const [message,setMessage] = useState('');
    
    // Registers a new user for the application.
    const doRegister = async event => 
    {
        event.preventDefault();
        var obj = { FirstName:firstName.value, LastName:lastName.value, Login:username.value, Password:password.value, Email:email.value, Birthday:birthday.value};
        var js = JSON.stringify(obj);
        console.log(obj);

        try
        {
            var bp = require('./Path.js');
            const response = await fetch(bp.buildPath('api/register'),{method:'POST', body:js, headers:{'Content-Type': 'application/json'}});
            var res = JSON.parse(await response.text());

            var error = res.error;

            if (error.length > 0) // If new user was unsuccessful in registering.
            {
                setMessage(error);
                return;
            }
            else
            {
                // (LATER) Try adding popup window that tells user they successfully registered
                // and that they need to check email for verification to log in.

                alert("Check Email to Verify before Logging In");
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
        <div>
            <Container >
                <Form className='mt-3'>
                    <Form.Group id="leftJustified" className="mb-3" controlId="formFirstName">
                        <Form.Label>Sign Up</Form.Label>
                        <Form.Control type="text" placeholder="First Name" ref={(c) => firstName = c} />
                    </Form.Group>
                    <Form.Group id="leftJustified" className="mb-3" controlId="formLastName">
                        <Form.Control type="text" placeholder="Last Name" ref={(c) => lastName = c} />
                    </Form.Group>
                    <Form.Group id="leftJustified" className="mb-3" controlId="formEmail">
                        <Form.Control type="text" placeholder="Email" ref={(c) => email = c} />
                    </Form.Group>
                    <Form.Group id="leftJustified" className="mb-3" controlId="formBirthday">
                        <Form.Control type="date" placeholder="Date of Birth" ref={(c) => birthday = c} />
                    </Form.Group>
                    <Form.Group id="leftJustified" className="mb-3" controlId="formUsername">
                        <Form.Control type="text" placeholder="Username" ref={(c) => username = c} />
                    </Form.Group>
                    <Form.Group id="leftJustified" className="mb-3" controlId="formLastName">
                        <Form.Control type="password" placeholder="Password" ref={(c) => password = c} />
                    </Form.Group>

                    <Button 
                        id="loginButton"
                        className="mb-3" 
                        variant="success" 
                        onClick={doRegister}
                    > 
                        Create Account 
                    </Button>
                </Form>
            </Container>
            <span id="registerResult">{message}</span>
        </div>
    );
};
export default Register;