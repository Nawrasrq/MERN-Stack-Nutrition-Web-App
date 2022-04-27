import React from 'react';
import { Button } from 'react-bootstrap';

// Takes you to password reset page when "Forgot Password?" button is clicked on.
function ForgotPassword()
{  
    function goToResetPasswordRequestPage()
    {
        try
        {                
            window.location.href = '/ResetPasswordRequest';
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }
    }

	return(
		<div id="forgotPasswordtDiv">
            <Button className="mb-3" onClick={goToResetPasswordRequestPage}>Forgot Password?</Button>
		</div>
	);
};

export default ForgotPassword;