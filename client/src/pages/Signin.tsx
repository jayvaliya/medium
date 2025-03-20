import { useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import { apiClient } from "../utils/var";
import { useRecoilState } from 'recoil';
import { userAtom } from '../store/user';

export default function Signin() {

  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
  });
  const [_, setUser] = useRecoilState(userAtom);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const onSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = toast.loading("Please wait...");
    try {
      const response = await apiClient.post('/api/v1/user/signin', formValues);

      if (response.status === 200) {
        toast.update(id, {
          render: "Login successful",
          type: 'success',
          isLoading: false,
          autoClose: 5000,
        });
        localStorage.setItem('token', response.data.token);
        setUser({
          id: response.data.userId,
          name: response.data.name,
          email: formValues.email
        });
        navigate('/'); // Redirect to dashboard or home page
      } else {
        toast.error(response.data.message || "Error while logging in");
      }
    } catch (error) {
      console.error("Error during sign in:", error);
      toast.error("An error occurred. Please try again.");
    }
  }

  return (
    <section className='bg-gray-50 text-black'>
      <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
        <div className='w-full bg-white rounded-lg shadow-lg shadow-gray-400 md:mt-0 sm:max-w-md xl:p-0'>
          <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
            <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl'>
              Sign in to your account
            </h1>
            <form className='space-y-4 md:space-y-6' onSubmit={onSignin}>
              <div>
                <label
                  htmlFor='email'
                  className='block mb-2 text-sm font-medium text-gray-900'>
                  Your email
                </label>
                <input
                  type='email'
                  name='email'
                  id='email'
                  className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                  placeholder='name@company.com'
                  onChange={handleChange}
                  value={formValues.email}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor='password'
                  className='block mb-2 text-sm font-medium text-gray-900'>
                  Password
                </label>
                <input
                  type='password'
                  name='password'
                  id='password'
                  placeholder='••••••••'
                  className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                  onChange={handleChange}
                  value={formValues.password}
                  required
                />
              </div>
              <button
                type="submit"
                className='w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none bg-black focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'>
                Sign in
              </button>
              <p className='text-sm font-light text-gray-500'>
                New here?{' '}
                <Link
                  to='/signup'
                  className='font-medium text-primary-600 hover:underline'>
                  Create Account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}