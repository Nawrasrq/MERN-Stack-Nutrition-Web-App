import React from 'react';

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
            <button onClick={goToResetPasswordRequestPage}>Forgot Password?</button>
		</div>
	);
};

export default ForgotPassword;