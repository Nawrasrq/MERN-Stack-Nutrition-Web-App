import React from 'react';

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
            <button onClick={goToRegisterPage}>Create New Account</button>
		</div>
	);
};

export default CreateNewAccount;