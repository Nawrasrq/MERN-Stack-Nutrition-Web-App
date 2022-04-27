import React from 'react';
import PageTitle from '../components/PageTitle';
import Login from '../components/Login';
import ForgotPassword from '../components/ForgotPassword';
import CreateNewAccount from '../components/CreateNewAccount';
import { Button } from 'react-bootstrap';

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