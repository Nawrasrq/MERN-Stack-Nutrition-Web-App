import React from 'react';
import { Button, Container, Navbar, Nav } from 'react-bootstrap';

function NavigationBar()
{
    function doLogout() 
	{
		localStorage.removeItem("user_data");
		window.location.href = '/';
	};    

    return(
        <div>
            <Navbar bg="dark" variant='dark' expand="lg">
                <Container>
                    <Navbar.Brand href="/Main">
                        <img
                        src="https://cdn.discordapp.com/attachments/945831755162746964/969412662985379881/mascotBGRemoved.png"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                        />{' '}
                        Nutso Nutrition
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/Main">Home</Nav.Link>
                            <Nav.Link href="/Goals">Weight</Nav.Link>
                            <Nav.Link href="/Profile">Profile</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                    <Button variant='outline-danger' className="m-0" onClick={doLogout}> Log Out </Button>
                </Container>
            </Navbar>
        </div>
    );
};

export default NavigationBar;