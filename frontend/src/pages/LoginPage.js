import React from 'react';
import PageTitle from '../components/PageTitle';
import Login from '../components/Login';
import ForgotPassword from '../components/ForgotPassword';
import CreateNewAccount from '../components/CreateNewAccount';
import '../css/LoginPage.css';

function LoginPage()
{
	return(
	  <div id="loginPage">
		<PageTitle />
		<Login />
		<ForgotPassword />
		<CreateNewAccount />
	  </div>
	);
};
	
export default LoginPage;