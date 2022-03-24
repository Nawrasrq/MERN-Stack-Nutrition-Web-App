import React from 'react';
import PageTitle from '../components/PageTitle';
import Login from '../components/Login';
import CreateNewAccount from '../components/CreateNewAccount'

function LoginPage()
{
    return(
      <div>
        <PageTitle />
        <Login />
        <CreateNewAccount />
      </div>
    );
};
	
export default LoginPage;