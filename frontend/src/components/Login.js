import React, { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import '../css/LoginPage.css';

function Login()
{
    var storage = require('../tokenStorage.js');
    
    var loginName;
    var loginPassword;
    const [message,setMessage] = useState('');
    
    const doLogin = async event => 
    {
        event.preventDefault();
        var obj = {Login:loginName.value, Password:loginPassword.value};
        var js = JSON.stringify(obj);
        try
        {    
            var bp = require('./Path.js');
            const response = await fetch(bp.buildPath('api/login'),{method:'POST', body:js, headers:{'Content-Type': 'application/json'}});
            var res = JSON.parse(await response.text());
            
            if( res.UserId <= 0 )
            {
                setMessage(res.error);
            }
            else
            {
                if (!res.jwtToken)
                {
                    setMessage(res.error);
                    return;
                }
                
                storage.storeToken(res.jwtToken);
                
                let userId = res.UserId;
                let fn = res.FirstName;
                let ln = res.LastName;
                
                var user = {firstName:fn, lastName:ln, id:userId};
                
                localStorage.setItem('user_data', JSON.stringify(user));
                setMessage('');
                window.location.href = '/Main';
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }    

    };
    const handleKeypress = e =>
    {
        if(e.key === 'Enter')
        {
            document.getElementById('loginButton').click();
        }
    }

    
    return(
        <div id="loginDiv" >
            <Container>
                <Form>
                    <Form.Group id="leftJustified" className="mb-3" controlId="formEmail">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Username" ref={(c) => loginName = c} />
                    </Form.Group>

                    <Form.Group id="leftJustified" controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="Password" 
                            id="login"
                            onKeyPress={handleKeypress}
                            ref={(c) => loginPassword = c} 
                        />
                    </Form.Group>

                    <Form.Text style={{color: "white"}} id="loginResult" >{message}</Form.Text><br/>

                    <Button 
                        id="loginButton"
                        className="m-3" 
                        variant="primary" 
                        onClick={doLogin}
                    > 
                        Login 
                    </Button>
                </Form>
            </Container>
        </div>
        );
};
export default Login;