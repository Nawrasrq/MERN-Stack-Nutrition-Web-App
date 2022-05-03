import React, { useState } from 'react';
import { Button, Container, Navbar, Nav, Form } from 'react-bootstrap';
import '../css/LoginPage.css';

function ResetPassword()
{
    var newPassword;
    var repeatedNewPassword;
    const [message,setMessage] = useState('');

    const doResetPassword = async event => 
    {
        event.preventDefault();

        // Ensure sure that the user retyped their new password correctly
        if (!(newPassword.value === repeatedNewPassword.value))
        {
            setMessage("The passwords typed in the input fields are not matching, please try again.");
            return;
        }

        var obj = {NewPassword:newPassword.value};
        var js = JSON.stringify(obj);

        var pathName = (window.location.pathname).substring(1);

        try
        {
            var bp = require('./Path.js');
            const response = await fetch(bp.buildPath(pathName),{method:'POST', body:js, headers:{'Content-Type': 'application/json'}});
            var res = JSON.parse(await response.text());

            var error = res.error;
            
            if (error.length > 0) // If there was a problem with the new password entered
            {
                setMessage(error);
                return;
            }
            else
            {
                setMessage("");
                window.location.href = "/";
                return;
            }
        }
        catch(e)
        {
            console.log(e.toString());
            return;
        }
    }

    return(
        <Container id='loginPage'>
            <Form className='mt-3'>
                <Form.Group id="leftJustified">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control className="mb-3" type="password" id="changedPassword" placeholder="New Password" ref={(c) => newPassword = c} />
                </Form.Group>
                <Form.Group id="leftJustified">
                    <Form.Label>Re-type New Password</Form.Label>
                    <Form.Control id="leftJustified" className="mb-3" type="password" id="repeatedChangedPassword" placeholder="Re-type new Password" ref={(c) => repeatedNewPassword = c} />
                </Form.Group>
                <Button variant='success' type="button" id="resetPasswordButton" onClick={doResetPassword} >Reset Password</Button>
            </Form>
            <span id="resetPasswordResult">{message}</span>
        </Container>
      );
};
export default ResetPassword;