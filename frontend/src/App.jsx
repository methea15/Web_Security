import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/dashboard.jsx';
import NavBar from './component/NavBar.jsx';
import UrlChecking from './pages/UrlChecking.jsx';
import Footer from './component/footer.jsx';
import History from './pages/History.jsx';
import SignIn from './pages/SignIn.jsx';
import Register from './pages/Register.jsx';
import './App.css';
import Logout from './pages/Logout.jsx';
import { authUser } from './component/auth.js';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated} = authUser();
  if (!isAuthenticated) {
    return <Navigate to='/signIn' replace />
  }
  return children;
}


function App() {  
  const { isChecking, checkAuth } = authUser();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if(isChecking) return <div>Loading...</div>
  return (
    <>
      <div className='app-container'>
      <NavBar />
      <main className='flex-grow-1'>
      <Routes>
        <Route path='/' element={<UrlChecking />}></Route>
            
            <Route path='/dashboard' element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>}></Route>
            <Route path='/history' element={
              <ProtectedRoute>
              <History />
            </ProtectedRoute>}></Route>            
        <Route path='/signIn' element={<SignIn />}></Route>
        <Route path='/register' element={<Register />}></Route>
      </Routes>
      </main>      
       <Footer />
      </div>
    </>
  )
}

export default App
