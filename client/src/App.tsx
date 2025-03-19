import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import './App.css';
import Blog from './pages/Blog';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Drafts from './pages/Drafts'; // Import Drafts component
import Write from './pages/Write';

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
            <Route path='/write' element={<Write />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/profile/drafts" element={<Drafts />} />
          </Routes>
        </div>
      </BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
      />
    </div>
  );
}

export default App;
