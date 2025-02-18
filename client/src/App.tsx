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
import { useEffect } from 'react';
import axios from 'axios';
import Editor from './pages/Editor';
import { userAtom } from './store/user';
import { useRecoilState } from 'recoil';

function App() {
  const [user, setUser] = useRecoilState(userAtom);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await localStorage.getItem("token");
        if (!token) {
          console.error("Token not found");
          return;
        }

        const { data } = await axios.get("http://127.0.0.1:8787/api/v1/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(data.user);
        console.log('user:', user)
      } catch (error) {
        console.error("There was an error!", error);
      }
    };

    fetchUser();
  }, []);


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
            <Route path='/editor' element={<Editor />} />

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
