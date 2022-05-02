import React from 'react';
import { Card, Container, Navbar, Nav } from 'react-bootstrap';
import Login from '../components/Login';
import ForgotPassword from '../components/ForgotPassword';
import '../css/LoginPage.css';

function LoginPage()
{
	return(
	  <div >
		<Navbar bg="dark" variant='dark' expand="lg" >
			<Container>
				<Navbar.Brand href = '/'>
					<img
					src="https://cdn.discordapp.com/attachments/945831755162746964/969412662985379881/mascotBGRemoved.png"
					width="30"
					height="30"
					className="d-inline-block align-top"
					/>{' '}
					Nutso Nutrition
				</Navbar.Brand>
			</Container>
		</Navbar>
		<Container id='loginPage'>
			<Card bg='dark' style={{padding: '20px'}}>
				<Nav variant='tabs' defaultActiveKey="/">
					<Nav.Item>
						<Nav.Link href="/">Login</Nav.Link>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link href="/Register">Register</Nav.Link>
					</Nav.Item>
				</Nav>
				<Login />
				<ForgotPassword />
			</Card>
		</Container>
	  </div>
	);
};
	
export default LoginPage;