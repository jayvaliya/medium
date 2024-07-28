import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SignUp() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });

  const onSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formValues.email ||
      !formValues.password ||
      formValues.password !== formValues.confirmPassword
    ) {
      toast.error('Please check your input fields');
      return;
    }

    const id = toast.loading('Please wait...');

    try {
      const response = await axios.post(
        "https://backend.valiyajay555.workers.dev/api/v1/user/signup",
        {
          email: formValues.email,
          password: formValues.password,
          name: formValues.name,
        }
      );
      if (response.status === 200) {
        toast.update(id, {
          render: "Logged in",
          type: 'success',
          isLoading: false,
          autoClose: 5000,
        });
        localStorage.setItem('token', response.data.token);
        navigate("/");
      } else {
        toast.update(id, {
          render: "Something went wrong",
          type: 'error',
          isLoading: false,
        });
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        toast.update(id, {
          render: error.response.data.message,
          type: 'error',
          isLoading: false,
          autoClose: 5000,
        });
      } else if (error.request) {
        toast.update(id, {
          render: 'Server is not responding',
          type: 'error',
          isLoading: false,
          autoClose: 5000,
        });
      } else {
        toast.update(id, {
          render: 'Error setting up the request.',
          type: 'error',
          isLoading: false,
          autoClose: 5000,
        });
      }
    }
    console.log("Signup clicked");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <section className='bg-gray-50 text-black'>
      <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
        <div className='w-full bg-white rounded-lg shadow-lg shadow-gray-400 md:mt-0 sm:max-w-md xl:p-0'>
          <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
            <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl'>
              Create New Account
            </h1>
            <form className='space-y-4 md:space-y-6' onSubmit={onSignup}>
              <div>
                <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900'>
                  Your name
                </label>
                <input
                  autoComplete='on'
                  type='text'
                  name='name'
                  id='name'
                  className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                  placeholder='Name'
                  onChange={handleChange}
                  value={formValues.name}
                />
              </div>
              <div>
                <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900'>
                  Your email
                </label>
                <input
                  autoComplete='on'
                  type='email'
                  name='email'
                  id='email'
                  className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                  placeholder='name@company.com'
                  onChange={handleChange}
                  value={formValues.email}
                />
              </div>
              <div>
                <label htmlFor='password' className='block mb-2 text-sm font-medium text-gray-900'>
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
                />
              </div>
              <div>
                <label htmlFor='confirm-password' className='block mb-2 text-sm font-medium text-gray-900'>
                  Confirm password
                </label>
                <input
                  type='password'
                  name='confirmPassword'
                  id='confirm-password'
                  placeholder='••••••••'
                  className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                  onChange={handleChange}
                  value={formValues.confirmPassword}
                />
              </div>
              <button
                type='submit'
                className='w-full bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none bg-blue-600 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center text-white'>
                Create an account
              </button>
              <p className='text-sm font-light text-gray-500'>
                Already have an account?{' '}
                <Link to='/signin' className='font-medium text-primary-600 hover:underline'>
                  Sign in here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
