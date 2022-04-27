import React from 'react';
import { Button } from 'react-bootstrap';


// Takes you to register page when "Create New Account" button is clicked on.
function CreateNewAccount()
{  
    function goToRegisterPage()
    {
        try
        {                
            window.location.href = '/Register';
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }
    }

	return(
		<div id="createNewAccountDiv">
            <Button className="mb-3" onClick={goToRegisterPage}>Create New Account</Button>
		</div>
	);
};

export default CreateNewAccount;