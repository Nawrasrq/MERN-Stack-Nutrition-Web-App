import React from 'react';
import { Button, Container, Navbar, Nav } from 'react-bootstrap';
import ResetPasswordRequest from '../components/ResetPasswordRequest';

function ResetPasswordRequestPage()
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
		<ResetPasswordRequest />
	  </div>
	);
};

export default ResetPasswordRequestPage;