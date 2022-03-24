import React from 'react';
import PageTitle from '../components/PageTitle';
import Login from '../components/Login';
import ForgotPassword from '../components/ForgotPassword';
import CreateNewAccount from '../components/CreateNewAccount';

function LoginPage()
{
    return(
      <div>
        <PageTitle />
        <Login />
        <ForgotPassword />
        <CreateNewAccount />
      </div>
    );
};
	
export default LoginPage;