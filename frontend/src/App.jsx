import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/dashboard.jsx';
import NavBar from './component/NavBar.jsx';
import UrlChecking from './component/UrlChecking.jsx';
import Footer from './component/footer.jsx';
import History from './pages/History.jsx';
import SignIn from './pages/SignIn.jsx';
import Register from './pages/Register.jsx';
import './App.css';


function App() {
 
  
  return (
    <>
      <div className='app-container'>
      <NavBar />
      <main className='flex-grow-1'>
      <Routes>
        <Route path='/' element={<UrlChecking />}></Route>
        <Route path='/dashboard' element={<Dashboard />}></Route>
        <Route path='/history' element={<History />}></Route>
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
