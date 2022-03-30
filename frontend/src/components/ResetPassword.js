import React, { useState } from 'react';

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
        <div>
            <form onSubmit={doResetPassword}>
                <input type="password" id="changedPassword" placeholder="New Password" ref={(c) => newPassword = c} />
                <input type="password" id="repeatedChangedPassword" placeholder="Re-type new Password" ref={(c) => repeatedNewPassword = c} />
                <input type="submit" id="resetPasswordButton" class="buttons" value = "Reset Password" onClick={doResetPassword} />
            </form>
            <span id="resetPasswordResult">{message}</span>
        </div>
      );
};
export default ResetPassword;