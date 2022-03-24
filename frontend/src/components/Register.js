import React, { useState } from 'react';

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
      <div id="registerDiv">
        <form onSubmit={doRegister}>
            <span id="inner-title">Sign Up</span><br />
            <input type="text" id="firstName" placeholder="First Name" ref={(c) => firstName = c} />
            <input type="text" id="lastName" placeholder="Last Name" ref={(c) => lastName = c} />
            <input type="text" id="email" placeholder="Email" ref={(c) => email = c} />
            <input type="text" id="birthday" placeholder="Date of Birth" ref={(c) => birthday = c} />
            <input type="text" id="username" placeholder="New Username" ref={(c) => username = c} />
            <input type="password" id="password" placeholder="New Password" ref={(c) => password = c} />
            <input type="submit" id="registerButton" class="buttons" value = "Create Account" onClick={doRegister} />
        </form>
        <span id="registerResult">{message}</span>
     </div>
    );
};
export default Register;