import React from 'react';
import { Button } from 'react-bootstrap';

// Takes you to password reset page when "Forgot Password?" button is clicked on.
function ForgotPassword()
{  
	return(
		<div id="forgotPasswordtDiv">
            <Button variant='dark' size='sm' className="mb-3" href="/ResetPasswordRequest">Forgot Password?</Button>
		</div>
	);
};

export default ForgotPassword;