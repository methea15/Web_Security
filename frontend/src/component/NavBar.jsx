import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link } from 'react-router-dom';
import Logo from '../assets/Logo.png'

export default function NavBar() {
  return (
      <>
          
               <Navbar  expand='md' className="bg-body-tertiary mb-3">
                  <Container fluid>                      
                  <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-3">
                          <img src={Logo} alt="Logo" width={40} height={40}   className='d-inline-block align-top ' />
                      <span className='fw-bold fs-5'>Romdoul Security</span>
                  </Navbar.Brand>
                      <Navbar.Toggle aria-controls={`offcanvasNavbar`} />
                      <Navbar.Offcanvas
                          id={`offcanvasNavbar`}
                          aria-labelledby={`offcanvasNavbarLabel`}
                      placement="end"
                      className="w-50"
                      >
                          <Offcanvas.Header closeButton>
                              <Offcanvas.Title id={`offcanvasNavbarLabel`}>
                            </Offcanvas.Title>
                          </Offcanvas.Header>
                          <Offcanvas.Body>
                          <Nav className="justify-content-end d-flex align-items-center flex-grow-1 pe-3 me-3 gap-2">
                                  <Nav.Link as={Link} to='/dashboard' >Dashboard</Nav.Link>
                                  <Nav.Link as={Link}  to='/history' >History</Nav.Link>
                              <div className='d-flex align-items-center gap-3 '>   
                              <Button as={Link} to='/signIn'
                                  variant="outline-primary"    
                              >Sign In</Button>
                                  <Button as={Link} to='/register' variant="outline-primary">Register</Button>
                                 </div>  
                              </Nav>
                          </Offcanvas.Body>
                      </Navbar.Offcanvas>
                  </Container>
              </Navbar>      
          
      
    </>
  )
}
