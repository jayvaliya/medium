import { useState } from 'react';
// import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";



export default function Signin() {
    const onSignin = (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Signin clicked");
      toast("Signin clicked");
    }

    const [formValues, setFormValues] = useState({
        email: '',
        password: '',
      });
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: value });
      };

  return (
    <section className='bg-gray-50 text-black'>
      <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
        <h1 className=' m-2 text-3xl font-bold'>Sign in</h1>
        <div className='w-full bg-white rounded-lg shadow-lg shadow-gray-400 md:mt-0 sm:max-w-md xl:p-0'>
          <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
            <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl'>
              Sign in to your account
            </h1>
            <form className='space-y-4 md:space-y-6' action='#'>
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
                />
              </div>
              <button
                onClick={onSignin}
                className='w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none bg-blue-600 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'>
                Sign in
              </button>

              <p className='text-sm font-light text-gray-500'>
                New here?{' '}
                <Link
                  to='/signup'
                  className='font-medium text-primary-600 hover:underline'>
                  Creater account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
