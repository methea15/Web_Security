import React, {  useState } from 'react'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Logo from '../assets/Logo.png';
import { authUser } from '../function/auth';
import "../component/style.css"
 
const SignIn = ()=> {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {login, isLoading, error} = authUser()
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className=' d-flex justify-content-center my-5'>
      <div className='d-flex flex-column border border-3 p-4 m-3 rounded-4'
      style={{width:'100%', maxWidth:'400px'}}>
        <div className='text-center mb-4 me-4'>
          <Link to="/" className="text-decoration-none justify-content-center p-3 m-2">
          <img src={Logo} alt="Logo" width={40} height={40} className='mb-2' />
          <span className='text-dark fw-bold fs-10 d-flex flex-column'>Romdoul Security</span>
          </Link>
          <h2 className='d-flex justify-content-center'>Login</h2>

        </div>

        <FloatingLabel
          
        controlId="floatingInput"
        label="Email address"
        className="mb-3"
      >
          <Form.Control
            
            type="email" value={email} placeholder="name@example.com"
        onChange={(e)=> setEmail(e.target.value)}  />
      </FloatingLabel>
      
      <FloatingLabel controlId="floatingPassword" label="Password">
        <Form.Control type="password" value={password} placeholder="Password" onChange={(e)=>setPassword(e.target.value)} />
        </FloatingLabel>
        {error && <p className='text-red-500'>{error}</p> }
        <Button className='d-flex p-3 m-4 justify-content-center' onClick={handleLogin} disabled={isLoading} > {isLoading ? "Logging...":"Login"} </Button>

        <div className='text-center'>
          <p>Haven't got an account? 
            <Link to='/register' className='btn-link text-decoration-none'> Register
            </Link>
          </p>
        </div>
        
      </div>
    </div>
  );
}

export default SignIn;