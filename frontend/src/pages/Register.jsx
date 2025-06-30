import React, { useState } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Logo from '../assets/Logo.png'
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel';
import { authUser } from '../function/auth';


export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signUp } = authUser();
  const handleRegister = async(e) => {
    e.preventDefault();
    await signUp(username, email, password);
  }

  return (
   
      <div className=' d-flex justify-content-center my-5'>
        <div className='d-flex flex-column border border-3 p-4 m-3 rounded-4'
          style={{ width: '100%', maxWidth: '400px' }}>
          <div className='text-center mb-3 me-4'>
            <Link to="/" className="text-decoration-none justify-content-center p-3 m-2">
              <img src={Logo} alt="Logo" width={40} height={40} className='mb-2' />
              <span className='text-dark fw-bold fs-10 d-flex flex-column'>Romdoul Security</span>
            </Link>
        </div>
        <h2 className='d-flex justify-content-center mb-4'>Register</h2>
          <FloatingLabel
            controlId="floatingInput"
            label="Username"
            className="mb-3 "
          >
            <Form.Control type="text" value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="john smith" />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingInput"
            label="Email address"
            className="mb-3"
          >
          <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
          </FloatingLabel>

          <FloatingLabel controlId="floatingPassword" label="Password">
          <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          </FloatingLabel>

        <Button className='d-flex p-3 m-4 justify-content-center' onClick={handleRegister}
        > Register </Button>
        
         <div className='text-center'>
                  <p>Got an account? 
               <Link to='/signin' className='btn-link text-decoration-none'> Login
                    </Link>
                  </p>
                </div>
  
        </div>
    </div>
  )
}
