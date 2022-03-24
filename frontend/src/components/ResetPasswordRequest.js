import React, { useState } from 'react';

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
      <div id="resetPasswordRequestDiv">
        <form onSubmit={doResetPasswordRequest}>
            <span id="inner-title">Enter your username and we'll send you a link to reset your password.</span><br />
            <input type="text" id="username" placeholder="Username" ref={(c) => username = c} />
            <input type="submit" id="resetPasswordRequestButton" class="buttons" value = "Reset Password" onClick={doResetPasswordRequest} />
        </form>
        <span id="resetPasswordRequestResult">{message}</span>
     </div>
    );
};
export default ResetPasswordRequest;