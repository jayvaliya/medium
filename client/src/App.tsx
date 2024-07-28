import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Blog from './pages/Blog';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Draft from './pages/Draft';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import { userAtom } from './store/user';
import {
  useRecoilState,
} from 'recoil';
import { useEffect } from 'react';
import axios from 'axios';
// atom,
// selector,
// useRecoilState,
// useRecoilValue,

function App() {
  const [user, setUser] = useRecoilState(userAtom);
  useEffect(() => {
    const url = 'https://backend.valiyajay555.workers.dev/api/v1/auth/me';
    axios.get(url, { withCredentials: true })
      .then((response) => {
        setUser(response.data);
        console.log(user);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  });


  return (
    <div className='font-inter'>
      <BrowserRouter>
        <Navbar />
        <div className='pt-16'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/blog/:id' element={<Blog />} />
            <Route path='/signin' element={<Signin />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/draft' element={<Draft />} />
            
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
