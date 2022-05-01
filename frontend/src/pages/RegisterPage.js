import React from 'react';
import { Card, Container, Navbar, Nav } from 'react-bootstrap';
import Register from '../components/Register';

function RegisterPage()
{
	return(
	  <div>
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
			<Card bg='dark' border='success' style={{padding: '20px'}}>
					<Nav variant='tabs' defaultActiveKey="/Register">
						<Nav.Item>
							<Nav.Link href="/">Login</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link href="/Register">Register</Nav.Link>
						</Nav.Item>
					</Nav>
				<Register />
			</Card>
		</Container>
	  </div>
	);
};

export default RegisterPage;