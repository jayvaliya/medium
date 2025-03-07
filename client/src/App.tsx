import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import './App.css';
import Blog from './pages/Blog';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Draft from './pages/Draft';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import Profile from './pages/Profile';

function App() {
  return (
    <div className='font-inter'>
      <BrowserRouter>
        <Navbar />
        <div className=''>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/blog/:id' element={<Blog />} />
            <Route path='/signin' element={<Signin />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/draft' element={<Draft />} />
            <Route path='/new-Story' element={<Draft />} />
            <Route path="/profile/:id" element={<Profile />} />

          </Routes>
        </div>
      </BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default App;
